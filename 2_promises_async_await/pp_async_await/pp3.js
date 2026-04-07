

function brushTeeth(){
  return new Promise(resolve => {
    console.log('Brushing my teeth')
    setTimeout(resolve, 5000)
  })
}

function workout(){
  return new Promise(resolve => {
    console.log('Working out...')
    setTimeout(resolve, 2000)
  })
}

async function getReady(){
  await brushTeeth()
  await workout()
  console.log('All ready!')


}

getReady()