async function processNTimes(numbers, callback, n) {
  for (let i = 0; i < n; i++) {
    numbers = await processDataPromise(numbers, callback)
  }

  console.log(numbers)

}

function processDataPromise(numbers, process) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(numbers.map(process))
    }, 1000)
  })
}

// Example usage:
const squareIt = (n) => n * n;
processNTimes([1, 2, 3], squareIt, 3);
// After 3 seconds, logs: [1, 256, 6561]

