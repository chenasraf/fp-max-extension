import { render } from 'preact'
import { useEffect, useState } from 'preact/hooks'

function OptionsApp() {
  const [returnToLastTime, setReturnToLastTime] = useState(true)
  const [saveInterval, setSaveInterval] = useState(5)
  const [useTimestamps, setUseTimestamps] = useState(true)

  useEffect(() => {
    chrome.storage.sync.get(
      {
        returnToLastTime: false,
        saveInterval: 5,
      },
      (items) => {
        setReturnToLastTime(items.returnToLastTime)
        setSaveInterval(items.saveInterval)
      },
    )
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ returnToLastTime })
  }, [returnToLastTime])
  useEffect(() => {
    chrome.storage.sync.set({ saveInterval })
  }, [saveInterval])

  return (
    <>
      <div>
        <label>
          <input
            type="checkbox"
            checked={returnToLastTime}
            onChange={(e) => setReturnToLastTime((e.target as HTMLInputElement).checked)}
          />{' '}
          Return to last played time when returning to a video
        </label>
      </div>
      <div>
        <label disabled={!returnToLastTime}>
          How often to save the current time:
          <select
            value={saveInterval}
            onChange={(e) => setSaveInterval(parseInt((e.target as HTMLSelectElement).value))}
          >
            <option value={1000}>1 Second</option>
            <option value={3000}>3 Seconds</option>
            <option value={5000}>5 Seconds</option>
            <option value={10000}>10 Seconds</option>
            <option value={15000}>15 Seconds</option>
            <option value={30000}>30 Seconds</option>
            <option value={60000}>1 Minute</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={useTimestamps}
            onChange={(e) => setUseTimestamps((e.target as HTMLInputElement).checked)}
          />{' '}
          Allow clicking timestamps in the comments to jump to video time
        </label>
      </div>
    </>
  )
}

render(<OptionsApp />, document.getElementById('root') as HTMLElement)
