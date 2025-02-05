import { Assets, Spritesheet, SpritesheetData, Texture } from "pixi.js";

export async function loadAssetsData() {
	const tradeArrow: Spritesheet<
		SpritesheetData & {
			animations: "animate";
		}
	> = await Assets.load("TRADE_ARROWS.json");

	return {
		tradeArrow: tradeArrow.animations["animate"],
	};
}

export let loadedAssets: Awaited<ReturnType<typeof loadAssetsData>>;

export async function loadAssets() {
	loadedAssets = await loadAssetsData();
}
