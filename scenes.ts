import Scene from 'graphize-v2/src/scenes/scene'
import { Axes, NumberPlane, IRange, FunctionGraph, ParametricCurve } from 'graphize-v2/src/displayable/graph'
import { FadeIn } from 'graphize-v2/src/animations/fading'
import { sum, map } from 'graphize-v2/src/util/math'
import { Vector2 } from 'graphize-v2/src/util/vector'
import Color from 'graphize-v2/src/util/color'

export class FourierScene extends Scene {
  debugMode = true

  public intensityAxes: Axes
  public windingPlane: NumberPlane
  public fourierAxes: Axes

  public signal: FunctionGraph
  public polarizedGraph: ParametricCurve
  public fourierGraph: FunctionGraph

  public frequencies: number[] = [2]

  public colors = {
    signal: Color.HEX('#b8529e'),
    plane: Color.HEX('#3a707c'),
  }
  public signalThickness = 1.5
  public sample: Vector2[]

  async construct() {
    await this.showSignal()
    await this.showWindingPlane()
    await this.showFourierGraph()
  }

  public createSignalAxes() {
    const axes = new Axes({
      axisConfig: {
        hasTip: true,
      },
      xRange: [0, 4.25, 0.25],
      yRange: [0, 1.2, 0.5],
      height: 2,
      width: 10,
      xAxisConfig: {
        largeTickEvery: 4,
      },
    })

    axes.transform.translate(Vector2.UP.mult(2.5).add(Vector2.RIGHT.mult(2)))

    this.intensityAxes = axes
    return this.play(new FadeIn(axes, 0.1))
  }

  public signalGraphFunction(t: number) {
    const values = this.frequencies.map((frequency) => Math.cos(frequency * 2 * Math.PI * t))
    const y = sum(...values) / values.length
    return map(y, -1, 1, 0, 1)
  }

  public getSignal() {
    const signal = this.intensityAxes.getGraph((x) => this.signalGraphFunction(x), 0.01, this.signalThickness)
    signal.transform = this.intensityAxes.transform.copy()
    signal.color = this.colors.signal
    this.signal = signal
    return signal
  }

  public async showSignal() {
    await this.createSignalAxes()
    await this.play(new FadeIn(this.getSignal(), 0.1))
  }

  public async showWindingPlane() {
    const plane = new NumberPlane({
      xRange: [-2.5, 2.5, 0.5],
      yRange: [-2.5, 2.5, 0.5],
      width: 4,
      height: 4,
      brightLineConfig: {
        color: this.colors.plane,
      },
      darkLineConfig: {
        color: this.colors.plane,
        thickness: 0.2,
      },
      axisConfig: {
        hasTip: false,
      },
    })

    this.windingPlane = plane

    plane.transform.translate(new Vector2(6.5, -1.5))

    const windingFrequency = 2

    const func = (u: number) => {
      const Θ = u * windingFrequency * Math.PI * 2
      const r = this.signalGraphFunction(u) * 2
      return Vector2.POLAR(Θ, r)
    }

    const graph = plane.getParametricGraph(
      func,
      this.intensityAxes.config.xRange.slice(0, 2) as IRange,
      0.01,
      this.signalThickness
    )

    this.polarizedGraph = graph

    graph.transform = plane.transform.copy()
    graph.color = this.colors.signal

    await this.play(new FadeIn(plane, 0.1))
    await this.play(new FadeIn(graph))
  }

  public async showFourierGraph() {
    const axes = new Axes({
      xRange: [0, 5],
      yRange: [-1, 1, 0.5],
      width: 7,
      height: 4,
    })

    axes.transform.translate(new Vector2(0.5, -1.5))

    this.fourierAxes = axes

    this.sample = this.getSample()
    const graph = axes.getGraph((f: number) => this.getFT(f), 0.01)

    graph.transform = axes.transform.copy()

    await this.play(new FadeIn(axes))
    await this.play(new FadeIn(graph))
  }

  public getSample() {
    const sample = []

    for (let t = 0; t < 5; t += 0.05) sample.push(new Vector2(t, this.signalGraphFunction(t)))

    return sample
  }

  public getFT(f: number, dataFunc: (θ: number) => number = Math.cos) {
    let sum = 0

    for (const point of this.sample) {
      const θ = 2 * Math.PI * f * point.x
      const r = point.y * 2
      sum += r * dataFunc(θ)
    }

    sum /= this.sample.length

    return sum
  }
}
