import { render } from 'preact'
import { useState } from 'preact/hooks'

function PopupApp() {
  const [count, setCount] = useState(0)

  return <div>It works!</div>
}

render(<PopupApp />, document.getElementById('root') as HTMLElement)
