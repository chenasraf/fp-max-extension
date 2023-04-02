import clsx from 'clsx'
import { ComponentChild, createContext } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { LogLevel, defaultSettings } from '../settings'

export interface SettingsProps {
  mode: 'popup' | 'options'
}

export const ModeContext = createContext<'popup' | 'options'>('popup')

export function SettingsPage(props: SettingsProps) {
  const { mode } = props
  const [loading, setLoading] = useState(true)
  const [returnToLastTime, setReturnToLastTime] = useState(true)
  const [saveInterval, setSaveInterval] = useState(5)
  const [useTimestamps, setUseTimestamps] = useState(true)
  const [completedPercent, setCompletedPercent] = useState(95)
  const [showCompletion, setShowCompletion] = useState(true)
  const [logLevel, setLogLevel] = useState<LogLevel | null>('info')

  useEffect(() => {
    chrome.storage.sync.get(defaultSettings, (items) => {
      setReturnToLastTime(items.returnToLastTime)
      setSaveInterval(items.saveInterval)
      setUseTimestamps(items.useTimestamps)
      setCompletedPercent(items.completedPercent)
      setShowCompletion(items.showCompletion)
      setLogLevel(items.logLevel)
      setLoading(false)
    })
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
  useEffect(() => {
    chrome.storage.sync.set({ logLevel })
  }, [logLevel])

  return (
    <ModeContext.Provider value={mode}>
      <div className={'min-w-[350px] max-w-xl w-full mx-auto p-4'}>
        <h1
          className={clsx('', {
            'text-4xl my-6': mode === 'options',
            'text-2xl mb-6': mode === 'popup',
          })}
        >
          FP Max Options
        </h1>
        <SettingRow
          checked={returnToLastTime}
          onCheckboxChange={(e) => setReturnToLastTime((e.target as HTMLInputElement).checked)}
          label="Use Last Played Time"
          helpText="When enabled, the video will start from the last time you watched it. Otherwise, it will start from the beginning."
        />
        <SettingRow
          label="Completion Time"
          helpText="When video is played to this percentage, it will be marked as completed, the progress will remain
        full but the last saved time will be reset."
        >
          <div className={'flex items-center gap-2'}>
            <div className="flex-grow">
              <input
                className="w-full"
                type="range"
                min={50}
                max={100}
                value={completedPercent}
                step={5}
                onInput={(e) => setCompletedPercent(parseInt((e.target as HTMLInputElement).value))}
              />
            </div>
            <span>{completedPercent}%</span>
          </div>
        </SettingRow>
        <hr className="my-2" />
        <SettingRow
          checked={showCompletion}
          onCheckboxChange={(e) => setShowCompletion((e.target as HTMLInputElement).checked)}
          label="Show Progress Bar"
          helpText="When enabled, the video's progress will be shown as a blue bar at the bottom of thumbnails."
        />
        <hr className="my-2" />
        <SettingRow
          label="Use Timestamp Links"
          helpText="When enabled, comment timestamps will be converted to links that will jump to the time in the video."
          checked={useTimestamps}
          onCheckboxChange={(e) => setUseTimestamps((e.target as HTMLInputElement).checked)}
        />
        <hr className="my-2" />
        <SettingRow
          label="Save time interval"
          disabled={!returnToLastTime && !showCompletion}
          helpText={
            <>
              This determines how often the current time is saved.
              <br />A lower interval will save the current time more often, but will use
              ever-so-slightly more CPU & network (as the settings are synced to your browser's
              cloud storage). This is only used if either "Use Last Played Time" or "Show Progress
              Bar" are enabled.
            </>
          }
        >
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
        </SettingRow>
        <hr className="my-2" />
        <SettingRow
          label="Log level"
          disabled={!returnToLastTime && !showCompletion}
          helpText="Determines how much information is logged to the developer console. Default is 'Info'."
        >
          <select
            className="border border-gray-300 rounded-md px-2 py-1"
            value={logLevel || ''}
            onChange={(e) =>
              setLogLevel(((e.target as HTMLSelectElement).value || null) as LogLevel | null)
            }
          >
            <option value="">None (disabled)</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
        </SettingRow>

        {mode === 'options' ? (
          <>
            <hr className="my-2" />
            <div className="text-base">
              <p className="py-1">
                <a
                  className="text-base text-primary"
                  href="https://github.com/chenasraf/fp-max-extension"
                  target="_blank"
                  rel="noreferrer"
                >
                  View Source Code on GitHub
                </a>
              </p>
              <p className="py-1">
                <a
                  className="text-base text-primary"
                  href="https://github.com/chenasraf/fp-max-extension/issues"
                  target="_blank"
                  rel="noreferrer"
                >
                  Bug reports, feature requests, and other issues
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
            </div>
          </>
        ) : null}
      </div>
    </ModeContext.Provider>
  )
}

function SettingRow(props: {
  children?: preact.ComponentChildren
  disabled?: boolean
  checked?: boolean
  onCheckboxChange?(e: Event): void
  label: ComponentChild
  helpText: ComponentChild
}) {
  const { children, checked, onCheckboxChange, helpText, label, disabled = false } = props

  return (
    <ModeContext.Consumer>
      {(mode) => (
        <div
          className={clsx('my-4 text-base', {
            'pointer-events-none opacity-50': disabled,
          })}
        >
          <label className={clsx('flex items-center gap-2')}>
            {onCheckboxChange ? (
              <input
                className="self-start mt-1"
                type="checkbox"
                checked={checked}
                onChange={onCheckboxChange}
              />
            ) : (
              <div className="basis-[13px] min-w-[13px] self-start" />
            )}
            <div className="w-full">
              <div
                className={clsx({
                  flex: children,
                  'gap-2': children && mode === 'popup',
                  'gap-4 items-center': children && mode === 'options',
                  'flex-col justify-stretch': mode === 'popup',
                })}
              >
                <span className={clsx({ 'font-bold': mode === 'options' })}>{label}</span>
                {children ? <div className="flex-grow">{children}</div> : null}
              </div>
              {mode === 'options' ? <p className="text-sm mt-1">{helpText}</p> : null}
            </div>
          </label>
        </div>
      )}
    </ModeContext.Consumer>
  )
}

export default SettingsPage
