export interface Settings {
  lastPlayedMap?: Record<string, number>
  completionPercentMap?: Record<string, number>
  saveInterval?: number
  returnToLastTime?: boolean
  useTimestamps?: boolean
  completedPercent?: number
  showCompletion?: boolean
  logLevel?: LogLevel
}

export const defaultSettings: Required<Settings> = {
  saveInterval: 5000,
  lastPlayedMap: {},
  completionPercentMap: {},
  useTimestamps: true,
  returnToLastTime: true,
  completedPercent: 95,
  showCompletion: true,
  logLevel: 'info',
}

export const LogLevel = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
} as const

export type LogLevel = typeof LogLevel[keyof typeof LogLevel]
