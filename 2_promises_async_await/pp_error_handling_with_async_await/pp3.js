async function retryOperation(operationFunc) {
  let attempts = 0;

  async function attempt() {
    try {
      let res = await operationFunc()
      return res
    } catch (e) {
      if (attempts < 2) {
        attempts += 1
        console.log(`Retry attempt #${attempts}`);
        return attempt()
      } else {
        throw e;
      }
    }

  }

  try {
    console.log(await attempt())
  } catch (e) {
    console.error('Operation failed')
  }

}

retryOperation(flakyService)