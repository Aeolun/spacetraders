import {trpcReact} from "@front/trpc";
import {columnStyle, dataTable, pageColumn, rowStyle} from "@front/styles/app.css";
import {format} from "@common/lib/format";

export const Objectives = (props: {}) => {
  const objectives = trpcReact.getObjectives.useQuery()
  const objectiveData = objectives?.data?.objectiveData

  let sortedObjectives: { objective: string; creditReservation: number; priority: number; isPersistent?: boolean; type?: string; maxShips?: number, exists?: boolean }[] = []
  if (objectives.data) {
    sortedObjectives = [...objectives.data.objectives]

    // add objectives that aren't currently available
    objectiveData.executingObjectives.forEach(objective => {
      if (!sortedObjectives.find(o => o.objective === objective)) {
        sortedObjectives.push({objective, priority: 0, exists: false})
      }
    })

    sortedObjectives.sort((a, b) => {
      if (objectiveData.executingObjectives.includes(a.objective) !== objectiveData.executingObjectives.includes(b.objective)) {
        return objectiveData.executingObjectives.includes(a.objective) ? -1 : 1
      }
      return b.priority - a.priority
    });
  }

  return <div className={pageColumn}>
    <table className={dataTable}>
      <thead>
      <tr>
        <th className={columnStyle.default}>Priority</th>
        <th className={columnStyle.default}>Type / Persistent</th>

        <th className={columnStyle.default}>Objective</th>
        <th className={columnStyle.default}>Executing</th>
        <th className={columnStyle.default}>Max Ships</th>
        <th className={columnStyle.default}>Considered</th>
        <th className={columnStyle.right}>Reservation</th>
        <th className={columnStyle.default}>Ships Assigned</th>
      </tr>
      </thead>
      <tbody>
      {objectives.isFetched ? sortedObjectives.map(objective => {
        return <tr className={rowStyle[objective.exists === false ? 'nonexistent' : 'default']}>
          <td className={columnStyle.default}>{Math.round(objective.priority * 100) / 100}</td>
          <td className={columnStyle.default}>{objective.type} {objective.isPersistent ? '(P)' : ''}</td>
          <td className={columnStyle.default}>{objective.objective}</td>
          <td
            className={columnStyle.default}>{objectiveData.executingObjectives.includes(objective.objective) ? 'Yes' : 'No'}</td>
          <td
            className={columnStyle.default}>{objectiveData.executorsAssignedToObjective?.find(o => o.objective === objective.objective)?.executors.length ?? 0} / {objective.maxShips ?? 1}</td>
          <td className={columnStyle.right}>{objectiveData.lastTickAssignmentInfo.executorsConsideredForObjective[objective.objective]?.length}</td>
          <td className={columnStyle.right}>{objective.creditReservation ? format.format(objective.creditReservation) : undefined}</td>
          <td
            className={columnStyle.default}>{objectiveData.executorsAssignedToObjective?.find(o => o.objective === objective.objective)?.executors.join(', ')}</td>
        </tr>
      }) : null}
      </tbody>
    </table>
    <pre>
      {JSON.stringify(objectives.data?.objectiveData, null, 2)}
    </pre>
    <pre>
      {JSON.stringify(objectives.data?.objectives, null, 2)}
    </pre>
  </div>
}