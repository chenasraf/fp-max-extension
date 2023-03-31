import { Settings } from './settings'

chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed!')
  chrome.storage.sync.set({
    saveInterval: 5000,
    lastPlayedMap: {},
    completionPercentMap: {},
    useTimestamps: true,
    returnToLastTime: true,
    completedPercent: 95,
  } as Required<Settings>)

  // remove old keys - 31 Mar 2023
  chrome.storage.sync.remove(['lastPlayed'])
})

export {}
