import * as appStyles from "@front/styles/app.css";
import {Link, Outlet} from "react-router-dom";
import {format} from "@common/lib/format";
import {useSelector} from "react-redux";
import {RootState} from "@front/ui/store";
import {PropsWithChildren} from "react";
import {World} from "@front/components/World";
import {universeView} from "@front/viewer/UIElements";
import {Registry} from "@front/viewer/registry";

export const Layout = ({ children }: PropsWithChildren) => {
  const credits = useSelector((select: RootState) => select.agent.credits)

  return <div className={appStyles.app}>

    <div className={appStyles.menu}>
      <Link className={appStyles.menuItem} to={'/'}>Main</Link>
      <Link className={appStyles.menuItem} to={'/ships'}>Ships</Link>
      <Link className={appStyles.menuItem} to={'/waypoints'}>Waypoints</Link>
      <Link className={appStyles.menuItem} to={'/systems'}>Systems</Link>
      <Link className={appStyles.menuItem} to={'/trades'}>Trades</Link>
      <Link className={appStyles.menuItem} to={'/objectives'}>Objectives</Link>
      <div className={appStyles.agentInfo}><input type={'text'} placeholder={'search'} onKeyDown={(e) => {
        if (e.which === 13) {
          const shipLocation = Registry.universeShips[e.currentTarget.value]
          if (shipLocation) {
            universeView.zoom(0.5, true)
            universeView.moveCenter(shipLocation.x+150, shipLocation.y)
            shipLocation.select();
          }
          const system = Registry.systems[e.currentTarget.value]
          if (system) {
            universeView.zoom(0.5, true)
            universeView.moveCenter(system.x + 150, system.y)
            system.select();
          }
          const waypoint = Registry.waypoints[e.currentTarget.value]
          if (waypoint) {
            universeView.zoom(0.5, true)
            universeView.moveCenter(waypoint.x + 150, waypoint.y)
            waypoint.select();
          }
        }
      }} /></div>
      <div className={appStyles.agentInfo}>
        {format.format(credits)}
      </div>
    </div>
    {children ?? <Outlet /> }
  </div>
}