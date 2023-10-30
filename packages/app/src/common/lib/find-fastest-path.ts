import salesman from 'salesman.js'

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

export interface Vertex {
  name: string
  x: number
  y: number
}

export const findFastestPath = async (vertices: Vertex[], startNode: string): Promise<{
  path: string[],
  timings: {
    matrixBuildTime: number,
    createSolverTime: number,
    solveTime: number
  }
}> => {
  const matrix = new MatrixBuilder()

  for (const vertex of vertices) {
    matrix.addVertex(vertex.name, vertex.x, vertex.y)
  }

  const startMatrixBuild = Date.now()
  var tspSolverOpts = {
    numNodes: matrix.size,
    costs: matrix.build()
  };
  const matrixBuildTime = Date.now() - startMatrixBuild

  const startSolver = Date.now()

  const depotNode = 0
  var tspSearchOpts = {
    computeTimeLimit: 100,
    depotNode: vertices.findIndex(i => i.name === startNode)
  };
  const createSolverTime = Date.now() - startSolver

  const start = Date.now()

  return new Promise((resolve, reject) => {
    const solution: number[] = salesman.solve(vertices, 0.999995);
    const solveTime = Date.now() - start
    //solution.unshift()
    console.log(solution)




    return resolve({
      path: solution.map(i => vertices[i].name),
      timings: {
        matrixBuildTime,
        createSolverTime,
        solveTime
      }
    })
  });
}