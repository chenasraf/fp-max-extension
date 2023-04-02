import { lastPlayedFeature, showCompletionFeature, timestampsFeature } from './fp_features'
import { Settings, defaultSettings } from './settings'
import { debugLog, getSettings, infoLog, pick, setLogLevel, waitUntil } from './utils'

export default async function main() {
  const settings = pick(defaultSettings, [
    'useTimestamps',
    'showCompletion',
    'returnToLastTime',
    'logLevel',
  ])
  const { useTimestamps, showCompletion, returnToLastTime, logLevel } = await getSettings(settings)
  setLogLevel(logLevel)
  infoLog('FP Max Loaded', { useTimestamps, showCompletion, returnToLastTime, logLevel })
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (returnToLastTime || showCompletion) {
        lastPlayedFeature(mutation.target as HTMLElement)
      }
      if (useTimestamps) {
        timestampsFeature(mutation.target as HTMLElement)
      }
      if (showCompletion) {
        showCompletionFeature(mutation.target as HTMLElement)
      }
    })
    if (returnToLastTime) {
      waitUntil(
        () => document.querySelector('.video-js video') !== null,
        () => lastPlayedFeature(document.body),
      )
    }
    if (showCompletion) {
      waitUntil(
        () => document.querySelector('.PostTileWrapper') !== null,
        () => showCompletionFeature(document.body),
      )
    }
  })
  observer.observe(document.body, { attributes: true, childList: true, subtree: true })
}

main()
