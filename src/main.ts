import { Display } from './display'
import FourierGraph from './fourierGraph'
import { Circle } from './geometry'
import IntensityGraph from './intensityGraph'
import PolarGraph from './polarGraph'
import { round } from './util'

const display = new Display()

const intensityGraph = new IntensityGraph([2, 1]).translate([0, 2])
const polarGraph = new PolarGraph(intensityGraph).scale(0.8).translate([-6.5, -2])
const fourierGraph = new FourierGraph(intensityGraph).translate([2.8, -4])

display.add(intensityGraph)
display.add(polarGraph)
display.add(fourierGraph)

function animation(dt: number) {
  polarGraph.windingFreq += round(0.0001 * dt, 3)
  polarGraph.updateValues()

  fourierGraph.moveDot(polarGraph.windingFreq * 2)
  // intensityGraph.updateBars(polarGraph.windingFreq * 2)

  if (polarGraph.windingFreq * 2 >= FourierGraph.ticksCountX * 1.9) {
    display.animating = false
  }
}

display.animate(animation)

//@ts-ignore
window.stop = () => (display.animating = false)
