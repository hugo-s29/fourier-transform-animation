import Color from './colors'
import { Display } from './display'
import { Group } from './entity'
import { Circle, Rectangle } from './geometry'
import Graph, { FunctionGraph } from './graph'
import IntensityGraph from './intensityGraph'
import Label from './label'
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
  g: Group // group containing the graph and the point

  constructor(intensityGraph: IntensityGraph) {
    const ticksCountX = FourierGraph.ticksCountX

    super([ticksCountX, 4], [0.2, 0.2], [0.2, 0.2], Display.width * (2.8 / 5), PolarGraph.size[1] * 0.8, Color.GREEN)

    const negativeFormat = (n: number) => (n >= 0 ? ' ' + n.toFixed(1) : n.toFixed(1))

    const [xAxis, yAxis] = [
      this.getXAxis(1, 0.2, true, (i) => (i === 0 ? null : i.toString())),
      this.getYAxis(1, 0, true, (i) => negativeFormat(map(i, 4, 0, -1, 1))),
    ]
    this.add(xAxis, yAxis)
    this.axis = [xAxis, yAxis]

    yAxis.translate([-this.width / 2, -this.height / 2])
    xAxis.translate([0, -this.height / 2])

    this.intensityGraph = intensityGraph

    const graph = new FunctionGraph(this.getValue(intensityGraph), [0, ticksCountX * 2], 0.025)
      .setStroke(Color.RED, 0.5)
      .scale([0.89, 1])
    this.graph = graph

    const g = new Group()
    const pos = graph.points[graph.points.length - 1]

    this.dot = new Circle(0.1).setStroke('none', 0).setFill(Color.WHITE).translate(pos)
    this.dotPos = pos

    g.add(graph)
    g.add(this.dot)
    g.scale([1, 1]).translate([-this.width / 2, -this.height / 2])

    this.g = g

    const surroundingRectangle = new Rectangle(this.width * 1.18, this.height * 1.1)
      .translate([-this.width * 0.01, (-this.height * 1.05) / 2])
      .setFill('none')
      .setStroke(Color.GREEN, 0.5)

    this.add(surroundingRectangle)

    this.add(g)

    const label = new Label('Frequency')
    label.label.scale([1, -1])
    label.scale(0.6).translate([5, -2.5])
    this.add(label)
  }

  public updateValues() {
    this.graph.regeneratePoints(this.getValue(this.intensityGraph), [0, FourierGraph.ticksCountX * 2], 0.025)
  }

  public moveDot(x: number) {
    const y = this.graph.func(x / 0.89)
    const dx = x - this.dotPos[0]
    const dy = y - this.dotPos[1]

    this.dot.translate([dx, dy])
    this.dotPos = [x, y]
  }

  private getValue(intensityGraph: IntensityGraph) {
    const func = intensityGraph.getValue.bind(intensityGraph) as (x: number) => number

    console.log(intensityGraph.intensities)
    const minMax = intensityGraph.graph.getMinMaxY()
    const points: [number, number][] = []

    for (let t = 0; t < IntensityGraph.ticksCountX; t += 0.5) points.push([t, map(func(t), minMax[0], minMax[1], 0, 1)])

    return (windingFreq: number) => {
      const mean: [number, number] = [0, 0]

      for (const [x, y] of points) {
        const angle = (x * windingFreq * Math.PI) / 4
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
