import Timeago from "react-timeago";
import {marketRow, marketRowNumber, shipyardRow, tag, tagList} from "@front/styles/app.css";
import {format} from "@common/lib/format";
import {Registry} from "@front/viewer/registry";
import {trpcReact} from "@front/trpc";
import {MarketRow} from "@front/components/MarketRow";
import {ShipyardRow} from "@front/components/ShipyardRow";
import {getDistance} from "@common/lib/getDistance";

export const WaypointInfo = ({ symbol }: {symbol: string}) => {
  const waypointData = Registry.waypointData[symbol || '']

  const query = trpcReact.getMarketInfo.useQuery({
    waypoint: symbol || ''
  })
  const currentWaypoint = trpcReact.getWaypoint.useQuery({
    symbol: symbol || ''
  })
  const shipyard = trpcReact.getShipyard.useQuery({
    waypointSymbol: symbol || ''
  })

  const updateWaypoint = trpcReact.updateWaypoint.useMutation()

  return <>
  {currentWaypoint.data?.chartSubmittedBy ? <div>Chart submitted by {currentWaypoint.data?.chartSubmittedBy} at {currentWaypoint.data?.chartSubmittedOn?.toLocaleString()}</div> : null}
  <div className={tagList}>
    {currentWaypoint.data?.traits.map(trait => <div className={tag} title={trait.description}>{trait.name}</div>)}
  </div>
    <div className={tagList}>
      {currentWaypoint.data?.modifiers.map(modifier => <div className={tag} title={modifier.description}>{modifier.name}</div>)}
    </div>
  <div>ExploreStatus: {currentWaypoint.data?.exploreStatus}</div>
  {currentWaypoint.data ? <button onClick={() => {

      updateWaypoint.mutateAsync({
        systemSymbol: currentWaypoint.data.systemSymbol,
        symbol: currentWaypoint.data.symbol,
      }).then(() => {
        currentWaypoint.refetch()
      })
    }}>Update</button> : null }
  {currentWaypoint.data?.construction ? <div>
    <h2>Construction</h2>
      <div>Completed: {currentWaypoint.data.construction.isCompleted ? 'Yes' : 'No'}</div>
      {currentWaypoint.data.construction.materials.map(material => <div>{material.tradeGoodSymbol} {format.format(material.fulfilled)}/{format.format(material.required)}</div>)}
    </div> : null }
  {currentWaypoint.data?.jumpConnectedTo ? <div>
    <h2>Jump</h2>
    <div>Connected to {currentWaypoint.data.jumpConnectedTo.map(c => <div>{c.symbol} ({getDistance(currentWaypoint.data.system, c.system)})</div>)}</div>
  </div> : null }
  {query.data ? <div>
    <h2>Marketplace (last update <Timeago date={currentWaypoint.data?.marketLastUpdated} />)</h2>
    <div className={marketRow.header}>
      <div></div>
      <div>Good</div>
      <div>K</div>
      <div>S</div>
      <div>A</div>
      <div className={marketRowNumber}>Volume</div>
      <div className={marketRowNumber}>Purchase</div>
      <div className={marketRowNumber}>Sell</div>
    </div>
    {query.data.map(market => <MarketRow market={market} />)}
  </div>: null }
  {shipyard.isFetched ? <div>
    <h2>Shipyard</h2>
    <div className={shipyardRow.header}>
      <div>Ship</div>
      <div className={marketRowNumber}>Speed</div>
      <div className={marketRowNumber}>Fuel</div>
      <div className={marketRowNumber}>Cargo</div>
      <div className={marketRowNumber}>Price</div>
    </div>
    {shipyard.data?.map(ship => <ShipyardRow ship={ship} />)}
  </div> : null}
  </>
}