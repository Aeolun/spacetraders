import {useSelector, useStore} from "react-redux";
import {RootState} from "@front/ui/store";
import {Registry} from "@front/viewer/registry";
import {trpcReact} from "@front/trpc";
import Timeago from 'react-timeago'
import {marketRow} from "@front/styles/app.css";


export const SelectionDisplay = () => {
  const selection = useSelector((select: RootState) => select.selection.selection);

  const waypointData = Registry.waypointData[selection?.symbol || '']
  const shipData = Registry.shipData[selection?.symbol || '']

  const query = trpcReact.getMarketInfo.useQuery({
    waypoint: selection?.symbol || ''
  })

  return selection ? <div>
    <div>{selection.type} {selection.symbol}</div>
    {selection.type === 'waypoint' ? <div>
      {waypointData.chartSubmittedBy ? <div>Chart submitted by {waypointData.chartSubmittedBy} at {waypointData.chartSubmittedOn?.toLocaleString()}</div> : null}
      {waypointData.traits.map(trait => <div>{trait.name}</div>)}
      <div>ExploreStatus: {waypointData.exploreStatus}</div>
      {query.data ? <div>
        <h2>Marketplace</h2>
        {query.data.map(market => <div className={marketRow}>
          <div>{market.tradeGoodSymbol}</div>
            <div>{market.purchasePrice}</div>
            <div>{market.sellPrice}</div>
        </div>)}
      </div>: null }
    </div> : null}
    {selection.type === 'ship' ? <div>
      <div>{shipData.role}</div>
      <div>Navstatus: {shipData.navStatus}</div>
      <div>Flight Mode: {shipData.flightMode}</div>
      <div>Target: {shipData.destinationWaypoint?.symbol}</div>
      <div>Arrival: { shipData.arrivalOn ? <Timeago date={shipData.arrivalOn} /> : null }</div>
      <div>Timeout: {shipData.reactorCooldownOn}</div>
      <div>Speed: {shipData.engine.speed}</div>
      <div>Fuel: {shipData.fuelAvailable}/{shipData.fuelCapacity}</div>
      <div>Cargo: {shipData.cargoUsed}/{shipData.cargoCapacity}</div>
    </div> : null}
  </div> : <div>nothing selected</div>
}