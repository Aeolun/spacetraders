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
import { Link } from "react-router-dom";
import {getDistance} from "@common/lib/getDistance";

export const WaypointList = (props: {
  systemSymbol: string
}) => {
  const waypoints = trpcReact.getWaypoints.useQuery({ systemSymbol: props.systemSymbol })

  if (!waypoints.isFetched) {
    return <div>Loading</div>
  }

  const sortedWaypoints = waypoints.data?.waypoints.sort((a, b) => {
    const aDistance = getDistance(a, {x: 0, y: 0})
    const bDistance = getDistance(b, {x: 0, y: 0})
    return aDistance - bDistance
  })


  return <div className={pageColumn}>
    <table className={dataTable}>
      <thead>
      <tr>
        <th className={columnStyle.default}>Type</th>
        <th className={columnStyle.default}>Position</th>
        <th className={columnStyle.default}>Symbol</th>
        <th className={columnStyle.default}>Faction</th>
        <th className={columnStyle.default}>Traits</th>
        <th className={columnStyle.default}>Exports</th>
        <th className={columnStyle.default}>Imports</th>
      </tr>
      </thead>
      <tbody>
      {sortedWaypoints?.filter(wp => !wp.orbitsSymbol).map(waypoint => {
        return <>
          <tr key={waypoint.symbol} className={rowStyle['default']}>
            <td className={columnStyle.default}><img src={`textures/planets/${waypoint.type}.png`}
                                                     title={waypoint.type}/></td>
            <td className={columnStyle.default}>{waypoint.x}, {waypoint.y}</td>
            <td className={columnStyle.default}><Link to={waypoint.symbol}>{waypoint.symbol.replace(waypoint.systemSymbol+'-', '')}</Link></td>
            <td className={columnStyle.default}>{waypoint.factionSymbol}</td>
            <td className={columnStyle.default}>{waypoint.traits.join(', ')}</td>
            <td
              className={columnStyle.default}>{waypoint.tradeGoods.filter(tg => tg.kind === 'EXPORT').map(tg => <img
              src={`textures/icons/GOOD_${tg.symbol}.png`} style={{ width: '32px'}} title={tg.symbol}/>)}</td>
            <td
              className={columnStyle.default}>{waypoint.tradeGoods.filter(tg => tg.kind === 'IMPORT').map(tg => <img
              title={tg.symbol}
              src={`textures/icons/GOOD_${tg.symbol}.png`} style={{ width: '32px'}}/>)}</td>
          </tr>
          {sortedWaypoints?.filter(wp => wp.orbitsSymbol === waypoint.symbol).map(orbit => {
            return <tr key={orbit.symbol} className={rowStyle['default']}>
              <td className={columnStyle.default}>
                <span style={{paddingLeft: '32px'}}></span>
                <img src={`textures/planets/${orbit.type}.png`} title={orbit.type}/>
              </td>
              <td className={columnStyle.default}>{orbit.x}, {orbit.y}</td>
              <td className={columnStyle.default}><Link to={orbit.symbol}>{orbit.symbol.replace(waypoint.systemSymbol+'-', '')}</Link></td>
              <td className={columnStyle.default}>{orbit.factionSymbol}</td>
              <td className={columnStyle.default}>{orbit.traits.join(', ')}</td>
              <td
                className={columnStyle.default}>{orbit.tradeGoods.filter(tg => tg.kind === 'EXPORT').map(tg => <img src={`textures/icons/GOOD_${tg.symbol}.png`} title={tg.symbol} style={{ width: '32px'}} />)}</td>
              <td
                className={columnStyle.default}>{orbit.tradeGoods.filter(tg => tg.kind === 'IMPORT').map(tg => <img
                title={tg.symbol}
                style={{ width: '32px'}}
                src={`textures/icons/GOOD_${tg.symbol}.png`}/>)}</td>
            </tr>
          })}
        </>
      })}
      </tbody>
    </table>
  </div>
}