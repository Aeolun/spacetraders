import {Application, Text} from "pixi.js";
import {useEffect, useRef} from "react";
import {column, mainColumn} from "@front/styles/app.css";
import {initialize} from "@front/viewer/initialize";
import { useSelector } from "react-redux";
import {RootState} from "@front/ui/store";

export const app = new Application();

export const Pixi = () => {
  const ref = useRef<HTMLDivElement>(null);
  const contextMenu = useSelector((state: RootState) => state.contextMenu)

  useEffect(() => {
    if (!ref.current) return;
    app.init({}).then(() => {
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