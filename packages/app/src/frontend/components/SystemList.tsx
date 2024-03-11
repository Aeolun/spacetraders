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
import {format, fractionalFormat} from "@common/lib/format";
import {Registry} from "@front/viewer/registry";
import {RootState} from "@front/ui/store";
import { useSelector } from "react-redux";
import {getDistance} from "@common/lib/getDistance";
import { Link } from "react-router-dom";

export const SystemList = (props: {}) => {
  const headquarters = useSelector((state: RootState) => state.agent.headquarters)
  const systems = useSelector((state: RootState) => state.system.system)

  const sortedSystems = Object.values(systems).sort((a, b) => {
    const exploredA = a.exploreStatus !== 'UNEXPLORED' ? 0 : 1
    const exploredB = b.exploreStatus !== 'UNEXPLORED' ? 0 : 1
    return exploredA - exploredB
  }).slice(0, 100)

  return <div className={pageColumn}>
    <table className={dataTable}>
      <thead>
      <tr>
        <th className={columnStyle.default}>Symbol</th>
        <th className={columnStyle.right}>Type</th>
        <th className={columnStyle.default}>Name</th>
        <th>Owner</th>
        <th className={columnStyle.default}>Explored</th>
        <th className={columnStyle.default}>Jumpgate</th>
        <th className={columnStyle.default}>Belts</th>
      </tr>
      </thead>
      <tbody>
      {sortedSystems.map(system => {
        return <tr key={system.symbol} className={rowStyle['default']}>
          <td className={columnStyle.default}><Link to={system.symbol}>{system.symbol}</Link></td>
          <td className={columnStyle.right}><img src={`textures/stars/${system.type}.png`} title={system.type} /></td>
          <td className={columnStyle.default}>{system.name}</td>
          <td className={columnStyle.default}>{system.majorityFaction}</td>
          <td className={columnStyle.default}>{system.exploreStatus}</td>
          <td className={columnStyle.default}>{system.hasJumpGate ? 'Yes' : 'No'}</td>
          <td className={columnStyle.default}>{system.hasBelt ? 'Yes' : 'No'}</td>
        </tr>
      })}
      </tbody>
    </table>
  </div>
}