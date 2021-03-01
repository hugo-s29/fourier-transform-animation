import Color from './colors'
import Entity from './entity'

export class TextLabel extends Entity<SVGTextElement> {
  container: Label

  constructor(text: string, container: Label) {
    super(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
    this.container = container
    this.domElement.textContent = text
    this.setFill(Color.WHITE).setStroke('none', 0)
  }

  changeText(t: string) {
    this.domElement.textContent = t
  }

  update() {
    super.update()
    this.domElement.style.transform += ' translate(-1%, -1%)'
  }

  postUpdate() {
    if (this.container.math) this.domElement.classList.add('math')
    else this.domElement.classList.remove('math')
  }
}

export default class Label extends Entity<SVGGElement> {
  label: TextLabel
  math: boolean = false

  constructor(text: string) {
    super(document.createElementNS('http://www.w3.org/2000/svg', 'g'))
    this.label = new TextLabel(text, this)
    this.add(this.label)
  }

  changeText(t: string) {
    this.label.changeText(t)
  }

  mathFont() {
    this.math = true
    return this
  }
}
