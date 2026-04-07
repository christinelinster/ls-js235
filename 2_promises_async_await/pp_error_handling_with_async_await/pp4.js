async function loadData() {
  try {
    let result = await new Promise((resolve, reject) => {
      setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("Data loaded");
      } else {
        reject("Network error");
      }
    }, 1000);
    })
    return result
  } catch(err) {
    console.error("An error occurred. Attempting to recover...");
    return 'Using cached data'
  }
}

async function processData(){
  console.log(await loadData())
}

processData();
// Logs "Data loaded" or "Using cached data"