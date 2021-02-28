import Color from './colors'
import { Display } from './display'
import { Group } from './entity'
import { Circle, Rectangle } from './geometry'
import Graph, { FunctionGraph } from './graph'
import IntensityGraph from './intensityGraph'
import PolarGraph from './polarGraph'
import { map } from './util'

export default class FourierGraph extends Graph {
  static ticksCountX = 5
  static ticksCountY = 5
  intensityGraph: IntensityGraph
  graph: FunctionGraph
  totalLength: number
  allPoints: [number, number][]
  dot: Circle
  dotPos: [number, number]

  constructor(intensityGraph: IntensityGraph) {
    const ticksCountX = FourierGraph.ticksCountX

    super([ticksCountX, 4], [0.2, 0.2], [0.2, 0.2], Display.width * (3 / 5), PolarGraph.size[1] * 0.8, Color.GREEN)

    const [xAxis, yAxis] = [this.getXAxis(), this.getYAxis(1, 0)]
    this.add(xAxis, yAxis)
    this.axis = [xAxis, yAxis]

    yAxis.translate([-this.width / 2, -this.height / 2])
    xAxis.translate([0, -this.height / 2])

    this.intensityGraph = intensityGraph

    const graph = new FunctionGraph(this.getValue(), [0, ticksCountX * 1.9], 0.025).setStroke(Color.RED, 0.5)
    this.graph = graph

    const g = new Group()
    const pos = graph.points[graph.points.length - 1]

    this.dot = new Circle(0.1).setStroke('none', 0).setFill(Color.WHITE).translate(pos)
    this.dotPos = pos

    g.add(graph)
    // g.add(this.dot)
    g.scale([1, 1]).translate([-this.width / 2, -this.height / 2])

    const surroundingRectangle = new Rectangle(this.width * 1.08, this.height * 1.1)
      .translate([-this.width * 0.01, (-this.height * 1.05) / 2])
      .setFill('none')
      .setStroke(Color.GREEN, 0.5)

    this.add(surroundingRectangle)

    this.add(g)
  }

  public moveDot(x: number) {
    const y = this.graph.func(x)
    const dx = x - this.dotPos[0]
    const dy = y - this.dotPos[1]

    this.dot.translate([dx, dy])
    this.dotPos = [x, y]
  }

  private getValue() {
    const { intensityGraph } = this
    const func = intensityGraph.getValue.bind(intensityGraph) as (x: number) => number
    const minMax = intensityGraph.graph.getMinMaxY()
    const points: [number, number][] = []

    for (let t = 0; t < IntensityGraph.ticksCountX; t += 0.5) points.push([t, map(func(t), minMax[0], minMax[1], 0, 1)])

    return (windingFreq: number) => {
      const mean: [number, number] = [0, 0]

      for (const [x, y] of points) {
        const angle = (x * windingFreq * Math.PI) / 3.85
        const u = Math.cos(angle) * y
        const v = Math.sin(angle) * y

        mean[0] += u
        mean[1] += v
      }

      mean[0] /= points.length
      mean[1] /= points.length

      return mean[0] * 2.3
    }
  }
}
