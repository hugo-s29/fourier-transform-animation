import { mat2d, vec2 } from 'gl-matrix'

class Entity<SVGElementType extends SVGElement> {
  public domElement: SVGElementType
  public transformationMatrix: mat2d

  constructor(domElement: SVGElementType) {
    this.domElement = domElement
    this.transformationMatrix = mat2d.create()
    this.scale([1, -1])
  }

  public update() {
    this.domElement.style.transform = mat2d.str(this.transformationMatrix).replace('mat2d', 'matrix')
  }

  public postUpdate() {}

  public add(...e: Entity<any>[]) {
    e.forEach((entity) => entity.update())

    this.domElement.append(...e.map((line) => line.domElement))

    e.forEach((entity) => entity.postUpdate())
  }

  //* Angle in radians
  public rotate(angle: number) {
    mat2d.rotate(this.transformationMatrix, this.transformationMatrix, angle)
    this.update()
    return this
  }

  public translate([x, y]: [number, number]) {
    const v = vec2.fromValues(x, y)
    mat2d.translate(this.transformationMatrix, this.transformationMatrix, v)
    this.update()
    return this
  }

  public scale(k: number | [number, number]) {
    const [x, y] = Array.isArray(k) ? k : [k, k]
    const v = vec2.fromValues(x, y)
    mat2d.scale(this.transformationMatrix, this.transformationMatrix, v)
    this.update()
    return this
  }

  public setStroke(color: string, width: number, dashArray?: number, dashOffset?: number) {
    this.domElement.style.stroke = color
    this.domElement.style.strokeWidth = (width / 15).toString()

    if (dashArray !== undefined) this.domElement.style.strokeDasharray = dashArray.toString()
    if (dashOffset !== undefined) this.domElement.style.strokeDashoffset = dashOffset.toString()

    return this
  }

  public setFill(color: string) {
    this.domElement.style.fill = color
    return this
  }

  public setOpacity(opacity: number) {
    this.domElement.style.opacity = opacity.toString()
    return this
  }
}

export class Polygon extends Entity<SVGPathElement> {
  public points: [number, number][]
  protected reverse: boolean

  constructor(points: [number, number][], reverse: boolean = false) {
    super(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
    this.points = points
    this.reverse = reverse
    this.generatePathFromPoints()
    this.setStroke('white', 1)
  }

  protected generatePathFromPoints() {
    let path = ''

    let i = 0
    for (const [x, y] of this.points) {
      const command = i === 0 ? 'M' : 'L'

      path += `${command} ${x} ${y} `

      i++
    }

    if (this.reverse) for (const [x, y] of this.points.reverse()) path += `L ${x} ${y} `

    path += 'Z'

    this.domElement.setAttribute('d', path)
  }
}

export class Group extends Entity<SVGGElement> {
  constructor() {
    super(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
  }
}

export default Entity
