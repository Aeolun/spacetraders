import {defaultWayfinder} from "@app/wayfinding";
import {prisma} from "@app/prisma";

let slice = 0
let sliceSize = 100
process.argv.forEach(item => {
    if (item.includes('--slice=')) {
        slice = parseInt(item.substring(8))
    }
})
defaultWayfinder.loadWaypoints().then(() => {
    defaultWayfinder.findRoute('X1-CQ39', 'X1-UD48', {
        max: 100,
        current: 100
    }).then(async stuff => {
        const allWaypoints = await prisma.waypoint.findMany({
            where: {
                type: 'JUMP_GATE'
            },
            include: {
                jumpgate: true
            }
        })
        let routes = []
        let inserted = 0, batchSize = 1000, findBatchSize = 500;
        const allJumpGates = allWaypoints.filter(wp => wp.jumpgate);

        const startTime = Date.now()
        const slicedGates = allJumpGates.slice(slice*sliceSize, slice*sliceSize + sliceSize)
        console.log(`${allJumpGates.length} known jump gates, ${Math.ceil(allJumpGates.length / sliceSize)} slices, processing slice ${slice}, items ${slice*sliceSize}-${slice*sliceSize+sliceSize}`)
        const totalCount = slicedGates.length * allJumpGates.length
        for(const source of slicedGates) {
            for (const target of allJumpGates) {
                const route = await defaultWayfinder.findJumpRoute(source.systemSymbol, target.systemSymbol, {
                    max: 100,
                    current: 100
                })
                if (route.finalPath.length > 0) {
                    routes.push({
                        fromSystemSymbol: source.systemSymbol,
                        toSystemSymbol: target.systemSymbol,
                        jumps: route.finalPath.length,
                        totalDistance: route.pathProperties.priority
                    })
                    if (routes.length >= batchSize) {
                        await prisma.jumpDistance.createMany({
                            data: routes,
                            skipDuplicates: true
                        })
                        const timeTakenSoFar = Date.now() - startTime
                        const multiplier = totalCount / inserted
                        const expectedTotalTime = timeTakenSoFar * multiplier
                        const timeRemaining = expectedTotalTime - timeTakenSoFar

                        console.log(`${inserted}/${totalCount}: Insert ${batchSize} jump distances, ${timeRemaining/1000/60}m left`)
                        routes = []
                    }
                    inserted++
                } else {
                    inserted++
                    if (inserted % findBatchSize === 0) {
                        console.log(`${inserted}/${totalCount}: Pausing a bit`)
                        await new Promise((resolve, reject) => {
                            setTimeout(resolve, 20)
                        })
                    }
                }
            }
        }
        await prisma.jumpDistance.createMany({
            data: routes,
            skipDuplicates: true
        })
        console.log(`Inserted ${routes.length} remaining routes`)

    })
})