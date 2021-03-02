import React, { FC, useEffect, useState } from 'react'
import { Canvas, extend } from 'react-three-fiber'
import { Vector3 } from 'three'
import { Axis, Graph } from './graph'
import { map } from './util'

// import { OrbitControls } from '@react-three/drei'
//@ts-ignore
import ThreeMeshUI from 'three-mesh-ui'

extend(ThreeMeshUI)

export interface IntensityGraphProps {
  frequencies: [number, number][]
}

export const IntensityGraphWidth = 1600
export const IntensityGraphHeight = 400

export const IntensityGraphDrawingWidth = 1400
export const IntensityGraphDrawingHeight = 250

function generatePoints(frequencies: IntensityGraphProps['frequencies']) {
  if (frequencies.length === 0) return []

  const points: Vector3[] = []
  const ys: number[] = []

  for (let x = 0; x <= 4.25; x += 0.01) {
    let y = 0

    for (const [frequency, intensity] of frequencies) y += ((Math.cos(frequency * x * Math.PI) + 1) * intensity) / 2

    ys.push(y)
  }

  const maxY = Math.max(...ys)
  let i = 0
  for (let x = 0; x <= 4.25; x += 0.01) {
    const px = map(x, 0, 4.25, -IntensityGraphDrawingWidth / 2, IntensityGraphDrawingWidth / 2)
    const y = ys[i]
    const py = map(y, 0, maxY, -IntensityGraphDrawingHeight / 2, IntensityGraphDrawingHeight / 2)

    points.push(new Vector3(px, py, 0))
    i++
  }

  return points
}

const xAxisLabels = [0, 1, 2, 3, 4]

export const IntensityGraph: FC<IntensityGraphProps> = ({ frequencies }) => {
  const [points, setPoints] = useState<Vector3[]>([])

  useEffect(() => {
    setPoints(generatePoints(frequencies))
  }, [frequencies])

  return (
    <Canvas orthographic style={{ width: IntensityGraphWidth, height: IntensityGraphHeight }} camera={{}}>
      <color attach="background" args={[0, 0, 0]} />
      <Graph points={points} />
      <Axis
        ticksLabel={xAxisLabels}
        ticksPos={xAxisLabels.map(
          (num) => new Vector3(map(num, 0, 4.25, -IntensityGraphDrawingWidth / 2, IntensityGraphDrawingWidth / 2), 0, 0)
        )}
      />
    </Canvas>
  )
}

export default IntensityGraph
