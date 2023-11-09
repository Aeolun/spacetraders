import {useSelector, useStore} from "react-redux";
import {RootState} from "@front/ui/store";
import {Registry} from "@front/viewer/registry";
import {trpcReact} from "@front/trpc";
import Timeago from 'react-timeago'
import {marketRow, marketRowNumber, shipyardRow} from "@front/styles/app.css";
import {format} from "@common/lib/format";


export const SelectionDisplay = () => {
  const selection = useSelector((select: RootState) => select.selection.selection);

  const waypointData = Registry.waypointData[selection?.symbol || '']
  const shipData = Registry.shipData[selection?.symbol || '']

  const query = trpcReact.getMarketInfo.useQuery({
    waypoint: selection?.symbol || ''
  })
  const shipyard = trpcReact.getShipyard.useQuery({
    waypointSymbol: selection?.symbol || ''
  })

  return selection ? <div>
    <div>{selection.type} {selection.symbol}</div>
    {selection.type === 'waypoint' ? <div>
      {waypointData.chartSubmittedBy ? <div>Chart submitted by {waypointData.chartSubmittedBy} at {waypointData.chartSubmittedOn?.toLocaleString()}</div> : null}
      {waypointData.traits.map(trait => <div>{trait.name}</div>)}
      <div>ExploreStatus: {waypointData.exploreStatus}</div>
      {query.data ? <div>
        <h2>Marketplace (last update <Timeago date={waypointData.marketLastUpdated} />)</h2>
        {query.data.map(market => <div className={marketRow}>
          <div><img src={'textures/icons/GOOD_'+market.tradeGoodSymbol+'.png'} title={market.tradeGoodSymbol} alt={market.tradeGoodSymbol} /></div>
          <div>{market.tradeGoodSymbol}</div>
          <div><img src={'textures/icons/'+market.kind+'.png'} title={market.kind} alt={market.kind} /></div>
          <div><img src={'textures/icons/'+market.supply+'.png'} title={market.supply} alt={market.supply} /></div>
          <div>{market.activityLevel ? <img src={'textures/icons/'+market.activityLevel+'.png'} title={market.activityLevel} alt={market.activityLevel} /> : null}</div>
          <div className={marketRowNumber}>{format.format(market.tradeVolume)}</div>
            <div className={marketRowNumber}>{format.format(market.purchasePrice)}</div>
            <div className={marketRowNumber}>{format.format(market.sellPrice)}</div>
        </div>)}
      </div>: null }
      {shipyard.isFetched ? <div>
        <h2>Shipyard</h2>
        {shipyard.data?.map(ship => <div className={shipyardRow}>
          <div>{ship.shipConfigurationSymbol}</div>
          <div>{ship.price}</div>
        </div>)}
      </div> : null}
    </div> : null}
    {selection.type === 'ship' ? <div>
      <div>{shipData.role}</div>
      <div>Navstatus: {shipData.navStatus}</div>
      <div>Overall goal: {shipData.overalGoal}</div>
      <div>Flight Mode: {shipData.flightMode}</div>
      <div>Target: {shipData.destinationWaypoint?.symbol}</div>
      <div>Arrival: { shipData.arrivalOn ? <Timeago date={shipData.arrivalOn} /> : null }</div>
      <div>Timeout: {shipData.reactorCooldownOn}</div>
      <div>Speed: {shipData.engine.speed}</div>
      <div>Fuel: {shipData.fuelAvailable}/{shipData.fuelCapacity}</div>
      <div>Cargo: {shipData.cargoUsed}/{shipData.cargoCapacity}</div>
      <h2>Cargo</h2>
      <ul>{shipData.cargo.map(cargo => {
        return <li><img src={"textures/icons/GOOD_"+cargo.tradeGoodSymbol+'.png'} />{cargo.tradeGoodSymbol} x{cargo.units}</li>
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
    </div> : null}
  </div> : <div>nothing selected</div>
}