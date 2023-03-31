import clsx from 'clsx'
import { render } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Settings } from '../settings'

export interface SettingsProps {
  mode: 'popup' | 'options'
}

export function SettingsPage(props: SettingsProps) {
  const { mode } = props
  const [returnToLastTime, setReturnToLastTime] = useState(true)
  const [saveInterval, setSaveInterval] = useState(5)
  const [useTimestamps, setUseTimestamps] = useState(true)
  const [completedPercent, setCompletedPercent] = useState(95)
  const [showCompletion, setShowCompletion] = useState(true)

  useEffect(() => {
    chrome.storage.sync.get(
      {
        returnToLastTime: false,
        saveInterval: 5,
        useTimestamps: true,
        completedPercent: 95,
        showCompletion: true,
      } as Settings,
      (items) => {
        setReturnToLastTime(items.returnToLastTime)
        setSaveInterval(items.saveInterval)
        setUseTimestamps(items.useTimestamps)
        setCompletedPercent(items.completedPercent)
        setShowCompletion(items.showCompletion)
      },
    )
  }, [])

  useEffect(() => {
    chrome.storage.sync.set({ returnToLastTime })
  }, [returnToLastTime])
  useEffect(() => {
    chrome.storage.sync.set({ saveInterval })
  }, [saveInterval])
  useEffect(() => {
    chrome.storage.sync.set({ useTimestamps })
  }, [useTimestamps])
  useEffect(() => {
    chrome.storage.sync.set({ completedPercent })
  }, [completedPercent])
  useEffect(() => {
    chrome.storage.sync.set({ showCompletion })
  }, [showCompletion])

  return (
    <div className={'min-w-[350px] max-w-xl w-full mx-auto p-4'}>
      <h1
        className={clsx('', {
          'text-4xl my-6': mode === 'options',
          'text-2xl mb-6': mode === 'popup',
        })}
      >
        FP Max Options
      </h1>
      <SettingRow>
        <label className="text-base">
          <input
            type="checkbox"
            checked={returnToLastTime}
            onChange={(e) => setReturnToLastTime((e.target as HTMLInputElement).checked)}
          />{' '}
          Return to last played time when returning to a video
        </label>
      </SettingRow>
      <SettingRow>
        <label className="text-base">
          Time to mark as completed
          <br />
          <div className="flex items-center">
            <input
              type="range"
              min={50}
              max={100}
              value={completedPercent}
              step={5}
              onInput={(e) => setCompletedPercent(parseInt((e.target as HTMLInputElement).value))}
            />
            <span>{completedPercent}%</span>
          </div>
          <p className="text-sm">
            When video is played to this percentage, it will be marked as completed.
          </p>
        </label>
      </SettingRow>
      <SettingRow>
        <label className="text-base">
          <input
            type="checkbox"
            checked={showCompletion}
            onChange={(e) => setShowCompletion((e.target as HTMLInputElement).checked)}
          />{' '}
          Show progress bar on video thumbnails
        </label>
      </SettingRow>
      <SettingRow>
        <label
          className={clsx('text-base transition-all', {
            'pointer-events-none opacity-50': !returnToLastTime,
          })}
        >
          How often to save the current time:{' '}
          <select
            className="border border-gray-300 rounded-md px-2 py-1"
            value={saveInterval}
            onChange={(e) => setSaveInterval(parseInt((e.target as HTMLSelectElement).value))}
            disabled={!returnToLastTime}
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
      </SettingRow>
      <hr className="my-2" />
      <SettingRow>
        <label className="text-base">
          <input
            type="checkbox"
            checked={useTimestamps}
            onChange={(e) => setUseTimestamps((e.target as HTMLInputElement).checked)}
          />{' '}
          Allow clicking timestamps in the comments to jump to video time
        </label>
      </SettingRow>
      {mode === 'options' ? (
        <>
          <hr className="my-2" />
          <SettingRow>
            <p className="py-2">
              <a
                className="text-base text-primary"
                href="https://github.com/chenasraf/fp-max-extension"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            </p>

            <p className="py-2">
              <span className="text-sm">
                Copyright &copy; 2023{' '}
                <a
                  className="text-base text-primary"
                  href="https://casraf.dev"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chen Asraf
                </a>
              </span>
            </p>
          </SettingRow>
        </>
      ) : null}
    </div>
  )
}

function SettingRow(props: { children: preact.ComponentChildren }) {
  const { children } = props
  return <div className="my-4 text-base">{children}</div>
}

export default SettingsPage
