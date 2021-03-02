import { FC } from 'react'
import { Canvas } from 'react-three-fiber'

export interface IntensityGraphProps {
  frequencies: [number, number][]
}

export const IntensityGraph: FC<IntensityGraphProps> = ({ frequencies }) => {
  return (
    <Canvas>
      <ambientLight />
      <bufferGeometry />
    </Canvas>
  )
}

export default IntensityGraph
