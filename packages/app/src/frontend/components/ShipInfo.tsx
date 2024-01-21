import Timeago from "react-timeago";
import {Registry} from "@front/viewer/registry";
import {RootState} from "@front/ui/store";
import { useSelector } from "react-redux";
import {trpcReact} from "@front/trpc";
import {timeAgo} from "@common/lib/time-ago";
import {useEffect} from "react";
import {pill} from "@front/styles/app.css";

export const ShipInfo = (props: { symbol: string }) => {
  const shipData = useSelector((select: RootState) => select.ship.ship[props.symbol]);
  const goodsData = useSelector((select: RootState) => select.goods.goods);
  const shipLog = trpcReact.getShipLog.useQuery({
    shipSymbol: props.symbol
  })
  const shipInfo = trpcReact.shipData.useQuery({
    symbol: props.symbol
  })
  const cancelTask = trpcReact.cancelObjective.useMutation()


  useEffect(() => {
    if (shipLog.isFetched) {
      shipLog.refetch();
    }
  }, [shipData, goodsData])

  return <div>
    <div>Role: {shipInfo.data?.role}</div>
    <div>Callsign: {shipInfo.data?.callsign}</div>
    <div>Navstatus: {shipInfo.data?.navStatus}</div>
    <div>Overall goal: {shipInfo.data?.objective} {shipInfo.data?.objectiveExecutionId} { shipInfo.data?.objective ? <a onClick={() => {
      cancelTask.mutate({
        shipSymbol: props.symbol,
        objective: shipInfo.data.objective!
      })
    }}
                                                                                                                            style={{color: "red"}}>Cancel</a> : null }</div>
    <div>Next goal: {shipInfo.data?.nextObjective} {shipInfo.data?.nextObjectiveExecutionId} { shipInfo.data?.nextObjective ? <a onClick={() => {
      cancelTask.mutate({
        shipSymbol: props.symbol,
        objective: shipInfo.data.nextObjective!
      })
    }}
      style={{color: "red"}}>Cancel</a> : null }</div>
    <div>Flight Mode: {shipInfo.data?.flightMode}</div>
    <div>Cargo State: {shipInfo.data?.cargoState}</div>
    <div>Target: {shipInfo.data?.destinationWaypoint?.symbol}</div>
    <div>Arrival: { shipInfo.data?.arrivalOn ? <Timeago date={shipInfo.data?.arrivalOn} /> : null }</div>
    <div>Timeout: { shipInfo.data?.reactorCooldownOn ? <Timeago date={shipInfo.data?.reactorCooldownOn} /> : null }</div>
    <div>Speed: {shipInfo.data?.engine.speed}</div>
    <div>Fuel: {shipInfo.data?.fuelAvailable}/{shipData.fuelCapacity}</div>
    <div>Cargo: {shipInfo.data?.cargoUsed}/{shipInfo.data?.cargoCapacity}</div>
    <h2>Cargo</h2>
    <ul>{shipInfo.data?.cargo.map(cargo => {
      return <li><img src={"textures/icons/GOOD_"+cargo.tradeGoodSymbol+'.png'} />{cargo.tradeGoodSymbol} x{cargo.units} ₡{goodsData[cargo.tradeGoodSymbol].sellP95*cargo.units} (₡{goodsData[cargo.tradeGoodSymbol].sellP95} per)</li>
    })}</ul>
    <h2>
      Tasks</h2>
    <ul>{shipInfo.data?.shipTasks.map((task, index) => {
      const taskData = JSON.parse(task.data)
      if (task.type === 'TRAVEL') {
        return <li><span className={pill}>{task.type}</span> {shipInfo.data.taskStartedOn && index === 0 ? '(in progress)' : null} {taskData.travelMethod} {taskData.destination.waypoint.symbol}</li>
      }
      if (task.type === 'SELL') {
        return <li><span
          className={pill}>{task.type}</span> {shipInfo.data.taskStartedOn && index === 0 ? '(in progress)' : null} {taskData.tradeSymbol} x{taskData.units}
        </li>
      }
      if (task.type === 'PURCHASE') {
        return <li><span className={pill}>{task.type}</span> {shipInfo.data.taskStartedOn && index === 0 ? '(in progress)' : null} {taskData.tradeSymbol} x{taskData.units}</li>
      }
      return <li><span
        className={pill}>{task.type}</span> {shipInfo.data.taskStartedOn && index === 0 ? '(in progress)' : null} {task.data}
      </li>
    })}</ul>
    <h2>Modules</h2>
    <div>Frame: {shipInfo.data?.frame.name}</div>
    <div>Engine: {shipInfo.data?.engine.name}</div>
    <div>Reactor: {shipInfo.data?.reactor.name}</div>

    <ul>{shipInfo.data?.modules.map(module => {
      return <li>{module.name}</li>
    })}</ul>
    <ul>{shipInfo.data?.mounts.map(mount => {
      return <li>{mount.name}</li>
    })}</ul>
    {shipLog.isFetched ? <div>
      <h2>Log</h2>
      <ul>{shipLog.data?.map(log => {
        return <li style={{
          color: log.level === 'ERROR' ? 'red' : 'inherit'
        }}>{timeAgo(log.createdAt)} {log.level}: {log.message}</li>
      })}</ul>
    </div> : null}
  </div>
}