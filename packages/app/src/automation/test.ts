import node_or_tools from 'node_or_tools'
import * as util from "util";
import fs from "fs";
import {createCanvas} from "canvas";

class MatrixBuilder {

  public vertexes: {name: string, x: number, y: number}[] = [];

  constructor() {}

  public addVertex(name: string, x: number, y: number) {
    this.vertexes.push({name, x, y});
  }

  private distance(a: {x: number, y: number}, b: {x: number, y: number}) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
  }

  get size() {
    return this.vertexes.length
  }

  public build() {
    const size = this.vertexes.length
    const matrix = Array(size).fill(0).map(() => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
      const vertexA = this.vertexes[i];
      for (let j = 0; j < size; j++) {
        const vertexB = this.vertexes[j];
        matrix[i][j] = this.distance(vertexA, vertexB);
      }
    }
    return matrix;
  }

  public getNameForIndex(index: number) {
    return this.vertexes[index].name
  }

  public pathToNames(path: number[]) {
    return path.map(i => this.getNameForIndex(i))
  }

  public getBoundaries() {
    const x = this.vertexes.map(i => i.x)
    const y = this.vertexes.map(i => i.y)
    return {
      minX: Math.min(...x),
      maxX: Math.max(...x),
      minY: Math.min(...y),
      maxY: Math.max(...y)
    }
  }
}

const matrix = new MatrixBuilder()
// add 1000 random vertexes
for (let i = 0; i < 5000; i++) {
  matrix.addVertex(i.toString(), Math.random() * 1000, Math.random() * 1000)
}

console.log("building matrix")
const startMatrixBuild = Date.now()
var tspSolverOpts = {
  numNodes: matrix.size,
  costs: matrix.build()
};
console.log(`Took ${Date.now() - startMatrixBuild}ms`)

console.log("Creating solver")
const startSolver = Date.now()
var TSP = new node_or_tools.TSP(tspSolverOpts);

const depotNode = 0
var tspSearchOpts = {
  computeTimeLimit: 5000,
  depotNode
};

console.log(`Took ${Date.now() - startSolver}ms`)
console.log("sOlving")
const start = Date.now()
TSP.Solve(tspSearchOpts, function (err, solution) {
  if (err) return console.log(err);
  console.log(`Took ${Date.now() - start}ms`)
  console.log(util.inspect(matrix.pathToNames(solution), {showHidden: false, depth: null}));
  solution.unshift(depotNode)
  solution.push(depotNode)

  const boundaries = matrix.getBoundaries()
  const width = boundaries.maxX - boundaries.minX

//   const svg = `
// <svg width="1000" height="1000" viewBox="${boundaries.minX - 1} ${boundaries.minY - 1} ${boundaries.maxX - boundaries.minX + 2} ${boundaries.maxY - boundaries.minY + 2}" xmlns="http://www.w3.org/2000/svg">
//   <defs>
//     <marker id="arrowhead"
//       viewBox="0 0 2 2"
//       refX="1"
//       refY="1"
//       markerUnits="strokeWidth"
//       markerWidth="2"
//       markerHeight="2"
//       orient="auto">
//       <path d="M 0 0 L 2 1 L 0 2 z" fill="#f00" />
//     </marker>
//     </defs>
//
//   <rect x="${boundaries.minX - 1}" y="${boundaries.minY -1}" width="100%" height="100%" fill="white" />
//
//     ${solution.map((index, i) => {
//     const vertex = matrix.vertexes[index]
//     const nextVertex = matrix.vertexes[solution[i + 1]]
//     if (!nextVertex) return ''
//     // arrow from vertext to nextVertex, number for index
//     return `<path stroke="yellow" stroke-width="${width / 1000}" d="M ${vertex.x} ${vertex.y} L ${nextVertex.x} ${nextVertex.y}" marker-start="url(#arrowhead)" /><text fill="blue" x="${(vertex.x + nextVertex.x) / 2}" y="${(vertex.y + nextVertex.y) / 2}" font-size="1" text-anchor="start" dominant-baseline="middle">${i}</text>`
//   }).join('\n')}
//
// ${matrix.vertexes.map((vertex, index) => {
//     return `<circle cx="${vertex.x}" cy="${vertex.y}" r="0.25" fill="black" /><text fill="red" x="${vertex.x}" y="${vertex.y+1}" font-size="1" text-anchor="middle" dominant-baseline="middle">${matrix.getNameForIndex(index)}</text>`
//   }).join('\n')}
//
// </svg>
// `
//   fs.writeFileSync('./test.svg', svg)

  const canvas = createCanvas(1000, 1000)
  const ctx = canvas.getContext('2d')
  // draw the same thing in canvas that is drawn in svg
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, 1000, 1000)
  ctx.fillStyle = 'black'
  ctx.strokeStyle = 'gray'
  ctx.lineWidth = width / 1000
  ctx.font = '1px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  solution.forEach((index, i) => {
    ctx.beginPath()
    const vertex = matrix.vertexes[index]
    const nextVertex = matrix.vertexes[solution[i + 1]]
    if (!nextVertex) return
    ctx.moveTo(vertex.x, vertex.y)
    ctx.lineTo(nextVertex.x, nextVertex.y)
    ctx.stroke()
    ctx.fillText(i.toString(), (vertex.x + nextVertex.x) / 2, (vertex.y + nextVertex.y) / 2)
    ctx.closePath()
  })
  console.log("paths done")
  matrix.vertexes.forEach((vertex, index) => {
    ctx.beginPath()
    ctx.arc(vertex.x, vertex.y, 1, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillText(matrix.getNameForIndex(index), vertex.x, vertex.y + 1)
    ctx.closePath()
  });
  console.log('vertices done')
  fs.writeFileSync('./test.png', canvas.toBuffer('image/png'))
});

