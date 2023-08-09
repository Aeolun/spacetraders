import fs from 'fs'

const firstPart = fs.readFileSync(__dirname+'/nameparts/contellation.txt').toString()
const secondPart = fs.readFileSync(__dirname+'/nameparts/count.txt').toString()

const constellation = firstPart.split('\n').filter(l => !l.includes('#'))
const counter = secondPart.split('\n').filter(l => !l.includes('#'))

export const generateName = () => {
    const contellationIndex = Math.floor(Math.random()*constellation.length)
    const countIndex = Math.floor(Math.random()*counter.length)

    return constellation[contellationIndex]+' '+counter[countIndex]
}