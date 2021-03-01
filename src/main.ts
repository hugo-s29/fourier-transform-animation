import { Display } from './display'
import FourierGraph from './fourierGraph'
import IntensityGraph from './intensityGraph'
import PolarGraph from './polarGraph'
import TimeSlider from './timeSlider'

const display = new Display()

const intensityGraph = new IntensityGraph([2, 1]).translate([0, 2])
const polarGraph = new PolarGraph(intensityGraph).scale(0.8).translate([-6.5, -2])
const fourierGraph = new FourierGraph(intensityGraph).translate([2.8, -4])
const slider = new TimeSlider()

display.add(intensityGraph)
display.add(polarGraph)
display.add(fourierGraph)

function animation(dt: number) {
  if (slider.running) {
    slider.advance(dt)
  }

  polarGraph.windingFreq = slider.advancement
  polarGraph.updateValues()

  fourierGraph.moveDot(polarGraph.windingFreq * 2)
  // intensityGraph.updateBars(polarGraph.windingFreq * 2)

  if (polarGraph.windingFreq * 2 >= FourierGraph.ticksCountX * 2 && slider.running) {
    slider.pause()
  }
}

display.animate(animation)
