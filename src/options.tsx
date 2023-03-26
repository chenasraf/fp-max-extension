import { render } from 'preact'
import { useState } from 'preact/hooks'

function OptionsApp() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>It works!</div>
    </>
  )
}

render(<OptionsApp />, document.getElementById('root') as HTMLElement)
