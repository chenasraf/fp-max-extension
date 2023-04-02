import { Settings, defaultSettings } from './settings'
import { getSettings, infoLog, objectEntries, objectKeys } from './utils'

chrome.runtime.onInstalled.addListener(async () => {
  infoLog('Extension installed!')

  const settings = await getSettings(defaultSettings)
  const out: Partial<Settings> = {}
  for (const entry of objectEntries(defaultSettings)) {
    const [key, value] = entry
    if (settings[key] === undefined) {
      out[key] = value as never
    }
  }
  infoLog('Filling missing settings:', out)
  chrome.storage.sync.set(settings)

  // remove old keys - 31 Mar 2023
  chrome.storage.sync.remove(['lastPlayed'])
})

export {}
