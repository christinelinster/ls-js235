function delayLog() {
  for (let i = 1; i < 11; i += 1) {
    setTimeout(() => { console.log(i) }, i * 1000)
  }
}

delayLog();