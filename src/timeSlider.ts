import FourierGraph from './fourierGraph'

export default class TimeSlider {
  static range: [number, number] = [0, (FourierGraph.ticksCountX * 2.05) / 2]

  running: boolean
  advancement: number
  wasRunning: boolean
  restartButton: HTMLButtonElement
  pauseButton: HTMLButtonElement

  controls: HTMLDivElement

  constructor(controlBox: HTMLDivElement) {
    this.running = true
    this.wasRunning = true
    this.advancement = 0

    this.restartButton = document.createElement('button')
    this.restartButton.innerHTML = '<i class="fas fa-redo"></i>'
    this.restartButton.addEventListener('click', () => {
      this.restartAnimation()
    })
    this.restartButton.classList.add('round-btn')

    this.pauseButton = document.createElement('button')
    this.onchange()
    this.pauseButton.addEventListener('click', () => {
      this.toggle()
    })
    this.pauseButton.classList.add('round-btn')

    const controls = document.createElement('div')
    controls.classList.add('controls')

    controls.appendChild(this.restartButton)
    controls.appendChild(this.pauseButton)

    this.controls = controls

    controlBox.appendChild(controls)
  }

  private onchange() {
    this.pauseButton.innerHTML = this.running ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>'
  }

  restartAnimation() {
    this.advancement = 0
    this.play()
    this.onchange()
  }

  pause() {
    this.running = false
    this.onchange()
  }

  play() {
    this.running = true
    this.onchange()
  }

  toggle() {
    if (this.advancement >= TimeSlider.range[1]) this.advancement = 0

    this.running = !this.running
    this.onchange()
  }

  advance(dt: number) {
    const dx = 0.002
    // const dx = round(0.0001 * dt, 3)
    this.advancement += dx
  }
}
