// PP1: flakyService
function flakyService() {
  let randNum = Math.random();
  return new Promise((resolve, reject) => {
    if (randNum > 0.5) {
      resolve('Operation successful')
    } else {
      reject('Operation failed')
    }
  })
}

// flakyService()
//   .then(console.log)
//   .catch(console.error);

// ------------------------------------------------------

// PP2: cleanup
function operation() {
  return new Promise((resolve => {
    console.log('Operation started')
    setTimeout(() => {
      resolve('Operation complete')
    }, 1000)
  }))
}

// operation()
//   .then(console.log)
//   .finally(() => {
//     console.log('Cleaning up resources')
//   })

// ------------------------------------------------------

// PP3: Promise Chaining

// Promise.resolve(5)
//   .then((num) => num * 2)
//   .then((num) => num + 5)
//   .then(console.log)

// PP4: fetchUserData

function fetchUserData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject({ error: "User not found" }), 500);
  });
}

// fetchUserData()
//   .catch((err) => console.log(err.error))
//   .finally(() => console.log('Fetching complete'))

// ------------------------------------------------------

// PP5: retryOperation

function retryOperation(operationFunc) {
  let retries = 0;
  function attempt() {
    return operationFunc()
      .then(console.log)
      .catch(err => {
        if (retries < 2) {
          retries += 1
          console.log(`Retry attempty #${retries}`)
          return attempt();
        } else {
          throw err;
        }
      })
  }

  return attempt().catch(() => console.error('Operation failed.'))

}
// Example usage:
// retryOperation(
//   () =>
//     new Promise((resolve, reject) =>
//       Math.random() > 0.33
//         ? resolve("Success!")
//         : reject(new Error("Fail!"))
//     )
// );

// ------------------------------------------------------

// PP6: mockAsyncOp

function mockAsyncOp() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("Operation succeeded");
      } else {
        reject("Operation failed");
      }
    }, 1000);
  });
}

// mockAsyncOp()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => console.log('Operated attempted'))

// ------------------------------------------------------

// PP7: loadData

function loadData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve('Data loaded')
      } else {
        reject('Network error')
      }
    })
  }, 1000)
  .catch((err) => {
    console.error(`A ${err} occured. Attempting to recover...`)
    return Promise.resolve('Using cached data')
  })
}

// loadData()
//   .then(console.log)
