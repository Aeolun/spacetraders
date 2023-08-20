import {appRouter} from '@backend/server'
import {createHTTPServer} from '@trpc/server/adapters/standalone';
import cors from 'cors'

import {config} from 'dotenv'

import {createContext} from "@backend/context";
import {applyWSSHandler} from "@trpc/server/adapters/ws";
import ws from 'ws'
import {prisma} from "@backend/prisma";
import {startResetBehaviorForServer} from "@backend/reset/reset-world";


export type { AppRouter } from '@backend/server'

config();

const httpServer = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext: createContext
})


const wss = new ws.Server({
    port: 4002,
});
applyWSSHandler({ wss, router: appRouter, createContext })
wss.on('connection', (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', () => {
        console.log(`➖➖ Connection (${wss.clients.size})`);
    });
});

prisma.server.findMany().then(servers => {
  servers.forEach(server => {
    console.log(`🌐 Server ${server.endpoint} (${server.resetDate})`);
    startResetBehaviorForServer(server).catch(e => {
      console.error(e)
    })
  })
})

httpServer.listen(4001)
console.log("✅ Listening at port 4001")
console.log('✅ WebSocket Server listening on ws://localhost:4002');