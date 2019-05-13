
const delayedMethods: string[] = [
  'getProfile',
  'follow',
  'like',
  'getUserByUsername',
  'getUserIdPhotos',
  'getMediaByShortcode',
];

export default function makeHummableRequestProxy(obj) {
  return new Proxy(obj, {
    get: function(target, prop: string) {
      if (delayedMethods.includes(prop)) {
        console.log(prop);
        return wrapper(obj, target[prop], 3000);
      }
      return target[prop];
    }
  })
}

function wrapper (obj, func, time: number) {
  return function () {
    const args = arguments;
    return new Promise(resolve => {
      delay(time).then(async function () {
        resolve(await func.apply(obj, args));
      });
    });
  }
}

const delay = time => new Promise(resolve => {
  setTimeout(async () => {
    return resolve();
  }, time);
});

