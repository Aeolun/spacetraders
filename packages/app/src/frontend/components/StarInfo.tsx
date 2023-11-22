import Timeago from "react-timeago";
import {marketRow, marketRowNumber, shipyardRow, systemMarketRow, tag, tagList} from "@front/styles/app.css";
import {format} from "@common/lib/format";
import {Registry} from "@front/viewer/registry";
import {trpcReact} from "@front/trpc";
import {MarketRow} from "@front/components/MarketRow";

export const StarInfo = ({ symbol }: {symbol: string}) => {
  const query = trpcReact.getSystemMarket.useQuery({
    system: symbol || ''
  })

  return <>
    <h1>{symbol}</h1>
    <div>
      <h2>System market</h2>
      <div className={systemMarketRow['header']}>
        <div></div>
        <div>Good</div>
        <div className={marketRowNumber}>Purchase P5</div>
        <div className={marketRowNumber}>Sell P95</div>
        <div className={marketRowNumber}>Profit</div>
        <div className={marketRowNumber}>Max</div>
        <div className={marketRowNumber}>Min</div>
      </div>
      {query.data?.map(tradeData => {
        return <div className={systemMarketRow[tradeData.purchase.p5 < tradeData.sale.p95 ? 'win' : 'default']}>
          <div>
            <img src={'textures/icons/GOOD_'+tradeData.tradeGoodSymbol+'.png'} title={tradeData.tradeGoodSymbol} alt={tradeData.tradeGoodSymbol} />
          </div>
          <div>{tradeData.tradeGoodSymbol}</div>
          <div className={marketRowNumber}>{format.format(tradeData.purchase.p5)}</div>
          <div className={marketRowNumber}>{format.format(tradeData.sale.p95)}</div>
          <div className={marketRowNumber}>{format.format(tradeData.sale.p95 - tradeData.purchase.p5)}</div>
          <div className={marketRowNumber}>{format.format(tradeData.maxVolume)}</div>
          <div className={marketRowNumber}>{format.format(tradeData.minVolume)}</div>
        </div>
      })}
    </div>
  </>
}