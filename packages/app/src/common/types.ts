import {MarketPriceHistory, TradeLog} from "@common/prisma";

type HistoryResult = ({ entryType: 'history' } & MarketPriceHistory & { tradeGood: { symbol: string, name: string } })
type TradeResult = ({ entryType: 'trade' } & TradeLog)
export type TradeHistory = (HistoryResult | TradeResult)[]