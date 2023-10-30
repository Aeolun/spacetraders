import {Application, Text} from "pixi.js";
import {useEffect, useRef} from "react";
import {column, mainColumn} from "@front/styles/app.css";
import {initialize} from "@front/viewer/initialize";

export const app = new Application();

export const Pixi = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    app.init({}).then(() => {
      initialize(app)

      app.resizeTo = ref.current

      ref.current.appendChild(app.canvas)
    });
  }, []);

  return <div className={mainColumn} ref={ref}></div>
}