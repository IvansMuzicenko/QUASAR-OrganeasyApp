const symbols = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const generateId = function (length = 32) {
  let result = ''

  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * 62)
    result += symbols[randIndex]
  }
  return result
}
export default generateId
