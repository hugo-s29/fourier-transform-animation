import Color from './colors'
import { Display } from './display'
import { Line } from './geometry'
import Graph, { FunctionGraph } from './graph'
import Label from './label'
import { map } from './util'

class IntensityGraph extends Graph {
  //                   frequency, intensity
  public intensities: [number, number][]
  public graph: FunctionGraph
  static ticksCountX = 18
  // bars: Line[]

  constructor(intensities: [number, number][]) {
    const ticksCountX = IntensityGraph.ticksCountX

    super([ticksCountX, 3], [0.4, 0.2], [0.2, 0.2], Display.width * 0.9, Display.height * (1 / 5))

    this.intensities = intensities

    const [xAxis, yAxis] = [this.getXAxis(4, 0.2, true, (i) => (i / 4).toString()), this.getYAxis(1, 0.2, false)]
    this.add(xAxis, yAxis)
    this.axis = [xAxis, yAxis]

    yAxis.translate([-this.width / 2, -this.height / 2])

    const graph = new FunctionGraph((x) => this.getValue(x), [0, ticksCountX], 0.01)
      .mapInRectangle({
        x: [-this.width / 2, this.width / 2],
        y: [0, -this.height * 0.8],
      })
      .setStroke(Color.MAGENTA, 0.5)
    this.graph = graph

    this.add(graph)

    const timeLabel = new Label('Time')
    const intensityLabel = new Label('Intensity')

    timeLabel.scale([0.7, -0.7]).translate([5, -0.8])
    intensityLabel.scale([0.7, -0.7]).translate([-9.5, 2.5])

    this.add(timeLabel)
    this.add(intensityLabel)

    // this.bars = []
    // this.createBar(0)
    // this.createBar(0)
    // this.createBar(0)
    // this.createBar(0)
  }

  public updateValues() {
    this.graph.regeneratePoints((x) => this.getValue(x), [0, IntensityGraph.ticksCountX], 0.01)
    this.graph.mapInRectangle({
      x: [-this.width / 2, this.width / 2],
      y: [0, -this.height * 0.8],
    })
  }

  // public createBar(x: number) {
  //   const pos = map(x, 0, IntensityGraph.ticksCountX / 4, -this.width / 2, this.width / 2)
  //   const l = new Line([pos, 0], [pos, -this.height])
  //   this.bars.push(l)
  //   this.add(l)
  // }

  // public updateBars(windingFreq: number) {
  //   for(let i = 0; i < this.bars.length; i++){
  //     const bar = this.bars[i]
  //     const newX = i * windingFreq
  //     const dx =
  //   }
  // }

  public getValue(x: number) {
    let y = 0

    for (const [frequency, intensity] of this.intensities) {
      y += Math.cos((frequency * x * Math.PI) / 2) * intensity
    }

    return y
  }
}

export default IntensityGraph
