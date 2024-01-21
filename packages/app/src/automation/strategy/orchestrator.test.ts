import {expect, test, describe} from "vitest";
import {Orchestrator} from "@auto/strategy/orchestrator";

import {ObjectiveInterface} from "@auto/strategy/orchestrator/types";
import {MockExecutor, mockGetDistance, MockObjective, MockTask} from "@auto/strategy/orchestrator/mocks";

describe("orchestrator", () => {
  test("orchestrator removes objective from options once retrieved", async () => {
    const orch = new Orchestrator<MockExecutor, MockTask, MockObjective>([], {}, {
      autostartControlLoop: false,
      getDistance: mockGetDistance
    })

    const mockExecutor1 = new MockExecutor('mock1', {
      x: 0,
      y: 0
    })
    const mockExecutor2 = new MockExecutor('mock2', {
      x: 0,
      y: 0
    })

    orch.addExecutor(mockExecutor1)
    orch.addExecutor(mockExecutor2)

    const mockObjective1 = new MockObjective({
      type: 'explore',
      position: {
        x: 0,
        y: 0
      }
    });

    const mockObjective2 = new MockObjective({
      type: 'explore',
      position: {
        x: 0,
        y: 0
      }
    });

    orch.addObjectiveIfNotExists(mockObjective1)
    orch.addObjectiveIfNotExists(mockObjective2)

    const nextObjective = await orch.extractNextObjective(mockExecutor1)
    expect(nextObjective?.objective).toBe("explore-0-0")

    const nextObjective2 = await orch.extractNextObjective(mockExecutor2)
    expect(nextObjective2?.objective).toBe(undefined)
  })

  test("executor prefers objective that is closer when otherwise equal", async () => {
    const orch = new Orchestrator<MockExecutor, MockTask, MockObjective>([], {}, {
      autostartControlLoop: false,
      getDistance: mockGetDistance
    })

    const mockExecutor1 = new MockExecutor('mock1', {
      x: 10,
        y: 10
    })
    const mockExecutor2 = new MockExecutor('mock2', {
      x: 0,
      y: 0
    })

    orch.addExecutor(mockExecutor1)
    orch.addExecutor(mockExecutor2)

    const mockObjective1 = new MockObjective({
      type: 'explore',
      position: {
        x: 0,
        y: 0
      }
    });

    const mockObjective2 = new MockObjective({
      type: 'explore2',
      position: {
        x: 9,
        y: 9
      }
    });

    orch.addObjectiveIfNotExists(mockObjective1)
    orch.addObjectiveIfNotExists(mockObjective2)

    const nextObjective = await orch.extractNextObjective(mockExecutor1)
    expect(nextObjective?.objective).toBe("explore2-9-9")

    const nextObjective2 = await orch.extractNextObjective(mockExecutor2)
    expect(nextObjective2?.objective).toBe("explore-0-0")
  })

  test("orchestrator will not assign more than maxShips to objective", async () => {
    const orch = new Orchestrator<MockExecutor, MockTask, MockObjective>([], {}, {
      autostartControlLoop: false,
      getDistance: mockGetDistance
    })

    const mockExecutor1 = new MockExecutor('mock1', {
      x: 0,
      y: 0
    })
    const mockExecutor2 = new MockExecutor('mock2', {
      x: 0,
      y: 0
    })
    const mockExecutor3 = new MockExecutor('mock3', {
      x: 0,
      y: 0
    })

    orch.addExecutor(mockExecutor1)
    orch.addExecutor(mockExecutor2)
    orch.addExecutor(mockExecutor3)

    const mockObjective1 = new MockObjective({
      type: 'explore',
      position: {
        x: 0,
        y: 0
      },
      maxShips: 2,
      isPersistent: true
    });

    orch.addObjectiveIfNotExists(mockObjective1)

    await orch.tickExecutor(mockExecutor1)
    await orch.tickExecutor(mockExecutor2)
    await orch.tickExecutor(mockExecutor3)

    expect(mockExecutor1.currentObjective).toBe("explore-0-0")
    expect(mockExecutor2.currentObjective).toBe("explore-0-0")
    expect(mockExecutor3.currentObjective).toBe(undefined)

    expect(orch.getExecutorsAssignedToObjective(mockExecutor1.currentObjective ?? '')).toMatchObject(['mock1', 'mock2'])
  })

  test("orchestrator will keep nonPersistent objective around until maxShips have been assigned", async () => {
    const orch = new Orchestrator<MockExecutor, MockTask, MockObjective>([], {}, {
      autostartControlLoop: false,
      getDistance: mockGetDistance
    })

    const mockExecutor1 = new MockExecutor('mock1', {
      x: 0,
      y: 0
    })
    const mockExecutor2 = new MockExecutor('mock2', {
      x: 0,
      y: 0
    })
    const mockExecutor3 = new MockExecutor('mock3', {
      x: 0,
      y: 0
    })

    orch.addExecutor(mockExecutor1)
    orch.addExecutor(mockExecutor2)
    orch.addExecutor(mockExecutor3)

    const mockObjective1 = new MockObjective({
      type: 'explore',
      position: {
        x: 0,
        y: 0
      },
      maxShips: 2
    });

    orch.addObjectiveIfNotExists(mockObjective1)

    await orch.tickExecutor(mockExecutor1)

    expect(mockExecutor1.currentObjective).toBe("explore-0-0")
    expect(orch.isExecutingObjective(mockExecutor1.currentObjective ?? '')).toBe(true)
    expect(orch.getObjectives().find(o => o.objective === 'explore-0-0')).toBeTruthy()

    await orch.tickExecutor(mockExecutor2)

    expect(mockExecutor2.currentObjective).toBe("explore-0-0")
    expect(orch.getObjectives().find(o => o.objective === 'explore-0-0')).toBeFalsy()

    await orch.tickExecutor(mockExecutor3)
    expect(mockExecutor3.currentObjective).toBe(undefined)

    expect(orch.getExecutorsAssignedToObjective(mockExecutor1.currentObjective ?? '')).toMatchObject(['mock1', 'mock2'])
  })

  test("will not allow executing objectives if credit reservation not met", async () => {
    const orch = new Orchestrator<MockExecutor, MockTask, MockObjective>([], {}, {
      autostartControlLoop: false,
      getDistance: mockGetDistance,
      availableCredits: 1000
    })

    const mockExecutor1 = new MockExecutor('mock1', {
      x: 0,
      y: 0
    })

    orch.addExecutor(mockExecutor1)

    const mockObjective1 = new MockObjective({
      type: 'explore',
      position: {
        x: 0,
        y: 0
      },
      creditReservation: 1000
    });
    const mockObjective2 = new MockObjective({
      type: 'explore',
      position: {
        x: 1,
        y: 1
      },
      creditReservation: 1000
    });

    orch.addObjectiveIfNotExists(mockObjective1)
    orch.addObjectiveIfNotExists(mockObjective2)

    await orch.tickExecutor(mockExecutor1)

    expect(mockExecutor1.currentObjective).toBe("explore-0-0")

    const objectives = orch.getSortedObjectives(mockExecutor1)
    expect(objectives.length).toBe(0)
  })

  test("allow executing objectives after credit reservation has been released", async () => {
    const orch = new Orchestrator<MockExecutor, MockTask, MockObjective>([], {}, {
      autostartControlLoop: false,
      getDistance: mockGetDistance,
      availableCredits: 1000
    })

    const mockExecutor1 = new MockExecutor('mock1', {
      x: 0,
      y: 0
    })

    orch.addExecutor(mockExecutor1)

    const mockObjective1 = new MockObjective({
      type: 'explore',
      position: {
        x: 0,
        y: 0
      },
      creditReservation: 1000
    });
    const mockObjective2 = new MockObjective({
      type: 'explore',
      position: {
        x: 1,
        y: 1
      },
      creditReservation: 1000
    });

    orch.addObjectiveIfNotExists(mockObjective1)
    orch.addObjectiveIfNotExists(mockObjective2)

    await orch.tickExecutor(mockExecutor1)

    expect(orch.getReservedCredits()).toBe(1000);
    await orch.tickExecutor(mockExecutor1) // finish the task

    expect(orch.getReservedCredits()).toBe(0);

    expect(mockExecutor1.currentObjective).toBe('')

    const objectives = orch.getSortedObjectives(mockExecutor1)
    expect(objectives.length).toBe(1)
  })

  test("ship will create new tasks for current objective if assigned while idle", async () => {
    const orch = new Orchestrator<MockExecutor, MockTask, MockObjective>([], {}, {
      autostartControlLoop: false,
      debug: true,
      getDistance: mockGetDistance,
      availableCredits: 1000
    })

    const mockExecutor1 = new MockExecutor('mock1', {
      x: 0,
      y: 0
    })

    orch.addExecutor(mockExecutor1)

    const mockObjective1 = new MockObjective({
      type: 'explore',
      position: {
        x: 0,
        y: 0
      },
      creditReservation: 1000
    });
    const mockObjective2 = new MockObjective({
      type: 'explore',
      position: {
        x: 1,
        y: 1
      },
      creditReservation: 1000
    });

    orch.addObjectiveIfNotExists(mockObjective1)
    orch.addObjectiveIfNotExists(mockObjective2)

    await orch.tickExecutor(mockExecutor1) // starts objective 1

    await orch.tickExecutor(mockExecutor1) // finish current objective
    expect(mockExecutor1.currentObjective).toBe('');
    // in execution executor spends 10 seconds idle here.
    mockExecutor1.setObjective('explore-1-1')
    await orch.tickExecutor(mockExecutor1) // starts objective 2

    expect(mockExecutor1.currentObjective).toBe('explore-1-1')
    expect(mockExecutor1.taskQueueLength).toBe(1)

    const objectives = orch.getSortedObjectives(mockExecutor1)
    expect(objectives.length).toBe(0)
  })

  test("ship will pick up next objective if assigned while executing", async () => {
    const orch = new Orchestrator<MockExecutor, MockTask, MockObjective>([], {}, {
      autostartControlLoop: false,
      debug: true,
      getDistance: mockGetDistance,
      availableCredits: 1000
    })

    const mockExecutor1 = new MockExecutor('mock1', {
      x: 0,
      y: 0
    })

    orch.addExecutor(mockExecutor1)

    const mockObjective1 = new MockObjective({
      type: 'explore',
      position: {
        x: 0,
        y: 0
      },
      creditReservation: 1000
    });
    const mockObjective2 = new MockObjective({
      type: 'explore',
      position: {
        x: 1,
        y: 1
      },
      creditReservation: 1000
    });

    orch.addObjectiveIfNotExists(mockObjective1)
    orch.addObjectiveIfNotExists(mockObjective2)

    await orch.tickExecutor(mockExecutor1) // starts objective 1
    mockExecutor1.setNextObjective('explore-1-1')

    await orch.tickExecutor(mockExecutor1) // finish current objective
    expect(mockExecutor1.currentObjective).toBe('');
    await orch.tickExecutor(mockExecutor1) // starts objective 2

    expect(mockExecutor1.currentObjective).toBe('explore-1-1')

    const objectives = orch.getSortedObjectives(mockExecutor1)
    expect(objectives.length).toBe(0)
  })
})