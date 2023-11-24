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
import {app, appInitPromise} from "@front/viewer/pixi-app";


export const Pixi = () => {
  const ref = useRef<HTMLDivElement>(null);
  const contextMenu = useSelector((state: RootState) => state.contextMenu)

  useEffect(() => {
    if (!ref.current) return;
    appInitPromise.then(() => {
      if (ref.current) {
        app.resizeTo = ref.current

        ref.current.appendChild(app.canvas)
      }
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