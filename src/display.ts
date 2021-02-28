import Entity from './entity'

export class Display {
  private svg: SVGSVGElement

  public static width = 16
  public static height = 9

  private prevTime: number
  public frameCount: number = 0

  public animating: boolean = true

  constructor() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svg.setAttribute('viewBox', `${-Display.width / 2} ${-Display.height / 2} ${Display.width} ${Display.height}`)
    this.svg.style.background = 'black'
    document.body.appendChild(this.svg)

    this.prevTime = Date.now()
  }

  public add<T extends SVGElement>(e: Entity<T>) {
    e.update()
    this.svg.appendChild(e.domElement)
  }

  public animate(cb: (dt: number) => any) {
    const animationCallback = () => {
      const dt = Date.now() - this.prevTime
      this.frameCount++

      this.prevTime += dt

      cb(dt)

      if (this.animating) requestAnimationFrame(animationCallback)
    }
    requestAnimationFrame(animationCallback)
  }
}
