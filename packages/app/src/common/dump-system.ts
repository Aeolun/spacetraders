import {prisma} from "@common/prisma";
import fs from "fs";

async function dumpSystem(systemSymbol: string) {
  const waypoints = await prisma.waypoint.findMany({
    where: {
      systemSymbol
    },
    include: {
      tradeGoods: true
    }
  })

  return waypoints.map(wp => {
    const fuel = wp.tradeGoods.find(tg => tg.tradeGoodSymbol === 'FUEL')
    return {
      symbol: wp.symbol,
      x: wp.x,
      y: wp.y,
      fuel: fuel ? (fuel.purchasePrice ?? 85) : undefined,
    }
  })
}

dumpSystem('X1-XM43').then(data => {
  fs.writeFileSync("X1-XM43.json", JSON.stringify(data, null, 2), "utf-8")
})