import { renderToString } from 'react-dom/server'
import { useState, useEffect, useRef, PropsWithChildren, ReactNode } from 'react'
import {GraphCanvas, GraphCanvasRef, recommendLayout, useSelection} from 'reagraph';
import data from './graph'
import {trpc} from "@front/lib/trpc";
import fs from "fs";
import {prisma} from "@app/prisma";

const imports: Record<string, { importGood: string, weight: number}[]> = {}
data.forEach(d => {
  if (!imports[d.export]) {
    imports[d.export] = []
  }
  imports[d.export].push({
    importGood: d.imports,
    weight: d.weight
  })
})

export enum TradeGood {
  ADVANCED_CIRCUITRY = "ADVANCED_CIRCUITRY",
  AI_MAINFRAMES = "AI_MAINFRAMES",
  ALUMINUM = "ALUMINUM",
  ALUMINUM_ORE = "ALUMINUM_ORE",
  AMMONIA_ICE = "AMMONIA_ICE",
  AMMUNITION = "AMMUNITION",
  ANTIMATTER = "ANTIMATTER",
  BIOCOMPOSITES = "BIOCOMPOSITES",
  BOTANICAL_SPECIMENS = "BOTANICAL_SPECIMENS",
  CLOTHING = "CLOTHING",
  COPPER = "COPPER",
  COPPER_ORE = "COPPER_ORE",
  CYBERNETIC_IMPLANTS = "CYBERNETIC_IMPLANTS",
  DIAMONDS = "DIAMONDS",
  DRUGS = "DRUGS",
  ELECTRONICS = "ELECTRONICS",
  EQUIPMENT = "EQUIPMENT",
  EXOTIC_MATTER = "EXOTIC_MATTER",
  EXPLOSIVES = "EXPLOSIVES",
  FABRICS = "FABRICS",
  FERTILIZERS = "FERTILIZERS",
  FIREARMS = "FIREARMS",
  FOOD = "FOOD",
  FUEL = "FUEL",
  GENETHERAPEUTICS = "GENETHERAPEUTICS",
  GOLD = "GOLD",
  GOLD_ORE = "GOLD_ORE",
  GRAVITON_EMITTERS = "GRAVITON_EMITTERS",
  HEAVY_MACHINERY = "HEAVY_MACHINERY",
  HOLOGRAPHICS = "HOLOGRAPHICS",
  HYDROCARBON = "HYDROCARBON",
  ICE_WATER = "ICE_WATER",
  IRON = "IRON",
  IRON_ORE = "IRON_ORE",
  JEWELRY = "JEWELRY",
  LAB_INSTRUMENTS = "LAB_INSTRUMENTS",
  LIVESTOCK = "LIVESTOCK",
  LUXURY_GOODS = "LUXURY_GOODS",
  LIQUID_NITROGEN = "LIQUID_NITROGEN",
  MACHINERY = "MACHINERY",
  MEDICAL_SUPPLIES = "MEDICAL_SUPPLIES",
  MICROPROCESSORS = "MICROPROCESSORS",
  MERITIUM = "MERITIUM",
  MERITIUM_ORE = "MERITIUM_ORE",
  FUSION_GENERATORS = "FUSION_GENERATORS",
  MILITARY_EQUIPMENT = "MILITARY_EQUIPMENT",
  MOOD_REGULATORS = "MOOD_REGULATORS",
  NANOBOTS = "NANOBOTS",
  NOVEL_LIFEFORMS = "NOVEL_LIFEFORMS",
  PLASTICS = "PLASTICS",
  PLATINUM = "PLATINUM",
  PLATINUM_ORE = "PLATINUM_ORE",
  POLYNUCLEOTIDES = "POLYNUCLEOTIDES",
  PRECIOUS_STONES = "PRECIOUS_STONES",
  RELIC_TECH = "RELIC_TECH",
  QUANTUM_DRIVES = "QUANTUM_DRIVES",
  QUARTZ_SAND = "QUARTZ_SAND",
  RESEARCH_DATA = "RESEARCH_DATA",
  ROBOTIC_DRONES = "ROBOTIC_DRONES",
  SHIP_PLATING = "SHIP_PLATING",
  SILICON_CRYSTALS = "SILICON_CRYSTALS",
  SILVER = "SILVER",
  SILVER_ORE = "SILVER_ORE",
  URANITE = "URANITE",
  URANITE_ORE = "URANITE_ORE",
  VIRAL_AGENTS = "VIRAL_AGENTS",
  THERMAL_REGULATORS = "THERMAL_REGULATORS",
  TOURISTS = "TOURISTS",
  MODULE_CARGO_HOLD_I = "MODULE_CARGO_HOLD_I",
  MODULE_CREW_QUARTERS_I = "MODULE_CREW_QUARTERS_I",
  MODULE_WARP_DRIVE_I = "MODULE_WARP_DRIVE_I",
  MODULE_WARP_DRIVE_II = "MODULE_WARP_DRIVE_II",
  MODULE_WARP_DRIVE_III = "MODULE_WARP_DRIVE_III",
  MODULE_JUMP_DRIVE_I = "MODULE_JUMP_DRIVE_I",
  MODULE_JUMP_DRIVE_II = "MODULE_JUMP_DRIVE_II",
  MODULE_JUMP_DRIVE_III = "MODULE_JUMP_DRIVE_III",
  MODULE_MINERAL_PROCESSOR_I = "MODULE_MINERAL_PROCESSOR_I",
  MODULE_ENVOY_QUARTERS_I = "MODULE_ENVOY_QUARTERS_I",
  MODULE_SCIENCE_LAB_I = "MODULE_SCIENCE_LAB_I",
  MODULE_PASSENGER_CABIN_I = "MODULE_PASSENGER_CABIN_I",
  MODULE_ORE_REFINERY_I = "MODULE_ORE_REFINERY_I",
  MODULE_SHIELD_GENERATOR_I = "MODULE_SHIELD_GENERATOR_I",
  MODULE_SHIELD_GENERATOR_II = "MODULE_SHIELD_GENERATOR_II",
  MOUNT_GAS_SIPHON_I = "MOUNT_GAS_SIPHON_I",
  MOUNT_GAS_SIPHON_II = "MOUNT_GAS_SIPHON_II",
  MOUNT_GAS_SIPHON_III = "MOUNT_GAS_SIPHON_III",
  MOUNT_SURVEYOR_I = "MOUNT_SURVEYOR_I",
  MOUNT_SURVEYOR_II = "MOUNT_SURVEYOR_II",
  MOUNT_SURVEYOR_III = "MOUNT_SURVEYOR_III",
  MOUNT_SENSOR_ARRAY_I = "MOUNT_SENSOR_ARRAY_I",
  MOUNT_SENSOR_ARRAY_II = "MOUNT_SENSOR_ARRAY_II",
  MOUNT_SENSOR_ARRAY_III = "MOUNT_SENSOR_ARRAY_III",
  MOUNT_MINING_LASER_I = "MOUNT_MINING_LASER_I",
  MOUNT_MINING_LASER_II = "MOUNT_MINING_LASER_II",
  MOUNT_MINING_LASER_III = "MOUNT_MINING_LASER_III",
  MOUNT_LASER_CANNON_I = "MOUNT_LASER_CANNON_I",
  MOUNT_MISSILE_LAUNCHER_I = "MOUNT_MISSILE_LAUNCHER_I",
  MOUNT_TURRET_I = "MOUNT_TURRET_I",
  ENGINE_IMPULSE_DRIVE_I = "ENGINE_IMPULSE_DRIVE_I",
  ENGINE_ION_DRIVE_I = "ENGINE_ION_DRIVE_I",
  ENGINE_ION_DRIVE_II = "ENGINE_ION_DRIVE_II",
  FRAME_PROBE = "FRAME_PROBE",
  FRAME_DRONE = "FRAME_DRONE",
  FRAME_INTERCEPTOR = "FRAME_INTERCEPTOR",
  FRAME_RACER = "FRAME_RACER",
  FRAME_FIGHTER = "FRAME_FIGHTER",
  FRAME_FRIGATE = "FRAME_FRIGATE",
  FRAME_SHUTTLE = "FRAME_SHUTTLE",
  FRAME_EXPLORER = "FRAME_EXPLORER",
  FRAME_MINER = "FRAME_MINER",
  FRAME_LIGHT_FREIGHTER = "FRAME_LIGHT_FREIGHTER",
  FRAME_HEAVY_FREIGHTER = "FRAME_HEAVY_FREIGHTER",
  REACTOR_CHEMICAL_I = "REACTOR_CHEMICAL_I",
  REACTOR_FISSION_I = "REACTOR_FISSION_I",
  REACTOR_FUSION_I = "REACTOR_FUSION_I",
  REACTOR_SOLAR_I = "REACTOR_SOLAR_I",
}

interface MarketGood {
  maxPrice: number,
  minPrice: number,
  percentile5th: number,
  percentile95th: number,
  avgPrice: number,
  medianPrice: number,
  exportCount: number
  importCount: number
  exchangeCount: number,
  components: { importGood: string, weight: number }[]
}

const format = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
})

const App = (props: { goods: Record<string, MarketGood>}) => {
  return <div>
    <style>
      {`
      @media all {
      .left {
        text-align: left;
      }
      
      .right {
        text-align: right;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      td {
        width: 8%;
        padding: 0.5em;
        border: solid #000 1px !important;
        }
        td.large {
        min-width: 25%;
        }
        td td {
         width: 25%;
        }
        table {
    border:solid #000 !important;
    border-width:2px 0 0 2px !important;
}
th, td {
    border:solid #000 !important;
    border-width:0 2px 2px 0 !important;
}
      }`}
    </style>
    <h1>Here are things</h1>
    <table>
      <tr>
        <th className={"left"}>Good</th>
        <th className={'right'}>Max Price</th>
        <th className={'right'}>Min Price</th>
        <th className={'right'}>Avg Price</th>
        <th className={'right'}>5th Percentile</th>
        <th className={'right'}>95th Percentile</th>
        <th className={'right'}>Median Price</th>
        <th className={'right'}>Export Count</th>
        <th className={'right'}>Import Count</th>
        <th className={'right'}>Exchange Count</th>
        <th className={"large left"}>Components</th>
      </tr>
      {Object.keys(props.goods).map(good => {
        const goodData = props.goods[good]

        return <tr key={good}>
          <td>{good}</td>
          <td className={'right'}>{goodData.maxPrice === 0 ? '?' : format.format(goodData.maxPrice)}</td>
          <td className={'right'}>{goodData.minPrice === 10_000_000 ? '?' : format.format(goodData.minPrice)}</td>
          <td className={'right'}>{format.format(goodData.avgPrice)}</td>
          <td className={'right'}>{format.format(goodData.percentile5th)}</td>
          <td className={'right'}>{format.format(goodData.percentile95th)}</td>
          <td className={'right'}>{format.format(goodData.medianPrice)}</td>
          <td className={'right'}>{goodData.exportCount}</td>
          <td className={'right'}>{goodData.importCount}</td>
          <td className={'right'}>{goodData.exchangeCount}</td>
          <td className={"large"}><table>
            {goodData.components?.map(component => {
              const componentData = props.goods[component.importGood]
              return <tr key={component.importGood}>
                <td>{component.importGood}</td>
                <td>{component.weight}w</td>
                <td>{componentData ? componentData.medianPrice : 'No data'}</td>
                <td></td>
              </tr>
            })}
          </table></td>
        </tr>
      })}
    </table>
  </div>
}

const renderAsync = async () => {
  const goodPriceData: Record<string, MarketGood> = {}

  const marketPrices = await prisma.marketPrice.findMany({})
  Object.keys(TradeGood).forEach(good => {
    const prices = marketPrices.filter(price => price.tradeGoodSymbol === good)


    let maxPrice = 0, minPrice = 10_000_000, avgPrice = 0, medianPrice, exportCount = 0, importCount = 0, exchangeCount = 0, percentile5th, percentile95th
    const allPrices: number[] = []
    prices.forEach(price => {
      if (price.sellPrice > maxPrice) maxPrice = price.sellPrice
      if (price.sellPrice < minPrice) minPrice = price.sellPrice
      if (price.purchasePrice > maxPrice) maxPrice = price.purchasePrice
      if (price.purchasePrice < minPrice) minPrice = price.purchasePrice
      if (price.sellPrice) {
        avgPrice += price.sellPrice
      }
      if (price.purchasePrice) {
        avgPrice += price.purchasePrice
      }
      allPrices.push(price.sellPrice)
      allPrices.push(price.purchasePrice)
      if (price.kind === 'EXCHANGE') exchangeCount++
      if (price.kind === 'EXPORT') exportCount++
      if (price.kind === 'IMPORT') importCount++
    })
    allPrices.sort((a, b) => a - b)
    if (allPrices.length > 0) {
      avgPrice = avgPrice / (allPrices.length)
    }
    medianPrice = allPrices[Math.floor(allPrices.length / 2)]
    percentile5th = allPrices[Math.floor(allPrices.length * 0.05)]
    percentile95th = allPrices[Math.ceil(allPrices.length * 0.95)]

    goodPriceData[good] = {
      maxPrice,
      minPrice,
      avgPrice,
      percentile5th,
      percentile95th,
      medianPrice,
      exportCount,
      importCount,
      exchangeCount,
      components: imports[good]
    }
  })



  const string = renderToString(<App goods={goodPriceData}/>)
  fs.writeFileSync('component-data.html', string)
}
renderAsync()