import { FC, useRef } from 'react'
//@ts-ignore
import * as meshline from 'threejs-meshline'
import { Font, Mesh, Vector3 } from 'three'
import { extend } from 'react-three-fiber'
import fontData from './fontData'

extend(meshline)

export interface GraphProps {
  points: Vector3[]
}

export const Graph: FC<GraphProps> = ({ points }) => {
  const mesh = useRef<Mesh>()

  return (
    <mesh ref={mesh}>
      {/*@ts-ignore*/}
      <meshLine attach="geometry" vertices={points} />
      {/*@ts-ignore*/}
      <meshLineMaterial color="red" lineWidth={4} />
    </mesh>
  )
}

const font = new Font(fontData)

export interface TickProps {
  pos: Vector3
  label: string
}

export const Tick: FC<TickProps> = ({ pos, label }) => {
  // const mesh = useRef<Mesh>()
  const w = 10

  return (
    <>
      <mesh position={pos} rotation={[0, 0, Math.PI / 2]}>
        {/*@ts-ignore*/}
        <meshLine attach="geometry" vertices={[new Vector3(-w, 0, 0), new Vector3(w, 0, 0)]} />
        {/*@ts-ignore*/}
        <meshLineMaterial color="white" lineWidth={4} />
      </mesh>
      <mesh position={pos.sub(new Vector3(0.25, 0.25, 0))} scale={[0.25, 0.25, 0.001]}>
        <textGeometry
          attach="geometry"
          args={[
            label,
            {
              font,
            },
          ]}
        />
        <meshBasicMaterial attach="material" color="white" />
      </mesh>
    </>
  )
}

export interface AxisProps {
  ticksLabel: (string | number)[]
  ticksPos: Vector3[]
}

export const Axis: FC<AxisProps> = ({ ticksLabel, ticksPos }) => {
  console.assert(ticksLabel.length === ticksPos.length, 'Ticks labels and positions arrays must have the same length')

  return (
    <>
      {ticksLabel.map((label, index) => (
        <Tick pos={ticksPos[index]} label={label.toString()} key={label} />
      ))}
    </>
  )
}
