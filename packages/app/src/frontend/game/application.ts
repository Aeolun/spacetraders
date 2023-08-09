import {Application} from "pixi.js";
import {gameHeight, gameWidth} from "@front/lib/consts";

export const app = new Application({
    //resizeTo: window,
    width: gameWidth,
    height: gameHeight,
    antialias: true
});