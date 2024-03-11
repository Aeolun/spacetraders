import {trpcReact} from "@front/trpc";
import {
  columnStyle,
  dataTable,
  tradeActivity,
  pageColumn,
  rowStyle,
  tradeActivitySection,
  tradeActivityVolume
} from "@front/styles/app.css";
import {format, fractionalFormat} from "@common/lib/format";
import {Link, useParams} from "react-router-dom";
import {WaypointList} from "@front/components/WaypointList";

export const SystemInfo = (props: {}) => {
  const params = useParams()
  return <div className={pageColumn}>
    <h1>System info</h1>
    <Link to={'market'}>Market</Link>

    <WaypointList systemSymbol={params.systemSymbol} />
  </div>
}