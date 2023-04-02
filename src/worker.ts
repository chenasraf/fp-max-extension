import { Settings } from './settings'
import { objectEntries, objectKeys } from './utils'

const defaultSettings = {
  saveInterval: 5000,
  lastPlayedMap: {},
  completionPercentMap: {},
  useTimestamps: true,
  returnToLastTime: true,
  completedPercent: 95,
} as Required<Settings>
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed!')

  chrome.storage.sync.get(objectKeys(defaultSettings), (settings) => {
    const out: Partial<Settings> = {}
    for (const entry of objectEntries(defaultSettings)) {
      const [key, value] = entry
      if (settings[key] === undefined) {
        out[key] = value as never
      }
    }
    console.log('Filling missing settings:', out)
    chrome.storage.sync.set(settings)
  })

  // remove old keys - 31 Mar 2023
  chrome.storage.sync.remove(['lastPlayed'])
})

export {}
