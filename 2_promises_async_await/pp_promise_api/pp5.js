function timeoutPromise(promise, ms){
  let timed = new Promise((_, reject) => {
    setTimeout(() => reject('Operation timed out.'), ms)
  })
  return Promise.race([promise, timed]);
}

function loadData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("Data loaded");
      } else {
        reject("Network error");
      }
    }, 1000);
  });
}

timeoutPromise(loadData(), 500)
  .then(console.log)
  .catch(console.error);
// Expected output: "Operation timed out" (because it exceeds 500ms)