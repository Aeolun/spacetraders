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
import {Line, Legend, Tooltip, YAxis, Bar, ComposedChart, BarChart, XAxis, Area, AreaChart, CartesianGrid, ResponsiveContainer, LineChart} from "recharts";
import {useParams} from "react-router-dom";
import {ReactElement, useState} from "react";

export const SystemMarket = (props: {}) => {
  const params = useParams()
  const [tradeGood, setTradegood] = useState<string | undefined>(undefined)
  const marketGraph = trpcReact.getSystemMarketInfoHistory.useQuery({
    systemSymbol: params.systemSymbol
  })

  if (!marketGraph.isFetched) {
    return <div>Loading</div>
  }

  let dataNode: ReactElement | undefined = undefined
  const allDataKeys = Object.keys(marketGraph.data)

  const colors = [
    '#003f5c',
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600',
  ]

  const buyColors = [
    '#ff0000',
    '#ff4c00',
    '#ff6f00',
    '#ff8c00',
    '#ffa600',
  ]

  const sellColors = [
  '#00aa00',
  '#6dad00',
  '#a4ae00',
  '#d4ab00',
  '#ffa600'
  ]

  if (tradeGood) {
    const linechartData: Record<string, { date: Date } & Record<string, number>>[] = []

    for (let i = 0; i < marketGraph.data[tradeGood].length; i++) {
      const date = marketGraph.data[tradeGood][i].date
      if (!linechartData[date]) linechartData[date] = {
        date: new Date(date),
        ...marketGraph.data[tradeGood][i]
      }

    }

    const datainsert = Object.values(linechartData)
    console.log(datainsert)
    dataNode = <><ResponsiveContainer width={'100%'} height="60%">
      <ComposedChart data={datainsert} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area name={"Buy"} type="monotone" dot={false} dataKey={data => {
        return [data.minBuy, data.maxBuy]
      }} stroke={buyColors[0]} fill={buyColors[1]} fillOpacity={0.5} />
      <Area name={"Sell"} type="monotone" dot={false} dataKey={data => {
        return [data.minSell, data.maxSell]
      }} stroke={sellColors[0]} fill={sellColors[1]} fillOpacity={0.5} />
      <Line name={"Avg Buy"} type={'monotone'} dot={false} dataKey={'avgBuy'} stroke={buyColors[2]} />
      <Line name={"Avg Sell"} type={'monotone'} dot={false} dataKey={'avgSell'} stroke={sellColors[2]} />
    </ComposedChart>
    </ResponsiveContainer><ResponsiveContainer width={'100%'} height="20%">
      <BarChart stackOffset="sign" data={datainsert} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name={"Sold"} stackId="stack" type="monotone" dataKey={(data) => data.sold * -1} stroke={buyColors[0]} fill={buyColors[1]} fillOpacity={0.5} />
        <Bar name={"Purchased"} stackId="stack" type="monotone" dataKey={'purchased'} stroke={sellColors[0]} fill={sellColors[1]} fillOpacity={0.5} />
      </BarChart>
    </ResponsiveContainer></>
  } else {
    const linechartData: Record<string, { date: Date } & Record<string, number>>[] = []

    for (const marketGoodKey in marketGraph.data) {
      const maxVal = Math.max(...marketGraph.data[marketGoodKey].map((x) => x.avg).filter(i => i))
      console.log(marketGoodKey, maxVal)
      if (maxVal > 750) {
        console.log("skipping", marketGoodKey)
        continue;

      }
      for (let i = 0; i < marketGraph.data[marketGoodKey].length; i++) {
        const date = marketGraph.data[marketGoodKey][i].date
        if (!linechartData[date]) linechartData[date] = {date: new Date(date)}
        linechartData[date][marketGoodKey] = marketGraph.data[marketGoodKey][i].avg
      }
    }


    const datainsert = Object.values(linechartData)
    console.log(datainsert)
    dataNode = <ResponsiveContainer width={'100%'} height="80%">
      <LineChart width={730} height={250} data={datainsert} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      {allDataKeys.map((key, index) => {
        return <Line type="monotone" dot={false} dataKey={key} stroke={colors[index % colors.length]} />
      })}
    </LineChart>
    </ResponsiveContainer>

  }

  return <div className={pageColumn} style={{
    flexDirection: 'row'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minWidth: '100px'
    }}>
      {allDataKeys.map((key, index) => {
        return <button type="button" key={key} onClick={() => setTradegood(key)}>{key}</button>
      })}
    </div>
    <div style={{
      flex: 1
    }}>
      <h2 style={{
        textAlign: 'center'
      }}>{tradeGood ? tradeGood : 'All goods'}</h2>
    {dataNode}
    </div>
  </div>
}