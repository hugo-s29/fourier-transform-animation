import Color from './colors'
import { Display } from './display'
import { Group } from './entity'
import FourierGraph from './fourierGraph'
import FrequencyEditor from './frequencyEditor'
import { Rectangle } from './geometry'
import IntensityGraph from './intensityGraph'
import Label from './label'
import PolarGraph from './polarGraph'
import TimeSlider from './timeSlider'
import { round } from './util'

import '@fortawesome/fontawesome-free/js/all'

const display = new Display()

const controlBox = document.createElement('div')
controlBox.classList.add('control-box')
document.body.appendChild(controlBox)

const intensityGraph = new IntensityGraph([[2, 1]]).translate([0, 2])

const polarGraph = new PolarGraph(intensityGraph).scale(0.8).translate([-6.5, -2])
const fourierGraph = new FourierGraph(intensityGraph).translate([2.8, -4])
const slider = new TimeSlider(controlBox)
const cyclesGroup = new Group().scale([1, -1]).translate([0, -0.5])
const frequencyEditor = new FrequencyEditor(controlBox, slider, intensityGraph, polarGraph, fourierGraph)

slider.controls.appendChild(frequencyEditor.addButton)

const cyclesLabel = new Label('').scale(0.7).translate([-9.75, 0]).mathFont()
const backgroundCyclesRectangle = new Rectangle(4.9, 1.2)
  .setStroke('none', 0)
  .setFill('black')
  .setOpacity(0.5)
  .translate([-5.19, 0.25])

cyclesGroup.add(backgroundCyclesRectangle)
cyclesGroup.add(cyclesLabel)

display.add(intensityGraph)
display.add(polarGraph)
display.add(fourierGraph)
display.add(cyclesGroup)

function animation(dt: number) {
  if (slider.running) {
    slider.advance(dt)
  }

  if (slider.running) {
    polarGraph.windingFreq = round(slider.advancement, 2)
    polarGraph.updateValues()

    cyclesLabel.changeText(`${slider.advancement.toFixed(2)} cycles/second`)

    fourierGraph.moveDot(polarGraph.windingFreq * 1.78)
  }

  // intensityGraph.updateBars(polarGraph.windingFreq * 2)

  if (polarGraph.windingFreq * 2 >= FourierGraph.ticksCountX * 2 && slider.running) {
    slider.pause()
  }
}

display.animate(animation)
