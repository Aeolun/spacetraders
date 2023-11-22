import {useSelector, useStore} from "react-redux";
import {RootState} from "@front/ui/store";
import {Registry} from "@front/viewer/registry";
import {trpcReact} from "@front/trpc";
import Timeago from 'react-timeago'
import {marketRow, marketRowNumber, shipyardRow} from "@front/styles/app.css";
import {format} from "@common/lib/format";
import {ShipInfo} from "@front/components/ShipInfo";
import {WaypointInfo} from "@front/components/WaypointInfo";
import {StarInfo} from "@front/components/StarInfo";


export const SelectionDisplay = () => {
  const selection = useSelector((select: RootState) => select.selection.selection);



  return selection ? <div>
    <div>{selection.type} {selection.symbol}</div>
    {selection.type === 'waypoint' ?
      <WaypointInfo symbol={selection.symbol} /> : null}
    {selection.type === 'ship' ? <div>
      <ShipInfo symbol={selection.symbol} />
    </div> : null}
    {selection.type === 'star' ? <StarInfo symbol={selection.symbol} /> : null}
  </div> : <div>nothing selected</div>
}