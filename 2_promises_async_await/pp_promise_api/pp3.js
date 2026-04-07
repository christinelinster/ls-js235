function flakyService() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve("Operation successful");
    } else {
      reject("Operation failed");
    }
  });
}



const services = [flakyService(), flakyService(), flakyService()];
Promise.allSettled(services)
  .then(results => results.forEach(r => console.log(r)))