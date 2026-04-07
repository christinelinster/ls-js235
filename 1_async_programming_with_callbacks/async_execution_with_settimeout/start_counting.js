function startCounting() {
  let count = 0;

  let id = setInterval(() => {
    count += 1;
    console.log(count)
  }, 1000)
  return id
}
let counting = startCounting();

function stopCounting(){
  clearInterval(counting)
}