chrome.runtime.onInstalled.addListener(async () => {
  console.log('Extension installed!')
  chrome.storage.sync.set({
    saveInterval: 5000,
    lastPlayed: {},
    useTimestamps: true,
    returnToLastTime: true,
  })
})

export {}
