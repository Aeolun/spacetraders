import { Application } from "pixi.js";
import { loadAssets } from "@front/viewer/assets";
import { trpc } from "@front/trpc";
import { Registry } from "@front/viewer/registry";
import { store } from "@front/ui/store";
import { shipActions } from "@front/ui/slices/ship";
import { agentActions } from "@front/ui/slices/agent";
import { createUIElements } from "@front/viewer/UIElements";
import { initialize } from "@front/viewer/initialize";

function startListeningToEvents() {
	trpc.event.subscribe(undefined, {
		onData: (data) => {
			console.log("event", data);
			if (data.type == "NAVIGATE") {
				Registry.shipData[data.data.symbol] = data.data;
				store.dispatch(shipActions.setShipInfo(data.data));
			} else if (data.type == "AGENT") {
				Registry.agent = data.data;
				store.dispatch(agentActions.setCredits(data.data.credits));
			}
		},
	});
}

export const app = new Application();

globalThis.__PIXI_APP__ = app;
export const appInitPromise = app
	.init({
		// eventFeatures: {
		//   move: true,
		//   globalMove: false,
		//   click: true,
		//   wheel: false
		// }
		textureGCActive: false,
		// preference: 'webgl',
		antialias: true,
		roundPixels: false,
	})
	.then(async () => {
		await loadAssets();
		await createUIElements(app);
		await initialize(app);
		startListeningToEvents();
	});
