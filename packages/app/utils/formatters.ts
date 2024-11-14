export const formatDistance = (distance: number): string => {
  return `${distance.toFixed(2)} mi`
}

export const formatPace = (pace: string): string => {
  const paceNum = parseFloat(pace)
  const minutes = Math.floor(paceNum)
  const seconds = Math.round((paceNum - minutes) * 60)

  return seconds === 0
    ? `${minutes}min/mi`
    : `${minutes}:${seconds.toString().padStart(2, '0')}min/mi`
}

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours, 10)
  const period = hour >= 12 ? 'pm' : 'am'
  const formattedHour = hour % 12 || 12
  return `${formattedHour}${minutes !== '00' ? ':' + minutes : ''}${period}`
}

export const formatDate = (date: Date, format: 'short' | 'long' = 'long'): string => {
  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}
