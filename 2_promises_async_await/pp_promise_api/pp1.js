function flakyService() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve("Operation successful");
    } else {
      reject("Operation failed");
    }
  });
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

let service1 = flakyService();
let service2 = flakyService();
let data1 = loadData();

Promise.all([service1, service2, data1])
  .then(console.log)
  .catch(() => console.error('One or more operations failed.'))