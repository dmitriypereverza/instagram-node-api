export default function makeHummableRequestProxy(obj) {
  return obj;
}

function delay () {
  return new Promise(function (resolve) {
    setTimeout(function() {
        resolve()
      }, 3000);
  })
}


