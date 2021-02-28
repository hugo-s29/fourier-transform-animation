import Color from './colors'
import { Display } from './display'
import Entity, { Polygon } from './entity'
import { Triangle, Line } from './geometry'
import { map, range } from './util'

class Graph extends Entity<SVGGElement> {
  axis: Entity<SVGGElement>[]
  ticksCount: [number, number]
  tickWidth: [number, number]
  smalltickWidth: [number, number]
  width: number
  height: number
  arrowWidth: number
  color: string

  constructor(
    ticksCount: [number, number] = [16, 4],
    tickWidth: [number, number] = [0.4, 0.4],
    smalltickWidth: [number, number] = [0.2, 0.2],
    width = Display.width,
    height = Display.height,
    color = Color.LIGHT_GRAY
  ) {
    super(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
    this.ticksCount = ticksCount
    this.tickWidth = tickWidth
    this.smalltickWidth = smalltickWidth
    this.width = width
    this.height = height
    this.arrowWidth = 0.6
    this.color = color
  }

  protected generateAxis() {
    const [xAxis, yAxis] = this.getAxis()
    this.add(xAxis, yAxis)
    this.axis = [xAxis, yAxis]
    return [xAxis, yAxis]
  }

  protected getAxis() {
    return [this.getXAxis(), this.getYAxis()]
  }

  protected getXAxis(maintick: number = 1, pad: number = 0.3) {
    const [tickWidth] = this.tickWidth
    const [smalltickWidth] = this.smalltickWidth

    const line = new Line([-this.width / 2 - pad, 0], [this.width / 2, 0])
    line.setStroke(this.color, 0.4)

    const ticks: Line[] = []
    for (const i of range(this.ticksCount[0])) {
      const x = map(i, 0, this.ticksCount[0], -this.width / 2, this.width / 2)
      const y = 0
      const _tickWidth = i % maintick === 0 ? tickWidth : smalltickWidth
      const ptA: [number, number] = [x, y - _tickWidth / 2]
      const ptB: [number, number] = [x, y + _tickWidth / 2]
      const tick = new Line(ptA, ptB)
      tick.setStroke(this.color, 0.4)
      ticks.push(tick)
    }

    const arrow = new Triangle(0.5, [this.width / 2, 0])
      .scale([0.7, this.arrowWidth])
      .setStroke('none', 0)
      .setFill(this.color)

    const axis = new Entity<SVGGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
    axis.add(...ticks, line, arrow)
    return axis
  }

  public getTickSpacing() {
    const x =
      map(1, 0, this.ticksCount[0], -this.width / 2, this.width / 2) -
      map(0, 0, this.ticksCount[0], -this.width / 2, this.width / 2)
    const y =
      map(1, 0, this.ticksCount[1], -this.height / 2, this.height / 2) -
      map(0, 0, this.ticksCount[1], -this.height / 2, this.height / 2)

    return { x, y }
  }

  protected getYAxis(maintick: number = 1, pad: number = 0.3) {
    const [, tickWidth] = this.tickWidth
    const [, smalltickWidth] = this.smalltickWidth

    const line = new Line([0, -this.height / 2 - pad], [0, this.height / 2])
    line.setStroke(this.color, 0.4)

    const ticks: Line[] = []
    for (const i of range(this.ticksCount[1])) {
      const x = 0
      const y = map(i, 0, this.ticksCount[1], -this.height / 2, this.height / 2)
      const _tickWidth = i % maintick === 0 ? tickWidth : smalltickWidth
      const ptA: [number, number] = [x - _tickWidth / 2, y]
      const ptB: [number, number] = [x + _tickWidth / 2, y]
      const tick = new Line(ptA, ptB)
      tick.setStroke(this.color, 0.4)
      ticks.push(tick)
    }

    const arrow = new Triangle(0.5, [0, this.height / 2])
      .rotate(Math.PI / 2)
      .scale([0.7, this.arrowWidth])
      .setStroke('none', 0)
      .setFill(this.color)

    const axis = new Entity<SVGGElement>(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
    axis.add(...ticks, line, arrow)
    return axis
  }
}

export class ParametrixFunctionGraph extends Polygon {
  constructor(func: (t: number) => [number, number], [tMin, tMax]: [number, number] = [0, 1], tInc: number = 0.01) {
    const points: [number, number][] = []
    for (let t = tMin; t < tMax; t += tInc) {
      const [x, y] = func(t)
      points.push([x, y])
    }
    super(points, true)
  }

  regenerateParametricPoints(
    func: (t: number) => [number, number],
    [tMin, tMax]: [number, number] = [0, 1],
    tInc: number = 0.01
  ) {
    const points: [number, number][] = []
    for (let t = tMin; t < tMax; t += tInc) {
      const [x, y] = func(t)
      points.push([x, y])
    }
    this.points = points
    this.generatePathFromPoints()
  }

  getMinMax(): { x: [number, number]; y: [number, number] } {
    return {
      x: this._getMinMax(0),
      y: this._getMinMax(1),
    }
  }

  private _getMinMax(coordIndex: number): [number, number] {
    let min = Infinity
    let max = -Infinity

    for (const pt of this.points) {
      const c = pt[coordIndex]
      min = Math.min(min, c)
      max = Math.max(max, c)
    }

    return [min, max]
  }

  public normalize() {
    const { x, y } = this.getMinMax()
    const w = x[1] - x[0]
    const h = y[1] - y[0]
    this.scale([1 / w, 1 / h])
  }
}

export class FunctionGraph extends ParametrixFunctionGraph {
  xRange: [number, number]
  xInc: number
  func: (x: number) => number

  constructor(func: (x: number) => number, xRange: [number, number] = [-10, 10], xInc: number = 0.1) {
    super((t: number) => [t, func(t)], xRange, xInc)
    this.xRange = xRange
    this.xInc = xInc
    this.func = func
  }

  public getMinMaxY() {
    return super.getMinMax().y
  }

  public regeneratePoints(func: (x: number) => number, xRange: [number, number] = [-10, 10], xInc: number = 0.1) {
    this.regenerateParametricPoints((t: number) => [t, func(t)], xRange, xInc)
    this.xRange = xRange
    this.xInc = xInc
    this.func = func
  }

  normalize() {
    const [min, max] = this.getMinMaxY()
    const func = (x: number) => map(this.func(x), min, max, 0, 1)
    this.regeneratePoints(func, this.xRange, this.xInc)
    return this
  }

  mapInRectangle(rect: { x: [number, number]; y: [number, number] }) {
    const minMax = this.getMinMax()
    this.regenerateParametricPoints(
      (x: number) => [
        map(x, minMax.x[0], minMax.x[1], rect.x[0], rect.x[1]),
        map(this.func(x), minMax.y[0], minMax.y[1], rect.y[0], rect.y[1]),
      ],
      this.xRange,
      this.xInc
    )

    return this
  }
}

export default Graph
