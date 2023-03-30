import { Settings } from './settings'

let handled = ''
export default function main() {
  console.log('FP Max Loaded')
  chrome.storage.sync.get(
    ['saveInterval', 'lastPlayed', 'useTimestamps', 'returnToLastTime'],
    ({ useTimestamps, returnToLastTime }: Settings) => {
      // mutation observer to detect when the video is loaded
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (returnToLastTime) {
            handleLastPlayed()
          }
          if (useTimestamps) {
            const el = mutation.target as HTMLElement
            if (el.matches('.comment-body')) {
              handleCommentTimestamps(el)
            }
            if (el.querySelector('.comment-body')) {
              const children = el.querySelectorAll('.comment-body')!
              for (const child of children) {
                handleCommentTimestamps(child as HTMLElement)
              }
            }
          }
        })
      })
      if (returnToLastTime) {
        waitUntil(() => document.querySelector('.video-js video') !== null, handleLastPlayed)
      }
      observer.observe(document.body, { attributes: true, childList: true, subtree: true })
    },
  )
}

main()

function handleLastPlayed() {
  if (handled === document.location.pathname) return
  const vidCont = document.querySelector('.video-js')
  const vid = vidCont?.querySelector('video')

  if (vid && vid.duration && vid.currentTime !== undefined) {
    handled = document.location.pathname
    const vidId = getVideoId()
    chrome.storage.sync.get([`lastPlayed-${vidId}`, 'saveInterval'], (result) => {
      const lastPlayed = result[`lastPlayed-${vidId}`]
      const saveInterval = result['saveInterval'] ?? 5000

      if (lastPlayed) {
        vid.currentTime = lastPlayed
        // vid.play() // FIXME doesn't work
      }

      setInterval(lastPlayedUpdateCallback(vid, vidId), saveInterval)
    })
  } else {
    handled = ''
  }
}

function lastPlayedUpdateCallback(vid: HTMLVideoElement, vidId: string): () => void {
  return () => {
    if (vid.paused) return
    const key = `lastPlayed-${vidId}`
    chrome.storage.sync.get([key], (result) => {
      if (Math.floor(result[key]) === Math.floor(vid.currentTime)) return
      if (vid.currentTime >= vid.duration - 10) {
        chrome.storage.sync.remove([key])
        return
      }
      chrome.storage.sync.set({
        [`lastPlayed-${vidId}`]: vid.currentTime,
      })
    })
  }
}

function getVideoId() {
  return window.location.pathname.split('/')[2]
}

function handleCommentTimestamps(commentBody: HTMLElement) {
  const body = commentBody.querySelector('p')!
  if (commentBody.dataset.fpMax) return
  const content = body.textContent!
  const TIME_REGEX = /(\d+):(\d+)(:\d+)?/g
  const matchesTime = content.match(TIME_REGEX)
  if (!matchesTime) return

  const newContent = content.replace(TIME_REGEX, (match, hrs, mns, scs) => {
    if (scs) {
      scs = scs.slice(1)
    } else {
      scs = mns
      mns = hrs
      hrs = '0'
    }
    const time = parseInt(hrs) * 3600 + parseInt(mns) * 60 + parseInt(scs)
    return `<a class="timestamp" data-time="${time}" href="#t=${time}">${match}</a>`
  })
  commentBody.dataset.fpMax = 'true'
  body.innerHTML = newContent
  const tms = Array.from(body.querySelectorAll('.timestamp')) as HTMLAnchorElement[]
  tms.forEach((i) => {
    i.addEventListener('click', (e) => {
      e.preventDefault()
      const time = parseInt(i.dataset.time!)
      const vidCont = document.querySelector('.video-js')
      const vid = vidCont?.querySelector('video')
      if (vid) {
        vid.currentTime = time
        // vid.play()
      }
    })
  })
}

function waitUntil(cond: () => boolean, cb: () => void) {
  if (cond()) {
    cb()
    return
  }
  setTimeout(() => waitUntil(cond, cb), 100)
}
