export function time() {
  return (new Date()).getTime()/1000;
}

export const delay = time => new Promise(resolve => {
  setTimeout(async () => {
    return resolve();
  }, time);
});
