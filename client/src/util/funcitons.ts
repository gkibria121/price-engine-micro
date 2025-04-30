export async function wait(s: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(s);
    }, s * 1000);
  });
}
