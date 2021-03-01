import Color from './colors'
import { Group } from './entity'
import { Circle, Line } from './geometry'
import { ParametricFunctionGraph } from './graph'
import IntensityGraph from './intensityGraph'
import { map, range, round } from './util'

export default class PolarGraph extends Group {
  intensityGraph: IntensityGraph
  windingFreq: number
  polar: ParametricFunctionGraph
  massCenterPos: [number, number]
  massCenter: Circle

  static size: [number, number] = [6, 6]

  constructor(intensityGraph: IntensityGraph) {
    super()
    this.intensityGraph = intensityGraph
    this.getLines()

    const func = intensityGraph.getValue.bind(intensityGraph) as (x: number) => number

    this.windingFreq = 0

    const polar = new ParametricFunctionGraph(
      this.polarizeFunction(func, this.windingFreq, 0.75 ** intensityGraph.intensities.length),
      [0, IntensityGraph.ticksCountX],
      0.01
    ).setStroke(Color.MAGENTA, 0.7)
    this.polar = polar

    const pos = this.getPositionCenterOfMass()
    const massCenter = new Circle(0.1).setStroke('none', 0).setFill(Color.RED).translate(pos)
    this.massCenter = massCenter

    this.massCenterPos = pos

    const dashedCircle = new Circle(1.42).setFill('none').setStroke(Color.WHITE, 0.4, 0.1, 0.01)

    this.add(polar, massCenter, dashedCircle)
  }

  updateValues() {
    const intensityGraph = this.intensityGraph
    const func = intensityGraph.getValue.bind(intensityGraph) as (x: number) => number
    this.polar.regenerateParametricPoints(
      this.polarizeFunction(func, this.windingFreq, 0.75 ** intensityGraph.intensities.length),
      [0, IntensityGraph.ticksCountX],
      0.01
    )

    const currentPosition = this.getPositionCenterOfMass()

    this.massCenter.translate([currentPosition[0] - this.massCenterPos[0], currentPosition[1] - this.massCenterPos[1]])
    this.massCenterPos = currentPosition
    this.massCenter.update()
  }

  getPositionCenterOfMass() {
    const mean: [number, number] = [0, 0]
    let i = 0
    for (const [x, y] of this.polar.points) {
      mean[0] += x
      mean[1] += y
      i++
    }

    mean[0] /= i / 2
    mean[1] /= i / 2

    return mean
  }

  polarizeFunction(func: (x: number) => number, windingFreq: number, scale: number): (t: number) => [number, number] {
    const minMax = this.intensityGraph.graph.getMinMaxY()

    return (t: number) => {
      const x = t / 2
      const y = map(func(t), minMax[0], minMax[1], 0, 2)

      const angle = x * windingFreq * Math.PI
      const u = Math.cos(angle) * y * scale
      const v = Math.sin(angle) * y * scale

      return [u, v]
    }
  }

  getLines() {
    const [w, h] = PolarGraph.size

    const offset = 0.1

    //* Secondary grid
    for (const i of range(4)) {
      const x = map(i + 0.5, -offset, 4 + offset, -w / 2, w / 2)
      const line = new Line([x, -h / 2], [x, h / 2]).setStroke(Color.DARK_BLUE, 0.08)
      this.add(line)
    }

    for (const i of range(4)) {
      const y = map(i + 0.5, -offset, 4 + offset, -h / 2, h / 2)
      const line = new Line([-w / 2, y], [w / 2, y]).setStroke(Color.DARK_BLUE, 0.08)
      this.add(line)
    }

    //* Main grid
    for (const i of range(5)) {
      const x = map(i, -offset, 4 + offset, -w / 2, w / 2)
      const line = new Line([x, -h / 2], [x, h / 2])

      if (i === 2) line.setStroke(Color.WHITE, 0.5)
      else line.setStroke(Color.BLUE, 0.5)

      this.add(line)
    }

    for (const i of range(5)) {
      const y = map(i, -offset, 4 + offset, -h / 2, h / 2)
      const line = new Line([-w / 2, y], [w / 2, y]).setStroke(Color.BLUE, 0.5)

      if (i === 2) line.setStroke(Color.WHITE, 0.5)
      else line.setStroke(Color.BLUE, 0.5)

      this.add(line)
    }
  }
}
