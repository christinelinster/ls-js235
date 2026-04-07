console.log('Starting...')
let greet = setInterval(() => console.log('Hello'), 2000)
setTimeout(() => {
  clearInterval(greet)
  console.log('Goodbye!')
}, 10000)