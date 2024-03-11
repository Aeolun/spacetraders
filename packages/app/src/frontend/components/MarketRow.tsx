import {link, marketRow, marketRowNumber} from "@front/styles/app.css";
import {format} from "@common/lib/format";
import type { MarketPrice } from "@common/prisma";
import {useState} from "react";
import {trpcReact} from "@front/trpc";

export const MarketRow = (props: { market: MarketPrice }) => {
  const [showHistory, setShowHistory] = useState(false)

  const market = props.market
  const history = trpcReact.getMarketInfoHistory.useQuery({
    waypoint: market.waypointSymbol,
    tradeGood: market.tradeGoodSymbol
  }, {
    enabled: showHistory
  })

  return <><div className={marketRow.default}>
    <div><img src={'textures/icons/GOOD_'+market.tradeGoodSymbol+'.png'} title={market.tradeGoodSymbol} alt={market.tradeGoodSymbol} /></div>
    <div className={link} onClick={() => {
      setShowHistory(!showHistory)
    }}>{market.tradeGoodSymbol}</div>
    <div><img src={'textures/icons/'+market.kind+'.png'} title={market.kind} alt={market.kind} /></div>
    <div>{market.supply ? <img src={'textures/icons/'+market.supply+'.png'} title={market.supply?.toString()} alt={market.supply?.toString()} /> : <img src={'textures/icons/UNKNOWN.png'} title={'UNKNOWN'} alt={'UNKNOWN'} /> }</div>
    <div>{market.activityLevel ? <img src={'textures/icons/'+market.activityLevel+'.png'} title={market.activityLevel} alt={market.activityLevel} /> : market.kind !== 'EXCHANGE' ? <img src={'textures/icons/UNKNOWN.png'} title={'UNKNOWN'} alt={'UNKNOWN'} /> : null}</div>
    <div className={marketRowNumber}>{market.tradeVolume ? format.format(market.tradeVolume) : '-'}</div>
    <div className={marketRowNumber}>{market.purchasePrice ? format.format(market.purchasePrice) : '-'}</div>
    <div className={marketRowNumber}>{market.sellPrice ? format.format(market.sellPrice) : '-'}</div>
  </div>
    { showHistory ? <div>
      {history.data?.map(history => {

        const dateData = new Date(history.createdAt)
        if (history.entryType === 'history') {
          return <div className={marketRow.default}>
            <div></div>
            <div>{dateData.getDate() + ' ' + dateData.toLocaleTimeString()}</div>
            <div><img src={'textures/icons/' + history.kind + '.png'} title={history.kind} alt={history.kind}/></div>
            <div>{history.supply ? <img src={'textures/icons/' + history.supply + '.png'} title={history.supply?.toString()}
                      alt={history.supply?.toString()}/> : null }</div>
            <div>{history.activityLevel ?
              <img src={'textures/icons/' + history.activityLevel + '.png'} title={history.activityLevel}
                   alt={history.activityLevel}/> : null}</div>
            <div className={marketRowNumber}>{history.tradeVolume ? format.format(history.tradeVolume) : '-'}</div>
            <div className={marketRowNumber}>{history.purchasePrice ? format.format(history.purchasePrice) : '-'}</div>
            <div className={marketRowNumber}>{history.sellPrice ? format.format(history.sellPrice) : '-'}</div>
          </div>
        } else {
          return <div className={marketRow.default}>
            <div></div>
            <div>{dateData.getDate() + ' ' + dateData.toLocaleTimeString()}</div>
            <div style={{
              gridColumn: '3 / span 6'
            }}>{history.transactionType} x{history.units} @{history.pricePerUnit}</div>
          </div>
        }
      })}
  </div> : null }
  </>
}