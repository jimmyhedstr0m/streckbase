export function subset<T, U>(classType: new () => T, object: U): T {
  const obj = <T>{};
  Object.keys(new classType()).forEach(key => obj[key] = object[key]);

  return obj;
}

export function toCamel(obj) {
  var newO;
  var origKey;
  var newKey;
  var value;

  if (obj instanceof Array) {
    return obj.map((value) => {
      if (typeof value === "object") {
        value = toCamel(value);
      }

      return value;
    });
  } else {
    newO = {};

    for (origKey in obj) {
      if (obj.hasOwnProperty(origKey)) {
        newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
        value = obj[origKey];

        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = toCamel(value);
        }

        newO[newKey] = value;
      }
    }
  }

  return newO;
}