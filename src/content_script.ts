let handled = false
export default function main() {
  console.log('FP Max Loaded')

  console.log('DOMContentLoaded')

  // mutation observer to detect when the video is loaded
  const observer = new MutationObserver((mutations) => {
    console.debug('observer fired')
    mutations.forEach((mutation) => {
      // console.debug('mutation', mutation)
      const vidCont = document.querySelector('.video-js')
      const vid = vidCont?.querySelector('video')
      // console.debug('vidCont', vidCont)
      // console.debug('vid', vid)

      if (!handled && vid && vid.duration && vid.currentTime !== undefined) {
        console.debug({
          duration: vid.duration,
          currentTime: vid.currentTime,
        })
        handled = true
        const vidId = window.location.pathname.split('/')[2]
        console.debug('vidId', vidId)
        chrome.storage.sync.get([`lastPlayed-${vidId}`], (result) => {
          const lastPlayed = result[`lastPlayed-${vidId}`]

          console.debug('lastPlayed', vidId, lastPlayed ?? result)
          if (lastPlayed !== undefined) {
            vid.currentTime = lastPlayed
            vid.play()
          }

          setInterval(() => {
            console.debug({
              duration: vid.duration,
              currentTime: vid.currentTime,
            })
            console.debug('setting:', {
              [`lastPlayed-${vidId}`]: vid.currentTime,
            })
            chrome.storage.sync.set({
              [`lastPlayed-${vidId}`]: vid.currentTime,
            })
          }, 5000)
        })
      }
    })
  })
  observer.observe(document.body, { attributes: true, childList: true, subtree: true })
}

main()
