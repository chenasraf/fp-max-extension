import { lastPlayedFeature, timestampsFeature } from './fp_features'
import { Settings } from './settings'
import { waitUntil } from './utils'

export default function main() {
  console.log('FP Max Loaded')
  chrome.storage.sync.get(
    ['saveInterval', 'lastPlayed', 'useTimestamps', 'returnToLastTime'] as (keyof Settings)[],
    ({ useTimestamps, returnToLastTime }: Settings) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (returnToLastTime) {
            lastPlayedFeature(mutation.target as HTMLElement)
          }
          if (useTimestamps) {
            timestampsFeature(mutation.target as HTMLElement)
          }
        })
      })
      if (returnToLastTime) {
        waitUntil(
          () => document.querySelector('.video-js video') !== null,
          () => lastPlayedFeature(document.body),
        )
      }
      observer.observe(document.body, { attributes: true, childList: true, subtree: true })
    },
  )
}

main()
