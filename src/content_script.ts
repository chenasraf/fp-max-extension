let handled = false
export default function main() {
  console.log('FP Max Loaded')
  console.log('DOMContentLoaded')

  // mutation observer to detect when the video is loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const el = mutation.target as HTMLElement
      if (el.matches('.comment-body')) {
        console.debug('comment-body', el)
        handleCommentTimestamps(el)
      }
      if (el.querySelector('.comment-body')) {
        const children = el.querySelectorAll('.comment-body')!
        console.debug('comment-body', children)
        for (const child of children) {
          handleCommentTimestamps(child as HTMLElement)
        }
      }
      handleLastPlayed()
    })
  })
  observer.observe(document.body, { attributes: true, childList: true, subtree: true })
}

main()

function handleLastPlayed() {
  if (handled) return
  const vidCont = document.querySelector('.video-js')
  const vid = vidCont?.querySelector('video')

  if (vid && vid.duration && vid.currentTime !== undefined) {
    handled = true
    const vidId = getVideoId()
    chrome.storage.sync.get([`lastPlayed-${vidId}`, 'saveInterval'], (result) => {
      const lastPlayed = result[`lastPlayed-${vidId}`]
      const saveInterval = result['saveInterval'] ?? 5000

      if (lastPlayed) {
        vid.currentTime = lastPlayed
        vid.play() // FIXME doesn't work
      }

      setInterval(lastPlayedUpdateCallback(vid, vidId), saveInterval)
    })
  }
}

function lastPlayedUpdateCallback(vid: HTMLVideoElement, vidId: string): () => void {
  return () => {
    if (vid.paused) return
    const key = `lastPlayed-${vidId}`
    chrome.storage.sync.get([key], (result) => {
      if (Math.floor(result[key]) === Math.floor(vid.currentTime)) return
      console.debug({
        duration: vid.duration,
        currentTime: vid.currentTime,
      })
      console.debug('setting:', {
        [key]: vid.currentTime,
      })
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
  console.debug('content', content)
  console.debug('matchesHrs', matchesTime)
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
        vid.play()
      }
    })
  })
}
