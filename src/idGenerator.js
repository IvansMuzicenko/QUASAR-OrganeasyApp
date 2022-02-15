const symbols = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const id = function (customLength) {
  let length = customLength || 30
  let result = ''

  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * 62)
    result += symbols[randIndex]
  }
  return result
}
export default id
