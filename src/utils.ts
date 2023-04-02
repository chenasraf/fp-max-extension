export function waitUntil(cond: () => boolean, cb: () => void) {
  if (cond()) {
    cb()
    return
  }
  setTimeout(() => waitUntil(cond, cb), 100)
}

export function objectKeys<T>(obj: T): (keyof T)[] {
  return Object.keys(obj as object) as (keyof T)[]
}

type Entry<T> = [keyof T, T[keyof T]]

export function objectEntries<T>(obj: T): Entry<T>[] {
  return Object.entries(obj as object) as Entry<T>[]
}
