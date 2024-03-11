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

export const Trades = (props: {}) => {
  const objectives = trpcReact.bestTrades.useQuery()

  return <div className={pageColumn}>
    <table className={dataTable}>
      <thead>
      <tr>
        <th className={columnStyle.default}>Priority</th>
        <th className={columnStyle.default}>Route</th>
        <th className={columnStyle.default}>Trade Symbol</th>
        <th className={columnStyle.default}>Activity</th>
        <th className={columnStyle.default}>Exports</th>
        <th className={columnStyle.right}>Purchase</th>
        <th className={columnStyle.right}>Sell</th>
        <th className={columnStyle.right}>Safe Volume</th>
        <th className={columnStyle.right}>Reservation</th>
        <th className={columnStyle.right}>Total profit (at vol 80)</th>
        <th className={columnStyle.right}>PPD</th>
      </tr>
      </thead>
      <tbody>
      {objectives.isFetched ? objectives.data?.map(objective => {
        return <tr className={rowStyle['default']}>
          <td className={columnStyle.default}>{fractionalFormat.format(objective.priority)}</td>
          <td
            className={columnStyle.default}>{objective.fromWaypointSymbol} &raquo; {objective.toWaypointSymbol} ({objective.dis})
          </td>
          <td className={columnStyle.default}><img src={`textures/icons/GOOD_${objective.tradeSymbol}.png`}
                                                   title={objective.tradeSymbol}/> {objective.tradeSymbol}</td>
          <td className={columnStyle.default}>
            <div className={tradeActivity}>
              <div className={tradeActivitySection}>
                <img src={`textures/icons/${objective.buyKind}.png`} title={objective.buyKind}/>
                <img src={`textures/icons/${objective.buySupply}.png`} title={objective.buySupply}/>
                {objective.buyKind !== 'EXCHANGE' ?
                  <img src={`textures/icons/${objective.buyActivity}.png`} title={objective.buyActivity}/> :
                  <div></div>}
              </div>
              <div className={tradeActivityVolume}>{objective.buyVolume}</div>
              <div>&raquo;</div>
              <div className={tradeActivitySection}>
                <img src={`textures/icons/${objective.sellKind}.png`} title={objective.sellKind}/>
                <img src={`textures/icons/${objective.sellSupply}.png`} title={objective.sellSupply}/>
                {objective.sellKind !== 'EXCHANGE' ?
                  <img src={`textures/icons/${objective.sellActivity}.png`} title={objective.sellActivity}/> :
                  <div></div>}
              </div>
              <div className={tradeActivityVolume}>{objective.sellVolume}</div>
            </div>
          </td>
          <td className={columnStyle.default}>
            <div className={tradeActivity}>{objective.associatedExports.map(exp => {
              return <div className={tradeActivitySection}><img src={`textures/icons/GOOD_${exp.tradeGoodSymbol}.png`}
                                                                title={exp.tradeGoodSymbol}/><img
                src={`textures/icons/${exp.activityLevel}.png`} title={exp.activityLevel}/>{exp.tradeVolume}</div>
            })}</div>
          </td>
          <td className={columnStyle.right}>₡ {format.format(objective.purchasePrice)}</td>
          <td className={columnStyle.right}>₡ {format.format(objective.sellPrice)}</td>
          <td className={columnStyle.right}>{format.format(objective.amount)}</td>
          <td className={columnStyle.right}>₡ {format.format(objective.reservation)}</td>
          <td className={columnStyle.right}>₡ {format.format(objective.totalProfit)}</td>
          <td className={columnStyle.right}>₡ {format.format(objective.profitPerDistance)}/d</td>
        </tr>
      }) : null}
      </tbody>
    </table>
  </div>
}