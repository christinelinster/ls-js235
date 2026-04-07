function flakyService() {
  return new Promise((resolve, reject) => {
    if (Math.random() > 0.5) {
      resolve("Operation successful");
    } else {
      reject("Operation failed");
    }
  });
}

async function useFlakyService(){
  try{
    let data = await flakyService();
    console.log(data)
  } catch (e) {
    console.error(e)
  }
}

useFlakyService()