import { useState } from 'preact/hooks'

export function PopupHome() {
  const [count, setCount] = useState(0)
  return <div onClick={() => setCount((x) => x + 1)}>Clicked {count} times</div>
}
