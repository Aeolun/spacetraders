import Timeago from "react-timeago";
import {Registry} from "@front/viewer/registry";
import {RootState} from "@front/ui/store";
import { useSelector } from "react-redux";
import {trpcReact} from "@front/trpc";

export const ShipInfo = (props: { symbol: string }) => {
  const shipData = useSelector((select: RootState) => select.ship.ship[props.symbol]);
  const goodsData = useSelector((select: RootState) => select.goods.goods);
  const shipLog = trpcReact.getShipLog.useQuery({
    shipSymbol: props.symbol
  })

  return <div>
    <div>Role: {shipData.role}</div>
    <div>Callsign: {shipData.callsign}</div>
    <div>Navstatus: {shipData.navStatus}</div>
    <div>Overall goal: {shipData.overalGoal}</div>
    <div>Flight Mode: {shipData.flightMode}</div>
    <div>Target: {shipData.destinationWaypoint?.symbol}</div>
    <div>Arrival: { shipData.arrivalOn ? <Timeago date={shipData.arrivalOn} /> : null }</div>
    <div>Timeout: { shipData.reactorCooldownOn ? <Timeago date={shipData.reactorCooldownOn} /> : null }</div>
    <div>Speed: {shipData.engine.speed}</div>
    <div>Fuel: {shipData.fuelAvailable}/{shipData.fuelCapacity}</div>
    <div>Cargo: {shipData.cargoUsed}/{shipData.cargoCapacity}</div>
    <h2>Cargo</h2>
    <ul>{shipData.cargo.map(cargo => {
      return <li><img src={"textures/icons/GOOD_"+cargo.tradeGoodSymbol+'.png'} />{cargo.tradeGoodSymbol} x{cargo.units} ₡{goodsData[cargo.tradeGoodSymbol].sellP95*cargo.units} (₡{goodsData[cargo.tradeGoodSymbol].sellP95} per)</li>
    })}</ul>
    <h2>
      Tasks</h2>
    <ul>{shipData.ShipTask.map(task => {
      return <li>{task.type} {task.data}</li>
    })}</ul>
    <h2>Modules</h2>
    <div>Frame: {shipData.frame.name}</div>
    <div>Engine: {shipData.engine.name}</div>
    <div>Reactor: {shipData.reactor.name}</div>

    <ul>{shipData.modules.map(module => {
      return <li>{module.name}</li>
    })}</ul>
    <ul>{shipData.mounts.map(mount => {
      return <li>{mount.name}</li>
    })}</ul>
    {shipLog.isFetched ? <div>
      <h2>Log</h2>
      <ul>{shipLog.data?.map(log => {
        return <li>{log.createdAt.toString()} {log.message}</li>
      })}</ul>
    </div> : null}
  </div>
}