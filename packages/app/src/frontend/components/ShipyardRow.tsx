import {marketRowNumber, shipyardRow} from "@front/styles/app.css";
import {ShipConfigurationData} from "@front/viewer/registry";
import {useState} from "react";

export const ShipyardRow = (props: { ship: ShipConfigurationData }) => {
  const {ship} = props
  const [ expanded, setExpanded ] = useState(false)

  const cargoSpace = ship.shipConfiguration?.shipConfigurationModule.reduce((total, current) => {
    return (current.module.effectName === 'CARGO_HOLD' ? current.module.value ?? 0 : 0) + total
  }, 0)

  return <>
    <div className={shipyardRow.default} onClick={() => setExpanded(!expanded)}>
      <div>{ship.shipConfiguration?.name}</div>
      <div className={marketRowNumber}>{ship.shipConfiguration?.engine.speed}</div>
      <div className={marketRowNumber}>{ship.shipConfiguration?.frame.fuelCapacity}</div>
      <div className={marketRowNumber}>{cargoSpace}</div>
      <div className={marketRowNumber}>{ship.price}</div>
    </div>
    {expanded ? <pre>{JSON.stringify(ship.shipConfiguration, null, 2)}</pre> : null }
  </>
}