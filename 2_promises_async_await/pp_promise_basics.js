// PP1: bakeCookies

function washLaundry() {
  console.log("Putting clothes in wash.");
  console.log("Adding soap.");

  console.log("Washing laundry...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Buzz!");
      resolve();
    }, 5000)
  })
}

function bakeCookies() {
  console.log("Mixing ingredients.");
  console.log("Scooping cookie dough.");
  console.log("Putting cookies in oven.");

  console.log('Baking...')
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('Beep!')
      resolve()
    }, 3000)
  })
};



function doChores() {
  washLaundry().then(() => {
    console.log("Folding Laundry.");
    console.log("Putting away Laundry.");
  })

  bakeCookies().then(() => {
    console.log("Cooling cookies.");
    console.log("Eating cookies.");
  });
}

// PP3: downloadFile

function downloadFilePromise() {
  return new Promise(resolve => {
    console.log('Downloading file...')
    setTimeout(() => {
      resolve('Download complete!')
    }, 1500)
  })
}

// PP4: processData

function processDataPromise(numbers, process) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(numbers.map(process))
    }, 1000)
  })
}

// Example usage:
processDataPromise([1, 2, 3], (number) => number * 2).then((processedNumbers) => {
  console.log(processedNumbers);
  // After 1 second, logs: [2, 4, 6]
});