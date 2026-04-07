
function operation() {
  return new Promise((resolve) => {
    console.log("Operation started");
    setTimeout(() => {
      resolve("Operation complete");
    }, 1000);
  });
}

async function operate() {
  try {
    let res = await operation()
    console.log(res)
  } finally {
    console.log('cleaning up resources')
  }
}