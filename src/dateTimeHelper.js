const convertTimeToMinutes = function (time) {
  time = time.replaceAll('-', '')
  return Number(time.split(':')[1]) + Number(time.split(':')[0]) * 60
}

const convertMinutesToTime = function (minutes) {
  let timeHours = Math.floor(minutes / 60).toString()
  timeHours = (timeHours.length === 1 ? '0' : '') + timeHours
  let timeMinutes = (minutes % 60).toString()
  timeMinutes = timeMinutes + (timeMinutes.length === 1 ? '0' : '')
  return `${timeHours}:${timeMinutes}`
}
export { convertMinutesToTime, convertTimeToMinutes }
