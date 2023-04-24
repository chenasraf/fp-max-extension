import { debugLog, infoLog } from './utils'

let handled = ''
export function timestampsFeature(target: HTMLElement) {
  if (target.matches('.comment-body')) {
    handleCommentTimestamps(target)
  }
  if (target.querySelector('.comment-body')) {
    const children = target.querySelectorAll('.comment-body')!
    for (const child of children) {
      handleCommentTimestamps(child as HTMLElement)
    }
  }
}

export function lastPlayedFeature(target: HTMLElement) {
  if (
    !target.matches('.video-js') ||
    !target.querySelector('.video-js video') ||
    handled === document.location.pathname
  )
    return
  const vidCont = document.querySelector('.video-js')
  const vid = vidCont?.querySelector('video')
  debugLog('lastPlayedFeature video:', vid, vid?.duration, vid?.currentTime)

  if (vid && vid.duration && vid.currentTime !== undefined) {
    handled = document.location.pathname
    const vidId = getVideoId()
    const vidKey = `lastPlayedMap.${vidId}`
    chrome.storage.sync.get(
      [vidKey, 'saveInterval', 'returnToLastTime'],
      ({ returnToLastTime, saveInterval = 5000, ...result }) => {
        const lastPlayed = result[vidKey]
        infoLog('lastPlayed', vidId, lastPlayed)

        if (returnToLastTime && lastPlayed) {
          vid.currentTime = lastPlayed
          infoLog('Loading saved time:', vidId, lastPlayed)
          updatePostDateProgress(lastPlayed / vid.duration)
          // vid.play() // FIXME doesn't work
        }

        setInterval(lastPlayedUpdateCallback(vid, vidId), saveInterval)
      },
    )
  } else {
    handled = ''
  }
}

function updatePostDateProgress(progress: number) {
  const postDate = document.querySelector('.post-date')

  let postDateProgress: HTMLElement | undefined

  if (!postDate?.querySelector('.fp-max-post-date-progress')) {
    postDateProgress = document.createElement('span')
    postDateProgress.classList.add('fp-max-post-date-progress')
    postDate?.appendChild(postDateProgress)
  } else {
    postDateProgress = postDate.querySelector('.fp-max-post-date-progress') as HTMLElement
  }

  postDateProgress.innerHTML = ` &bull; Watched ${Intl.NumberFormat(undefined, {
    style: 'percent',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(progress)}`
}

export function showCompletionFeature(target: HTMLElement) {
  if (target.matches('.PostTileWrapper')) {
    handleShowCompletion(target)
  }
  if (target.querySelector('.PostTileWrapper')) {
    const children = target.querySelectorAll('.PostTileWrapper')!
    for (const child of children) {
      handleShowCompletion(child as HTMLElement)
    }
  }
}

function lastPlayedUpdateCallback(vid: HTMLVideoElement, vidId: string): () => void {
  return () => {
    if (vid.paused) return
    const vidKey = `lastPlayedMap.${vidId}`
    const vidCompletionKey = `completionPercentMap.${vidId}`
    chrome.storage.sync.get(
      [vidKey, 'completedPercent'],
      ({ completedPercent = 95, showCompletion = true, ...result }) => {
        if (Math.floor(result[vidKey]) === Math.floor(vid.currentTime)) return
        if (vid.currentTime / vid.duration >= completedPercent / 100) {
          debugLog('Video completed:', vidId)
          chrome.storage.sync.remove([vidKey])
          chrome.storage.sync.set({ [vidCompletionKey]: 1 })
          return
        }
        infoLog('Saving last played:', vidId, vid.currentTime)
        chrome.storage.sync.set({
          [vidKey]: vid.currentTime,
          [vidCompletionKey]: vid.currentTime / vid.duration,
        })
        if (showCompletion) {
          updatePostDateProgress(vid.currentTime / vid.duration)
        }
      },
    )
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
  if (!matchesTime) {
    debugLog('No timestamps found', content)
    return
  }

  debugLog('Found timestamps:', matchesTime, content)

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

function handleShowCompletion(target: HTMLElement) {
  if (target.querySelector('.progress') || target.dataset.fpMax) return
  const vidId = (target.querySelector('a') as HTMLAnchorElement).href.split('/').slice(-1)[0]
  const vidCompletionKey = `completionPercentMap.${vidId}`
  chrome.storage.sync.get([vidCompletionKey], (result) => {
    if (target.querySelector('.progress') || target.dataset.fpMax) return
    debugLog('Checking completion', vidId, result[vidCompletionKey])
    if (!result[vidCompletionKey]) return
    const progress = document.createElement('div')
    progress.classList.add('progress')
    progress.style.position = 'absolute'
    progress.style.bottom = '0'
    progress.style.left = '0'
    progress.style.height = '5px'
    progress.style.background = '#0085ff' // from FP theme
    progress.style.width = Math.min(result[vidCompletionKey], 1) * 100 + '%'
    progress.style.zIndex = '1'

    const thumb = target.querySelector('.PostTileThumbnail') as HTMLDivElement
    thumb.appendChild(progress)
    debugLog('Added progress bar', vidId, target, progress)
    target.dataset.fpMax = 'true'
  })
}
