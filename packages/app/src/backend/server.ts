import {authedProcedure, publicProcedure, router} from './trpc';
import z from 'zod'
import {MarketPriceHistory, prisma, ShipBehavior, TradeLog} from "@common/prisma";
import { sign, verify } from 'jsonwebtoken';
import crypto from 'crypto'
import createApi from "@common/lib/createApi";
import {FactionSymbols} from "spacetraders-sdk";
import {storeAgentToken} from "@common/lib/data-update/store-agent-token";
import {observable} from "@trpc/server/observable";
import {redisClient} from "@common/redis";
import {combinedMarketStats} from "@common/lib/stats/market-stats";
import {TradeHistory} from "@common/types";
import {findTrades} from "@auto/ship/behaviors/atoms/find-trades";
import fs from "fs";
import {backgroundQueue} from "@auto/lib/queue";
import {getBackgroundAgentToken} from "@auto/setup/background-agent-token";
import {storeWaypoint} from "@common/lib/data-update/store-waypoint";

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set')
}

export const appRouter = router({
    event: publicProcedure.subscription(() => {
        // return an `observable` with a callback which is triggered immediately
        return observable<any>((emit) => {
            const onEvent = (data: any, channel: unknown) => {
                // emit data to client
                emit.next(JSON.parse(data));
            };
            emit.next({
                type: 'ready',
            })
            // trigger `onAdd()` when `add` is triggered in our event emitter
            redisClient.subscribe('event', onEvent);
            // unsubscribe function when client disconnects or stops subscribing
            return () => {
                redisClient.unsubscribe('event', onEvent);
            };
        });
    }),
    register: publicProcedure.input(z.object({
        email: z.string(),
        password: z.string()
    })).mutation(async ({input, ctx}) => {

        const salt = crypto.randomBytes(16).toString('hex');
        const passwordValue = crypto.pbkdf2Sync(input.password, salt, 1000, 64, 'sha512').toString('hex');
        const password = `${salt}::${passwordValue}`

        const account = await prisma.account.create({
            data: {
                email: input.email,
                password: password,
            }
        })
        return {
            token: sign({
                accountId: account.id,
                email: input.email
            }, process.env.JWT_SECRET)
        }
    }),
    registerAgent: authedProcedure.input(z.object({
        email: z.string(),
        symbol: z.string(),
        faction: z.nativeEnum(FactionSymbols),
        serverId: z.string(),
    })).mutation(async ({input, ctx}) => {
        const server = await prisma.server.findFirstOrThrow({
            where: {
                id: input.serverId
            }
        })
        const result = await createApi('').default.register({
            email: input.email,
            symbol: input.symbol,
            faction: input.faction,
        })
        const registerResult = await storeAgentToken(ctx.account.email, result.data.data.agent, result.data.data.token)
        return {
            token: result.data.data.token
        }
    }),
    signIn: publicProcedure.input(z.object({
        email: z.string(),
        password: z.string()
    })).mutation(async ({input, ctx}) => {
        const account = await prisma.account.findFirst({
            where: {
                email: input.email
            }
        })
        if (!account) {
            throw new Error('Account not found')
        }
        const [salt, passwordValue] = account.password.split('::')
        const password = crypto.pbkdf2Sync(input.password, salt, 1000, 64, 'sha512').toString('hex');
        if (password !== passwordValue) {
            throw new Error('Password incorrect')
        }
        return {
            token: sign({
                accountId: account.id,
                email: input.email
            }, process.env.JWT_SECRET, {
                expiresIn: '30d'
            })
        }
    }),
    validateToken: publicProcedure.input(z.object({
        token: z.string(),
    })).mutation(async ({input, ctx}) => {
        try {
            const res = verify(input.token, process.env.JWT_SECRET)

            return {
                valid: true
            }
        } catch(error) {
            return {
                valid: false
            }
        }
    }),
    waypointsForSystem: publicProcedure.input(z.object({
        system: z.string()
    })).query(async ({input}) => {
        const waypoints = await prisma.waypoint.findMany({
            where: {
                systemSymbol: input.system
            },
            include: {
                traits: true,
                modifiers: true,
                jumpConnectedTo: {
                    select: {
                        symbol: true
                    }
                },
                tradeGoods: {
                    select: {
                        tradeGoodSymbol: true,
                        kind: true
                    }
                }
            }
        })

        return waypoints
    }),
    consolidatedPrices: publicProcedure.query(async () => {
        return prisma.consolidatedPrice.findMany({
            include: {
                tradeGood: true
            }
        })
    }),
    bestTrades: publicProcedure.input(z.object({})).query(async ({input}) => {
        return findTrades({
            systemSymbols: [],
            dbLimit: 250,
            resultLimit: 100
        });
    }),
    getWaypoint: publicProcedure.input(z.object({
        symbol: z.string()
    })).query(async ({input}) => {
        const waypoint = await prisma.waypoint.findFirstOrThrow({
            where: {
                symbol: input.symbol
            },
            include: {
                traits: true,
                modifiers: true,
                jumpConnectedTo: {
                    select: {
                        symbol: true
                    }
                },
            }
        })

        return waypoint
    }),
    updateWaypoint: publicProcedure.input(z.object({
        systemSymbol: z.string(),
        symbol: z.string(),
    })).mutation(async ({input}) => {
        const server = await prisma.server.findFirstOrThrow({
            where: {
                apiUrl: process.env.API_URL
            },
            orderBy: {
                resetDate: 'desc'
            }
        })
        const token = await getBackgroundAgentToken(server);
        const api = createApi(token);
        const data = await backgroundQueue(() => api.systems.getWaypoint(input.systemSymbol, input.symbol))


        console.log(data.data.data)
        await storeWaypoint(data.data.data)
    }),
    getWaypoints: publicProcedure.input(z.object({
        systemSymbol: z.string()
    })).query(async ({input, ctx}) => {
        const system = await prisma.system.findFirstOrThrow({
            where: {
                symbol: input.systemSymbol
            }
        })
        const waypoints = await prisma.waypoint.findMany({
            where: {
                systemSymbol: input.systemSymbol
            },
            include: {
                traits: true,
                tradeGoods: true,
                jumpConnectedTo: {
                    select: {
                        symbol: true
                    }
                }
            }
        })
        return {
            system,
            waypoints: await Promise.all(waypoints.map(async wp => {
                const shipyardModels = await prisma.shipyardModel.findMany({
                    where: {
                        waypointSymbol: wp.symbol
                    }
                })

                return {
                    ...wp,
                    traits: wp.traits.map(t => t.symbol),
                    tradeGoods: wp.tradeGoods.map(tg => ({
                        symbol: tg.tradeGoodSymbol,
                        kind: tg.kind
                    })),
                    shipyardModels: shipyardModels.map(sm => ({
                        symbol: sm.shipConfigurationSymbol,
                    })),
                }
            }))
        }
    }),
    getAgents: publicProcedure.query(async ({ctx}) => {
        return prisma.agent.findMany({
            where: {
                accountId: ctx.account.accountId
            },
            orderBy: {
                reset: 'desc'
            }
        })
    }),
    getServers: publicProcedure.query(async () => {
        return prisma.server.findMany()
    }),
    getFactions: publicProcedure.query(async () => {
        return prisma.faction.findMany()
    }),
    shipsForSystem: publicProcedure.input(z.object({
        system: z.string()
    })).query(async ({input}) => {
        return prisma.ship.findMany({
            where: {
                currentSystemSymbol: input.system,
            },
            include: {
                currentWaypoint: true,
                destinationWaypoint: true,
                departureWaypoint: true,
                frame: true,
                reactor: true,
                engine: true,
                mounts: true,
                modules: true,
                cargo: true,
                ShipTask: true
            }
        })
    }),
    shipData: publicProcedure.input(z.object({
        symbol: z.string()
    })).query(async ({input}) => {
        return prisma.ship.findFirstOrThrow({
            where: {
                symbol: input.symbol
            },
            include: {
                currentWaypoint: true,
                destinationWaypoint: true,
                departureWaypoint: true,
                frame: true,
                reactor: true,
                engine: true,
                mounts: true,
                modules: true,
                cargo: true,
                ShipTask: true
            }
        });
    }),
    getAgentInfo: publicProcedure.query(async ({ctx}) => {
        return prisma.agent.findFirst({
            where: {
                symbol: ctx.payload?.identifier,
            },
            orderBy: {
                reset: 'desc'
            }
        })
    }),
    getMyShips: publicProcedure.query(async ({ctx}) => {
        console.log(ctx);
       return prisma.ship.findMany({
           where: {
               agent: ctx.payload.identifier
           },
           include: {
               currentWaypoint: true,
               destinationWaypoint: true,
               departureWaypoint: true,
               frame: true,
               reactor: true,
               engine: true,
               mounts: true,
               modules: true,
               cargo: true,
               ShipTask: true,
           }
       })
    }),
    getSystems: publicProcedure.query(async () => {
        return prisma.system.findMany({})
    }),
    getShipyard: publicProcedure.input(z.object({
        waypointSymbol: z.string()
    })).query(async ({input}) => {
        return prisma.shipyardModel.findMany({
            where: {
                waypointSymbol: input.waypointSymbol
            },
            include: {
                shipConfiguration: {
                    include: {
                        frame: true,
                        reactor: true,
                        engine: true,
                        shipConfigurationMount: {
                            include: {
                                mount: true
                            }
                        },
                        shipConfigurationModule: {
                            include: {
                                module: true
                            }
                        }
                    }
                }
            }
        })
    }),
    getMarketInfo: publicProcedure.input(z.object({
        waypoint: z.string()
    })).query(async ({input}) => {
        return prisma.marketPrice.findMany({
            where: {
                waypointSymbol: input.waypoint
            },
            include: {
                tradeGood: true
            }
        })
    }),
    getObjectives: publicProcedure.query(async () => {
        try {
            const data = fs.readFileSync('objectives.json').toString('utf8')
            const objectives = JSON.parse(data)
            objectives.objectives.sort((a: any, b: any) => {
                return b.priority - a.priority
            });
            return objectives
        } catch (error) {
            return []
        }
    }),
    getShipLog: publicProcedure.input(z.object({
        shipSymbol: z.string()
    })).query(async ({input}) => {
        return prisma.shipLog.findMany({
            where: {
                symbol: input.shipSymbol
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100
        })
    }),
    getMarketInfoHistory: publicProcedure.input(z.object({
        waypoint: z.string(),
        tradeGood: z.string()
    })).query(async ({input}) => {
        const priceHistory = await prisma.marketPriceHistory.findMany({
            where: {
                tradeGoodSymbol: input.tradeGood,
                waypointSymbol: input.waypoint
            },
            include: {
                tradeGood: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 192 // 2 days = 192 * 15 minutes
        })
        const trades = await prisma.tradeLog.findMany({
            where: {
                tradeGoodSymbol: input.tradeGood,
                waypointSymbol: input.waypoint
            }
        })
        let newData: TradeHistory = []
        priceHistory.forEach(ph => {
            newData.push({
                ...ph,
                entryType: 'history'
            })
        })
        trades.forEach(t => {
            newData.push({
                ...t,
                entryType: 'trade'
            })
        })
        newData.sort((a, b) => {
            // trade goes before history
            if (b.createdAt.toLocaleString() === a.createdAt.toLocaleString() && a.entryType === 'trade' && b.entryType === 'history') {
                return 1
            }
            return b.createdAt.getTime() - a.createdAt.getTime()
        });
        return newData
    }),
    getSystemMarket: publicProcedure.input(z.object({
        system: z.string()
    })).query(async ({input}) => {
        const marketPrices = await prisma.marketPrice.findMany({
            where: {
                waypoint: {
                    systemSymbol: input.system
                }
            },
        })
        return combinedMarketStats(marketPrices)
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;