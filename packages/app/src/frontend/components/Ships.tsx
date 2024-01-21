import {trpcReact} from "@front/trpc";
import {columnStyle, dataTable, pageColumn, rowStyle} from "@front/styles/app.css";
import {useSelector} from "react-redux";
import {RootState} from "@front/ui/store";
import Timeago from "react-timeago";

export const Ships = (props: {}) => {
  const ships = useSelector((state: RootState) => state.ship.ship)

  return <div className={pageColumn}>
    <table className={dataTable}>
      <thead>
      <tr>
        <th className={columnStyle.default}>Callsign</th>
        <th className={columnStyle.default}>Symbol</th>
        <th className={columnStyle.default}>Role</th>
        <th className={columnStyle.default}>Waypoint</th>
        <th className={columnStyle.default}>Navstatus</th>
        <th className={columnStyle.default}>Objective</th>
        <th className={columnStyle.default}>Flight Mode</th>
        <th className={columnStyle.default}>Fuel</th>
        <th className={columnStyle.default}>Cargo</th>
        <th className={columnStyle.default}>Arrival</th>
      </tr>
      </thead>
      <tbody>
      {Object.values(ships).sort((a,b) => {
        return a.role.localeCompare(b.role)
      }).map(ship => {
        const arrivalTime = ship.arrivalOn ? new Date(ship.arrivalOn).getTime() : null
        return <tr className={rowStyle.default}>
          <td className={columnStyle.default}>{ship.callsign.substring(0, 40)}</td>
          <td className={columnStyle.default}>{ship.symbol}</td>
          <td className={columnStyle.default}>{ship.role}</td>
          <td className={columnStyle.default}>{ship.currentWaypointSymbol}</td>
          <td className={columnStyle.default}>{ship.navStatus}</td>
          <td className={columnStyle.default}>{ship.objective}{ship.nextObjective ? ` / ${ship.nextObjective}` : ''}</td>
          <td className={columnStyle.default}>{ship.flightMode}</td>
          <td className={columnStyle.default}>{ship.fuelAvailable}/{ship.fuelCapacity}</td>
          <td className={columnStyle.default}>{ship.cargoUsed}/{ship.cargoCapacity}</td>
          <td className={columnStyle.default}>{arrivalTime && arrivalTime > Date.now() ? Math.round((arrivalTime - Date.now()) / 1000) : 'Arrived' }</td>
        </tr>
      })}
      </tbody>
    </table>
  </div>
}