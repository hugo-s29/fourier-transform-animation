import React, { FC } from 'react'
import ReactDOM from 'react-dom'

export const App: FC = () => (
  <>
    <h1>Hello World</h1>
  </>
)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
