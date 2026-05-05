export default function formatDate(timestamp: string): string {
  const formatted = new Date(timestamp).toLocaleString()
  const date = formatted.split(',')[0]

  const day = date.split('/')[0]
  const month = date.split('/')[1]
  const year = date.split('/')[2]
  let daySuffix;
  let monthArray = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  if (day === '1' || day === '21' || day === '31') daySuffix = 'st'
  else if (day === '2' || day === '22') daySuffix = 'nd'
  else if (day === '3' || day === '23') daySuffix = 'rd'
  else daySuffix = 'th'
  
  return `${day}${daySuffix} ${monthArray[Number(month) - 1]} ${year}`
}