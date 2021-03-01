import FourierGraph from './fourierGraph'
import { round } from './util'

export default class TimeSlider {
  static range: [number, number] = [0, 5]

  running: boolean
  advancement: number
  wasRunning: boolean
  sliderElement: HTMLInputElement
  pauseButton: HTMLButtonElement

  constructor() {
    this.running = true
    this.wasRunning = true
    this.advancement = 0

    this.sliderElement = document.createElement('input')
    this.sliderElement.setAttribute('type', 'range')
    this.sliderElement.setAttribute('min', TimeSlider.range[0].toString())
    this.sliderElement.setAttribute('max', TimeSlider.range[1].toString())
    this.sliderElement.setAttribute('step', 'any')
    this.sliderElement.setAttribute('value', this.advancement.toString())

    this.sliderElement.addEventListener('input', (e) => {
      this.advancement = +this.sliderElement.value
    })

    this.pauseButton = document.createElement('button')
    this.onchange()
    this.pauseButton.addEventListener('click', () => {
      this.toggle()
    })

    document.body.appendChild(this.sliderElement)
    document.body.appendChild(this.pauseButton)
  }

  private onchange() {
    this.pauseButton.innerHTML = this.running ? '⏸︎' : '⏵︎'
  }

  pause() {
    this.running = false
    this.onchange()
  }

  continue() {
    this.running = true
    this.onchange()
  }

  toggle() {
    if (this.advancement >= TimeSlider.range[1]) {
      this.advancement = 0
      this.sliderElement.setAttribute('value', this.advancement.toString())
    }

    this.running = !this.running
    this.onchange()
  }

  advance(dt: number) {
    const dx = round(0.0001 * dt, 3)
    this.advancement += dx
    this.sliderElement.setAttribute('value', this.advancement.toString())
  }
}
