import React, { FC, useState } from 'react'
import ReactDOM from 'react-dom'
import IntensityGraph from './intensityGraph'

export const App: FC = () => {
  // eslint-disable-next-line
  const [frequencies, setFrequences] = useState<[number, number][]>([
    [2, 1],
    [3, 1],
  ])

  return (
    <>
      <IntensityGraph frequencies={frequencies} />
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
