import FourierGraph from './fourierGraph'
import IntensityGraph from './intensityGraph'
import PolarGraph from './polarGraph'
import TimeSlider from './timeSlider'
import { round } from './util'

export default class FrequencyEditor {
  domElement: HTMLDivElement
  intensityGraph: IntensityGraph
  fourierGraph: FourierGraph
  polarGraph: PolarGraph
  slider: TimeSlider
  table: HTMLTableElement

  elements: HTMLTableRowElement[] = []

  frequencies: [number, number][] = []
  addButton: HTMLButtonElement

  constructor(
    controlPanel: HTMLDivElement,
    slider: TimeSlider,
    intensityGraph: IntensityGraph,
    polarGraph: PolarGraph,
    fourierGraph: FourierGraph
  ) {
    this.domElement = document.createElement('div')
    this.domElement.classList.add('frequency-editor')

    controlPanel.appendChild(this.domElement)
    this.intensityGraph = intensityGraph
    this.polarGraph = polarGraph
    this.fourierGraph = fourierGraph
    this.slider = slider

    const addButton = document.createElement('button')
    addButton.innerHTML = '<i class="fas fa-plus"></i>'
    addButton.classList.add('round-btn')
    addButton.addEventListener('click', () => {
      this.addFrequency()
    })

    this.addButton = addButton

    this.table = document.createElement('table')
    this.domElement.appendChild(this.table)

    const th = (e: HTMLElement) => {
      const th = document.createElement('th')
      th.appendChild(e)
      return th
    }

    const span = (e: string) => {
      const span = document.createElement('span')
      span.innerText = e
      return span
    }

    const header = document.createElement('tr')
    header.appendChild(th(span('Frequency')))
    header.appendChild(th(span('Intensity')))
    header.appendChild(th(span('')))

    this.table.appendChild(header)

    this.addFrequency(2, 1)
  }

  public addFrequency(freq: number = 2, intensity: number = 1) {
    const row = document.createElement('tr')
    const index = this.frequencies.length

    this.frequencies.push([freq, intensity])

    const frequencyInput = document.createElement('input')
    frequencyInput.setAttribute('type', 'number')
    frequencyInput.setAttribute('min', '0')
    frequencyInput.setAttribute('max', '5')
    frequencyInput.setAttribute('step', '0.5')
    frequencyInput.setAttribute('value', freq.toFixed(1))
    const intensityInput = document.createElement('input')
    intensityInput.setAttribute('type', 'number')
    intensityInput.setAttribute('min', '0')
    intensityInput.setAttribute('max', '1')
    intensityInput.setAttribute('step', '0.1')
    intensityInput.setAttribute('value', intensity.toFixed(1))

    frequencyInput.addEventListener('change', () => {
      const frequency = Math.max(Math.min(frequencyInput.valueAsNumber, 5), 0)
      this.frequencies[index][0] = frequency
      frequencyInput.value = frequency.toFixed(1)
      this.onChange()
    })

    intensityInput.addEventListener('change', () => {
      const intensity = Math.max(Math.min(intensityInput.valueAsNumber, 1), 0)
      this.frequencies[index][1] = intensity
      intensityInput.value = intensity.toFixed(1)
      this.onChange()
    })

    const deleteButton = document.createElement('button')

    deleteButton.innerHTML = '<i class="fas fa-trash"></i>'
    deleteButton.classList.add('round-btn')

    deleteButton.addEventListener('click', () => {
      this.frequencies[index][1] = 0
      this.table.removeChild(row)

      if (this.frequencies.filter(([freq, intensity]) => intensity > 0).length === 0) this.frequencies = []

      this.onChange()
    })

    const td = (e: HTMLElement) => {
      const td = document.createElement('td')
      td.appendChild(e)
      return td
    }

    row.appendChild(td(frequencyInput))
    row.appendChild(td(intensityInput))
    row.appendChild(td(deleteButton))

    this.table.appendChild(row)
    this.elements.push(row)

    this.onChange()
  }

  public onChange() {
    this.intensityGraph.intensities = this.frequencies
    this.polarGraph.windingFreq = round(this.slider.advancement, 2)
    this.intensityGraph.updateValues()
    this.polarGraph.updateValues()
    this.fourierGraph.updateValues()
  }
}
