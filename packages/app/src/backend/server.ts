import {publicProcedure, router} from './trpc';
import z from 'zod'
import {prisma, ShipBehavior} from "@backend/prisma";
import { sign, verify } from 'jsonwebtoken';
import crypto from 'crypto'

import { observable } from '@trpc/server/observable';
import {ee} from "@backend/event-emitter";

export const appRouter = router({
    register: publicProcedure.input(z.object({
        email: z.string(),
        password: z.string()
    })).mutation(async ({input, ctx}) => {

        const salt = crypto.randomBytes(16).toString('hex');
        const passwordValue = crypto.pbkdf2Sync(input.password, salt, 1000, 64, 'sha512').toString('hex');
        const password = `${salt}::${passwordValue}`

        await prisma.account.create({
            data: {
                email: input.email,
                password: password,
            }
        })
        return {
            token: sign({
                email: input.email
            }, process.env.JWT_SECRET)
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
                jumpgate: {
                    include: {
                        validJumpTargets: true
                    }
                }
            }
        })

        return waypoints
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
                jumpgate: true,
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
    getAgents: publicProcedure.query(async () => {
        return prisma.server.findMany()
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
                cargo: true
            }
        })
    }),
    getAgentInfo: publicProcedure.query(async ({ctx}) => {
        return prisma.agent.findFirst({
            where: {
                symbol: ctx.payload.identifier
            }
        })
    }),
    getMyShips: publicProcedure.query(async ({ctx}) => {
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
               cargo: true
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
                        shipConfigurationMount: true,
                        shipConfigurationModule: true
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
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;