import {trpcReact} from "@front/trpc";
import {dataTable, pageColumn} from "@front/styles/app.css";
import {useSelector} from "react-redux";
import {RootState} from "@front/ui/store";
import Timeago from "react-timeago";

export const Ships = (props: {}) => {
  const ships = useSelector((state: RootState) => state.ship.ship)

  return <div className={pageColumn}>
    <table className={dataTable}>
      <thead>
      <tr>
        <th>Callsign</th>
        <th>Symbol</th>
        <th>Role</th>
        <th>Waypoint</th>
        <th>Navstatus</th>
        <th>Overall goal</th>
        <th>Flight Mode</th>
        <th>Fuel</th>
        <th>Cargo</th>
        <th>Arrival</th>
      </tr>
      </thead>
      <tbody>
      {Object.values(ships).sort((a,b) => {
        return a.role.localeCompare(b.role)
      }).map(ship => {
        const arrivalTime = ship.arrivalOn ? new Date(ship.arrivalOn).getTime() : null
        return <tr>
          <td>{ship.callsign.substring(0, 40)}</td>
          <td>{ship.symbol}</td>
          <td>{ship.role}</td>
          <td>{ship.currentWaypointSymbol}</td>
          <td>{ship.navStatus}</td>
          <td>{ship.overalGoal}</td>
          <td>{ship.flightMode}</td>
          <td>{ship.fuelAvailable}/{ship.fuelCapacity}</td>
          <td>{ship.cargoUsed}/{ship.cargoCapacity}</td>
          <td>{arrivalTime && arrivalTime > Date.now() ? Math.round((arrivalTime - Date.now()) / 1000) : 'Arrived' }</td>
        </tr>
      })}
      </tbody>
    </table>
  </div>
}