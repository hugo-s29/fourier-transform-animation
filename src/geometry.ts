import Entity, { Polygon } from './entity'
import { map, range } from './util'

export class Line extends Polygon {
  constructor(from: [number, number], to: [number, number]) {
    super([from, to], true)
  }
}

export class RegularPolgyon extends Polygon {
  constructor(pos: [number, number], r: number, startAngle: number, pointCount: number) {
    const points: [number, number][] = []
    for (const i of range(pointCount)) {
      const angle = startAngle + map(i, 0, pointCount, 0, 2 * Math.PI)
      const pt: [number, number] = [r * Math.cos(angle), r * Math.sin(angle)]
      points.push(pt)
    }
    super(points)
    this.translate(pos)
  }
}

export class Triangle extends RegularPolgyon {
  constructor(w: number, pos: [number, number]) {
    super(pos, w / 2, 0, 3)
  }
}

export class Circle extends RegularPolgyon {
  constructor(r: number) {
    super([0, 0], r, 0, 100)
  }
}

export class Rectangle extends Polygon {
  constructor(w: number, h: number) {
    super([
      [-w / 2, -h / 2],
      [-w / 2, +h / 2],
      [+w / 2, +h / 2],
      [+w / 2, -h / 2],
    ])
  }
}
