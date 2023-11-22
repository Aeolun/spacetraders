import {Application, Text} from "pixi.js";
import {useEffect, useRef} from "react";
import {column, mainColumn} from "@front/styles/app.css";
import {initialize} from "@front/viewer/initialize";
import { useSelector } from "react-redux";
import {RootState, store} from "@front/ui/store";
import {loadAssets} from "@front/viewer/assets";
import {trpc} from "@front/trpc";
import {Registry} from "@front/viewer/registry";
import {shipActions} from "@front/ui/slices/ship";
import {agentActions} from "@front/ui/slices/agent";

export const app = new Application();
const initPromise = app.init({
  // eventFeatures: {
  //   move: true,
  //   globalMove: false,
  //   click: true,
  //   wheel: false
  // }
  antialias: true,
  roundPixels: false,
}).then(async () => {
  await loadAssets()
  startListeningToEvents();
})

function startListeningToEvents() {
  trpc.event.subscribe(undefined, {
    onData: (data) => {
      console.log('event', data);
      if (data.type == 'NAVIGATE') {
        Registry.shipData[data.data.symbol] = data.data
        store.dispatch(shipActions.setShipInfo(data.data))
      } else if (data.type == 'AGENT') {
        Registry.agent = data.data
        store.dispatch(agentActions.setCredits(data.data.credits));
      }
    }
  })
}

export const Pixi = () => {
  const ref = useRef<HTMLDivElement>(null);
  const contextMenu = useSelector((state: RootState) => state.contextMenu)

  useEffect(() => {
    if (!ref.current) return;
    initPromise.then(() => {
      initialize(app)

      app.resizeTo = ref.current

      ref.current.appendChild(app.canvas)
    });
  }, []);

  return <div className={mainColumn}><div ref={ref} className={mainColumn}></div>{contextMenu.open ? <div style={{
    position: 'absolute',
    height: '20px',
    width: '20px',
    backgroundColor: 'red',
    left: contextMenu.position?.x,
    top: contextMenu.position?.y,
  }}></div> : null}</div>
}