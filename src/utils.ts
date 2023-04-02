import { LogLevel, Settings } from './settings'

export function waitUntil(cond: () => boolean, cb: () => void, timeout: number = 10000) {
  let startTime = Date.now()
  if (cond()) {
    cb()
    return
  }
  setTimeout(() => waitUntil(cond, cb, timeout - (Date.now() - startTime)), 100)
}

export function objectKeys<T>(obj: T): (keyof T)[] {
  return Object.keys(obj as object) as (keyof T)[]
}

type Entry<T> = [keyof T, T[keyof T]]

export function objectEntries<T>(obj: T): Entry<T>[] {
  return Object.entries(obj as object) as Entry<T>[]
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out: Partial<Pick<T, K>> = {}
  for (const key of keys) {
    out[key] = obj[key]
  }
  return out as Pick<T, K>
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const out: Partial<T> = {}
  for (const key of objectKeys(obj) as K[]) {
    if (keys.includes(key)) continue
    out[key] = obj[key]
  }
  return out as Omit<T, K>
}

let visibleLogLevel: LogLevel | null = LogLevel.info

export function setLogLevel(level: LogLevel | null | undefined) {
  visibleLogLevel = level || null
}

export function log(level: LogLevel, ...args: any[]) {
  const logLevelOrder = [LogLevel.debug, LogLevel.info, LogLevel.warn, LogLevel.error] as const
  if (
    visibleLogLevel === null ||
    logLevelOrder.indexOf(level) < logLevelOrder.indexOf(visibleLogLevel)
  )
    return
  console[level](`[${formatDate(new Date())}]`, '[fp_max]', ...args)
}

export function formatDate(date: Date) {
  return date.toISOString().replace(/T/, ' ').replace(/Z/, '')
}

export function debugLog(...args: any[]) {
  log(LogLevel.debug, ...args)
}

export function infoLog(...args: any[]) {
  log(LogLevel.info, ...args)
}

export function warnLog(...args: any[]) {
  log(LogLevel.warn, ...args)
}

export function errorLog(...args: any[]) {
  log(LogLevel.error, ...args)
}

export function getSettings<T extends Partial<Settings>, K extends keyof T>(
  keysOrObject: T,
): Promise<T>
export function getSettings<T extends Partial<Settings>, K extends keyof T>(
  keysOrObject: T | K[],
): Promise<Pick<T, K>> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keysOrObject, (results) => {
      resolve(results as Pick<T, K>)
    })
  })
}
