import * as appStyles from "@front/styles/app.css";
import {Link, Outlet} from "react-router-dom";
import {format} from "@common/lib/format";
import {useSelector} from "react-redux";
import {RootState} from "@front/ui/store";
import {PropsWithChildren} from "react";
import {World} from "@front/components/World";

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
      <div className={appStyles.agentInfo}>
        {format.format(credits)}
      </div>
    </div>
    {children ?? <Outlet /> }
  </div>
}