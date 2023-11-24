import {trpcReact} from "@front/trpc";
import {pageColumn} from "@front/styles/app.css";

export const Objectives = (props: {}) => {
  const objectives = trpcReact.getObjectives.useQuery()

  return <div className={pageColumn}>
    <h2>Objectives</h2>
    <p>Objectives are the goals of the mission. They are ordered by priority.</p>
    <pre>
      {JSON.stringify(objectives.data?.objectiveData, null, 2)}
    </pre>
    <ul>{objectives.isFetched ? objectives.data?.objectives.map(objective => {
      return <li>{objective.priority} {objective.objective}</li>
    }) : null}</ul>
  </div>
}