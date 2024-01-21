import {
	ObjectiveInterface,
	TaskExecutor,
	TaskInterface,
} from "@auto/strategy/orchestrator/types";
import { uuidv7 } from "uuidv7";

interface TickAssignmentInfo {
	executorsConsideredForObjective: Record<string, {
		executor: string;
		travelTime: number;
		readyTime: number;
	}[]>;
}

export class Orchestrator<
	E extends TaskExecutor<TT, OT>,
	TT extends TaskInterface<E>,
	OT extends ObjectiveInterface,
> {
	private objectives: Record<string, OT> = {};
	private executingObjectives: string[] = [];
	private executorsAssignedToObjective: Record<string, Set<string>> = {};
	private executors: E[] = [];
	private availableCredits = 0;
	private creditsReserved = 0;
	private objectiveCreditReservations: {
		executionId: string;
		objective: string;
		creditReservation: number;
	}[] = [];
	private isDebugMode = false;
	private lastTickAssignmentInfo: TickAssignmentInfo

	constructor(
		executingObjectives: string[] = [],
		executorsAssignedToObjective: Record<string, Set<string>> = {},
		private options: {
			autostartControlLoop: boolean;
			debug?: boolean;
			getDistance: (executor: E, objective: OT) => number;
			getTravelTime: (executor: E, from: OT['startingLocation'], to: OT['startingLocation']) => Promise<number>;
			objectiveValid: (executor: E, objective: OT) => boolean;
			availableCredits?: number;
		} = { autostartControlLoop: true, getDistance: () => 0, getTravelTime: () => 0 },
	) {
		this.executingObjectives = executingObjectives;
		this.executorsAssignedToObjective = executorsAssignedToObjective;
		this.availableCredits = options.availableCredits ?? 0;
		this.isDebugMode = options.debug ?? false;
	}

	getObjectiveCount() {
		return Object.keys(this.objectives).length;
	}

	getExecutingObjectiveCount() {
		return this.executingObjectives.length;
	}

	setAvailableCredits(credits: number) {
		this.availableCredits = credits;
	}

	getExecutorsAssignedToObjective(objective: string) {
		return [...(this.executorsAssignedToObjective[objective] ?? new Set())];
	}

	public getObjectives() {
		return this.objectives;
	}

	public getObjectiveData() {
		return {
			objectiveIds: Object.keys(this.objectives),
			executingObjectives: this.executingObjectives,
			executorsAssignedToObjective: Object.keys(
				this.executorsAssignedToObjective,
			).map((objective) => {
				const executors = this.executorsAssignedToObjective[objective];
				return {
					objective,
					executors: Array.from(executors),
				};
			}),
			creditReservationPerObjective: this.objectiveCreditReservations.reduce(
				(acc, cur) => {
					if (!acc[cur.objective]) {
						acc[cur.objective] = 0;
					}
					acc[cur.objective] += cur.creditReservation;
					return acc;
				},
				{} as Record<string, number>,
			),
			lastTickAssignmentInfo: this.lastTickAssignmentInfo,
		};
	}

	private canAddObjective(objective: OT) {
		return (
			!this.executingObjectives.includes(objective.objective) ||
			objective.isPersistent ||
			objective.maxShips > 1
		);
	}

	addObjectiveIfNotExists(task: OT) {
		if (this.objectives[task.objective] || !this.canAddObjective(task)) {
			return;
		}
		this.objectives[task.objective] = task;
	}

	private debug(data: string) {
		if (this.isDebugMode || process.env.NODE_ENV !== 'test') {
			console.log(data);
		}
	}

	removeObjectivesOfType(type: OT["type"]) {
		for (const objectiveKey in this.objectives) {
			const o = this.objectives[objectiveKey];
			if (o.type === type) {
				delete this.objectives[objectiveKey];
			}
		}
	}

	addOrUpdateObjective(task: OT) {
		if (!this.canAddObjective(task)) {
			return;
		}

		this.objectives[task.objective] = task;
	}

	getExecutor(symbol: string) {
		return this.executors.find((s) => s.symbol === symbol);
	}

	isExecutingObjective(objective: string) {
		return this.executingObjectives.includes(objective);
	}

	public getAllSortedObjectives() {
		const availableCredits = this.availableCredits - this.creditsReserved;
		const shipObjectives = Object.values(this.objectives)
			.filter(
				(o: OT) =>
					!this.executorsAssignedToObjective[o.objective] ||
					this.executorsAssignedToObjective[o.objective].size < o.maxShips,
			)
			.filter(
				(o) =>
					o.creditReservation === 0 || o.creditReservation <= availableCredits,
			);
		shipObjectives.sort((a, b) => {
			if (a.priority !== b.priority) {
				//higher priority first
				return b.priority - a.priority;
			}
			return 0;
		});
		return shipObjectives;
	}

	public getSortedObjectives(ship: E) {
		const shipObjectives = this.getAllSortedObjectives().filter(
			(o) =>
				o.appropriateFor(ship),
		);
		shipObjectives.sort((a, b) => {
			if (a.priority !== b.priority) {
				//higher priority first
				return b.priority - a.priority;
			}
			return (
				this.options.getDistance(ship, a) - this.options.getDistance(ship, b)
			);
		});
		return shipObjectives;
	}

	async extractNextObjective(executor: E): Promise<OT | undefined> {
		const personalObjective = executor.getPersonalObjective();
		if (personalObjective) {
			return personalObjective;
		}

		const shipObjectives = this.getSortedObjectives(executor);

		let newObjective: OT | undefined;
		// only do if in same system

		if (shipObjectives.length > 0) {
			newObjective = shipObjectives[0];
		}
		if (newObjective) {
			await this.removeObjectiveIfNecessary(newObjective)
			return newObjective;
		}
		return undefined;
	}

	async removeObjectiveIfNecessary(newObjective: OT) {
		if (
			!newObjective.isPersistent &&
			this.getExecutorsAssignedToObjective(newObjective.objective).length +
			1 >=
			newObjective.maxShips
		) {
			// remove from available objectives
			delete this.objectives[newObjective.objective];
		}
	}

	public getReservedCredits() {
		return this.creditsReserved;
	}

	public hasExecutor(symbol: string) {
		return !!this.executors.find((es) => es.symbol === symbol);
	}

	private async setShipWorkingOnObjective(executor: E, objective: OT) {
		this.executingObjectives.push(objective.objective);
		// add ship to ships assigned to it
		if (!this.executorsAssignedToObjective[objective.objective]) {
			this.executorsAssignedToObjective[objective.objective] = new Set([]);
		}
		this.executorsAssignedToObjective[objective.objective].add(executor.symbol);
	}

	private async setShipNextObjective(executor: E, objective: OT) {
		this.executingObjectives.push(objective.objective);
		// add ship to ships assigned to it
		if (!this.executorsAssignedToObjective[objective.objective]) {
			this.executorsAssignedToObjective[objective.objective] = new Set([]);
		}
		this.executorsAssignedToObjective[objective.objective].add(executor.symbol);
	}

	private async removeShipWorkingOnObjective(executor: Pick<E, 'nextObjective' | 'currentObjective' | 'symbol'>, which: 'current' | 'next' = 'current') {
		console.log(
			`Removing objective ${executor.currentObjective} from executing objectives`,
		);
		const objectiveName = which === 'current' ? executor.currentObjective : executor.nextObjective;
		this.executingObjectives = this.executingObjectives.filter(
			(o) => o !== objectiveName,
		);
		// remove ship from ships assigned to it
		if (
			objectiveName &&
			this.executorsAssignedToObjective[objectiveName]
		) {
			console.log(
				`Removing ${executor.symbol} from executors assigned to ${executor.currentObjective}`,
			);
			this.executorsAssignedToObjective[objectiveName].delete(
				executor.symbol,
			);
		}
	}

	private addCreditsReserved(
		objective: string,
		executionId: string,
		creditReservation: number,
	) {
		this.creditsReserved += creditReservation;
		this.objectiveCreditReservations.push({
			executionId,
			objective,
			creditReservation: creditReservation,
		});
	}

	private removeCreditsReserved(executionId: string) {
		const reservation = this.objectiveCreditReservations.find(
			(r) => r.executionId === executionId,
		);
		if (!reservation) {
			return;
		}
		this.creditsReserved -= reservation.creditReservation;
		this.objectiveCreditReservations = this.objectiveCreditReservations.filter(
			(r) => r.executionId !== executionId,
		);
	}

	private getObjectiveFromId(objective: string) {
		return this.objectives[objective]
	}

	public async cancelObjectiveAssignment(executorSymbol: string, objective: string) {
		const executor = this.getExecutor(executorSymbol)
		if (!executor) {
			throw new Error(`Could not find executor ${executorSymbol}`)
		}

		if (executor.currentObjective === objective) {
			await this.removeShipWorkingOnObjective({symbol: executorSymbol, currentObjective: objective} as E, 'current')
			await executor.onObjectiveCancelled('current')
			await executor.clearTaskQueue()
		} else if (executor.nextObjective === objective) {
			await this.removeShipWorkingOnObjective({symbol: executorSymbol, nextObjective: objective} as E, 'next')
			await executor.onObjectiveCancelled('next')
		}
	}

	async tick() {
		const newAssignmentInfo: TickAssignmentInfo = {
			executorsConsideredForObjective: {}
		}
		// assign open executors to open objectives
		const assignableObjectives = this.getAllSortedObjectives()
		console.log(`Finding executors for ${assignableObjectives.length} assignable objectives`)
		for(const objective of assignableObjectives) {
			const potentialExecutors = this.executors.filter(e => objective.appropriateFor(e) && (!e.currentObjective || (!e.nextObjective && e.taskQueueLength > 0)) && this.options.objectiveValid(e, objective))

			newAssignmentInfo.executorsConsideredForObjective[objective.objective] = []

			if (potentialExecutors.length === 0) {
				continue;
			}

			if (this.getReservedCredits() + objective.creditReservation > this.availableCredits) {
				console.log(`Not enough credits to assign ${objective.objective} (any more), skipping`)
				continue;
			}

			const startCalculateTravelTimes = Date.now()
			const travelTime: Record<string, number> = {}
			for(const potentialExecutor of potentialExecutors) {
				travelTime[potentialExecutor.symbol] = await this.options.getTravelTime(potentialExecutor, potentialExecutor.getExpectedPosition(), objective.startingLocation);
				if (travelTime[potentialExecutor.symbol] === undefined) {
					throw new Error(`Could not calculate travel time for ${potentialExecutor.symbol} to start ${objective.objective}`)
				}
			}
			console.log(`Calculated travel times for ${potentialExecutors.length} executors in ${Date.now() - startCalculateTravelTimes}ms`);

			potentialExecutors.sort((a, b) => {
				const readyTimeA = a.getExpectedFreeTime() + travelTime[a.symbol]
				const readyTimeB = b.getExpectedFreeTime() + travelTime[b.symbol]

				return readyTimeA - readyTimeB
			})

			newAssignmentInfo.executorsConsideredForObjective[objective.objective] = potentialExecutors.map(e => ({
				executor: e.symbol,
				travelTime: travelTime[e.symbol],
				readyTime: e.getExpectedFreeTime() + travelTime[e.symbol]
			}))

			console.log(`Potential executors for ${objective.objective}: ${potentialExecutors.map(e => `${e.symbol} (${e.getExpectedFreeTime()}s till free, ${travelTime[e.symbol]}s till start)`)}`)

			let assigned = this.executorsAssignedToObjective[objective.objective]?.size ?? 0;
			for(const potentialExecutor of potentialExecutors) {
				if (assigned >= objective.maxShips) {
					break;
				}

				console.log(`Assigning ${potentialExecutor.symbol} to ${objective.objective}`)

				if (potentialExecutor.currentObjective) {
					console.log(`Setting ${potentialExecutor.symbol} next objective to ${objective.objective}`)

					const executionId = uuidv7();
					await potentialExecutor.onObjectiveAssigned(objective, executionId, 'next');
					this.addCreditsReserved(
						objective.objective,
						executionId,
						objective.creditReservation,
					);

					await this.setShipNextObjective(potentialExecutor, objective)
				} else {
					console.log(`Setting ${potentialExecutor.symbol} current objective to ${objective.objective}`)

					const executionId = uuidv7();
					await potentialExecutor.onObjectiveAssigned(objective, executionId);
					this.addCreditsReserved(
						objective.objective,
						executionId,
						objective.creditReservation,
					);

					await this.setShipWorkingOnObjective(potentialExecutor, objective)
				}
				assigned++;
			}
		}

		this.lastTickAssignmentInfo = newAssignmentInfo;
	}

	async tickExecutor(executor: E) {
		let nextTask: TT | undefined;
		if (executor.symbol === 'PHANTASM-4A') {
			console.log(`Tick for ${executor.symbol}`, {
				currentObjective: executor.currentObjective,
				currentObjectiveExecutionId: executor.currentExecutionId,
				nextObjective: executor.nextObjective,
				nextObjectiveExecutionId: executor.nextExecutionId,
				taskQueueLength: executor.taskQueueLength,
			});
		}
		if (executor.taskQueueLength > 0) {
			nextTask = await executor.getNextTask();
			if (nextTask) {
				try {
					this.debug(
						`starting task ${nextTask.type} for objective ${executor.currentObjective}`,
					);
					await executor.onTaskStarted(nextTask);

					await nextTask.execute(executor, this);
					await executor.finishedTask();
				} catch (e) {
					this.debug(
						`task ${nextTask.type} for objective ${executor.currentObjective} failed`,
					);
					await this.removeShipWorkingOnObjective(executor);
					await executor.clearTaskQueue();
					await executor.onTaskFailed(nextTask, e);
					if (executor.currentObjective && executor.currentExecutionId) {
						await executor.onObjectiveFailed(e, executor.currentExecutionId);
					}
				}
			}

			if (executor.taskQueueLength === 0) {
				await this.removeShipWorkingOnObjective(executor);
				if (executor.currentExecutionId) {
					this.debug(
						`completed objective ${executor.currentObjective} with execution id ${executor.currentExecutionId}`,
					);
					this.removeCreditsReserved(executor.currentExecutionId);
					await executor.onObjectiveCompleted(executor.currentExecutionId);
				} else {
					throw new Error("Completed objective without execution ID, stop the world!")
				}
			}
		} else if (executor.currentObjective && executor.currentExecutionId && executor.taskQueueLength === 0) {
			// objective assigned but tasks not added yet
			const nextObjective = this.getObjectiveFromId(executor.currentObjective);
			if (nextObjective) {
				try {
					this.debug(`starting new objective ${nextObjective.objective} from assigned objective id`)

					await nextObjective.constructTasks(executor);
					await this.removeObjectiveIfNecessary(nextObjective)

					await nextObjective.onStarted(executor, executor.currentExecutionId);
					await executor.onObjectiveStarted(nextObjective, executor.currentExecutionId);
				} catch (e) {
					this.debug(`objective ${nextObjective.objective} failed`);
					console.error(e);
					await nextObjective.onFailed(executor, e, executor.currentExecutionId);
					await this.removeCreditsReserved(executor.currentExecutionId);
					await this.removeShipWorkingOnObjective(executor);
					await executor.onObjectiveFailed(e, executor.currentExecutionId);
				}
			} else {
				this.debug(`objective ${executor.currentObjective} that executor ${executor.symbol} wants to start does not exist, and no existing tasks, clear objective`)
				await this.removeShipWorkingOnObjective(executor, 'current');
				await this.removeShipWorkingOnObjective(executor, 'next')
				await executor.clearObjectives();

				await executor.onNothingToDo('objective not found');
			}
		} else if (!executor.currentObjective && executor.nextObjective) {
			// next objective assigned and just completed previous objective
			const nextObjective = this.getObjectiveFromId(executor.nextObjective);

			if (!nextObjective) {
				this.debug(`no objective for ${executor.symbol}`)
				return;
			}

			await executor.onStartNextObjective()
		} else {
			let failureMode = 'no objectives'
			if (!executor.currentObjective && executor.currentExecutionId) {
				failureMode = 'inconsistent execution id and objective'
				await this.removeShipWorkingOnObjective(executor, 'current')
				await this.removeShipWorkingOnObjective(executor, 'next')
				await executor.clearObjectives()
			} else if (!executor.currentExecutionId && executor.currentObjective) {
				failureMode = 'inconsistent execution id and objective'
				await this.removeShipWorkingOnObjective(executor, 'current')
				await this.removeShipWorkingOnObjective(executor, 'next')
				await executor.clearObjectives()
			} else if (!executor.nextObjective && executor.nextExecutionId) {
				failureMode = 'inconsistent next execution id and objective'
				await this.removeShipWorkingOnObjective(executor, 'current')
				await this.removeShipWorkingOnObjective(executor, 'next')
				await executor.clearObjectives()
			} else if (!executor.nextExecutionId && executor.nextObjective) {
				failureMode = 'inconsistent next execution id and objective'
				await this.removeShipWorkingOnObjective(executor, 'current')
				await this.removeShipWorkingOnObjective(executor, 'next')
				await executor.clearObjectives()
			}

			// do not try to pull tasks. we assign them from the orchestrator tick
			await executor.onNothingToDo(failureMode);
			// no tasks assigned
			// const nextObjective = await this.extractNextObjective(executor);
			//
			// if (!nextObjective) {
			// 	this.debug(`no objective for ${executor.symbol}`);
			// 	await executor.onNothingToDo();
			// } else {
			// 	const executionId = uuidv7();
			// 	try {
			// 		this.debug(
			// 			`starting new objective ${nextObjective.objective} with execution id ${executionId}`,
			// 		);
			// 		executor.currentExecutionId = executionId;
			// 		this.addCreditsReserved(
			// 			nextObjective.objective,
			// 			executionId,
			// 			nextObjective.creditReservation,
			// 		);
			//
			// 		await this.setShipWorkingOnObjective(executor, nextObjective);
			//
			// 		await nextObjective.constructTasks(executor);
			//
			// 		await nextObjective.onStarted(executor, executionId);
			// 		await executor.onObjectiveStarted(nextObjective, executionId);
			// 	} catch (e) {
			// 		this.debug(`objective ${nextObjective.objective} failed`);
			// 		console.error(e);
			// 		await nextObjective.onFailed(executor, e, executionId);
			// 		this.removeCreditsReserved(executionId);
			// 		await this.removeShipWorkingOnObjective(executor);
			// 		await executor.onObjectiveFailed(nextObjective, e, executionId);
			// 	}
			// }
		}
	}

	async addExecutor(executor: E) {
		if (this.hasExecutor(executor.symbol)) {
			console.log("Ship already added");
			return;
		}
		this.executors.push(executor);

		// prepare to run the loop for this ship
		await executor.prepare();

		if (this.options.autostartControlLoop) {
			console.log("Starting control loop")
			this.startControlLoop(executor).catch(error => {
				console.error("Error during control loop", error)
			});
		}
	}

	async startControlLoop(executor: E) {
		// circuit breaker
		let eventsInLastSecond = 0;
		setInterval(() => {
			eventsInLastSecond = 0;
		}, 1000);
		while (true) {
			eventsInLastSecond++;
			if (eventsInLastSecond > 3) {
				console.error(`Too many events (${eventsInLastSecond}) in last second, breaking circuit for executor ${executor.symbol}. This is a fatal error.`)
				process.exit(1)
			}

			await this.tickExecutor(executor);
		}
	}
}
