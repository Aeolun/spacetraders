import { config } from "dotenv";

console.log("Port before load", process.env.PORT);
console.log(
	"Loading backend",
	process.env.SERVER ? `.env.${process.env.SERVER}` : ".env",
);
config({
	path: process.env.SERVER ? `.env.${process.env.SERVER}` : undefined,
});
console.log("Redis DB after load", process.env.REDIS_DB);

import { appRouter } from "@backend/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { createContext } from "@backend/context";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import websocket from "ws";

export type { AppRouter } from "@backend/server";

const httpServer = createHTTPServer({
	router: appRouter,
	middleware: cors(),
	createContext: createContext,
});

console.log("Port to listen on is", process.env.PORT ? process.env.PORT : 4001);

const port = process.env.PORT ? parseInt(process.env.PORT) : 4001;

const wss = new websocket.Server({
	port: port + 1,
});
applyWSSHandler({ wss, router: appRouter, createContext });
wss.on("connection", (ws) => {
	console.log(`➕➕ Connection (${wss.clients.size})`);
	ws.addEventListener("close", () => {
		console.log(`➖➖ Connection (${wss.clients.size})`);
	});
});

httpServer.listen(port);
console.log(`✅ Listening at port ${port}`);
console.log(`✅ WebSocket Server listening on ws://localhost:${port + 1}`);
