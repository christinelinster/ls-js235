//  PP1: basicCallback

function basicCallback(cb, n){
  setTimeout(() => {cb(n)},  2000)
}

// PP2: downloadFile

function downloadFile(cb){
  console.log('Downloading file...')
  setTimeout(() => cb('Download complete!'), 1500)
}

// PP3: processData

function processData(nums, cb) {
  setTimeout(() => {
    const processedNums = nums.map(cb);
    console.log(processedNums)
  }, 1000)
}

// PP4: waterfallOverCallbacks

function waterfallOverCallbacks(arr, initial) {
  arr.forEach(f => {
    initial = f(initial)

  })
  console.log(initial)
}

// PP5: startCounter

function startCounter(cb) {
  let counter = 0;
  let repeat = setInterval(() => {
    counter += 1
    if (cb(counter)) {
      clearInterval(repeat)
    }
  }, 1000)
}

startCounter((count) => {
  console.log(count);
  return count === 5;
});