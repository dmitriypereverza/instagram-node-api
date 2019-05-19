
const delayedMethods: string[] = [
  'follow',
  'getUserByUsername',
  'getUserIdPhotos',
  'getMediaByShortcode',
];

export default function makeHummableRequestProxy(obj, delayInSeconds) {
  return new Proxy(obj, {
    get: function(target, prop: string) {
      if (delayedMethods.includes(prop)) {
        console.log(prop);
        return wrapper(obj, target[prop], delayInSeconds * 1000);
      }
      return target[prop];
    }
  })
}

function wrapper (obj, func, time: number) {
  return function () {
    const args = arguments;
    return new Promise((resolve, reject) => {
      delay(time).then(async function () {
        try {
          const result = await func.apply(obj, args);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

const delay = time => new Promise(resolve => {
  setTimeout(async () => {
    return resolve();
  }, time);
});

