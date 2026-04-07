async function asyncDownloadFilePromise() {
  console.log('Downloading file...')
  let downloaded = await new Promise(resolve => {
    setTimeout(() => {
      resolve('Download complete!')
    }, 1500)
  })
  console.log(downloaded)
}

function downloadFilePromise() {
  return new Promise(resolve => {
    console.log('Downloading file...')
    setTimeout(() => {
      resolve('Download complete!')
    }, 1500)
  })
}