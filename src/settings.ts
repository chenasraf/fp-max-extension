export interface Settings {
  lastPlayedMap?: Record<string, number>
  completionPercentMap?: Record<string, number>
  saveInterval?: number
  returnToLastTime?: boolean
  useTimestamps?: boolean
  completedPercent?: number
  showCompletion?: boolean
}
