export function subset<T, U>(classType: new () => T, object: U): T {
  const obj = <T>{};
  Object.keys(new classType()).forEach(key => obj[key] = object[key]);

  return obj;
}
