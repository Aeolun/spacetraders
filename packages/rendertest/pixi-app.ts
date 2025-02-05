import { Application, Graphics } from "pixi.js";
import { loadAssets, loadedAssets } from "./assets";
import { AnimatedTilingSprite } from "./AnimatedTilingSprite";
import { Container } from "pixi.js";
import { Ticker } from "pixi.js";

export const app = new Application();
export const appInitPromise = app
	.init({
		// eventFeatures: {
		//   move: true,
		//   globalMove: false,
		//   click: true,
		//   wheel: false
		// }
		antialias: true,
		roundPixels: false,
	})
	.then(async () => {
		await loadAssets();

		Ticker.shared.speed = 2;
		app.ticker.minFPS = 40;
		app.ticker.maxFPS = 120;

		const container = new Container();
		const block = new Graphics();
		block.rect(0, 0, 100, 100).fill(0xff0000);
		block.x = 50;
		block.y = 100;
		block.interactive = true;
		container.addChild(block);

		app.stage.addChild(container);

		let currentRoutes = 0;
		const marketRouteClickEvent = (e) => {
			console.log("click", e);

			for (let i = 0; i < 10; i++) {
				setTimeout(() => {
					currentRoutes++;
					const routes = createMarketRoutes();

					setTimeout(() => {
						currentRoutes--;
						routes.forEach((route) => {
							app.stage.removeChild(route);
						});
					}, 1000);
				}, i * 60);
			}
		};

		block.addEventListener("click", marketRouteClickEvent);

		const createMarketRoutes = () => {
			const routes = [];
			for (let i = 0; i < 4; i++) {
				const marketRouteNew = new AnimatedTilingSprite(
					loadedAssets.tradeArrow,
				);
				marketRouteNew.tint = i % 2 == 0 ? 0x00ff00 : 0xff0000;
				marketRouteNew.width = 300;
				marketRouteNew.height = 16;
				marketRouteNew.animationSpeed = 0.1;
				marketRouteNew.anchor.set(0.5, 0.5);
				marketRouteNew.rotation = (Math.PI / 16) * (i + currentRoutes);
				marketRouteNew.x = 300 + currentRoutes * 16;
				marketRouteNew.y = 100 + 55 * i + currentRoutes * 16;
				marketRouteNew.interactive = true;
				marketRouteNew.play();
				app.stage.addChild(marketRouteNew);
				routes.push(marketRouteNew);
			}
			return routes;
		};
	});
