export function waitUntil(cond: () => boolean, cb: () => void) {
  if (cond()) {
    cb()
    return
  }
  setTimeout(() => waitUntil(cond, cb), 100)
}
