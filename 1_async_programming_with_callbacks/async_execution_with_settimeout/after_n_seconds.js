function afterNSeconds(func, seconds) {
  return setTimeout(func(), seconds * 1000)
}