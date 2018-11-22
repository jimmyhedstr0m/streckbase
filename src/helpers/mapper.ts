/*
  Generic Mapper used to map one class to another.
  Example:

  class A {
    id: number = 1;
    random: string = "hello";
  }

  class B {
    id: number = null;
    text: string = null;
  }
  
  const destination: B = new Mapper(A, B)
    .createMap(new A())
    .forMember((source: A) => {
      text: source.random
    })
    .map();

  console.log(destination); // logs: B { id: 1, text: hello }

  The mapper will automatically map equal keys. In this case key "id",
  as it appears in both classes.

  The .forMember method is used to map one key to another. In this case we
  map the value of key "random" to key "text". The result of the mapping
  process will be a new instance of B with the values from A.
  However, if non-matchin properties aren't manually mapped in .forMember
  method, it will cause properties in destination class B to have null values
  for non-matching keys.
*/

export class Mapper<T, U> {
  private mapped: Partial<U> = {};
  private source: T;

  constructor(_sourceType: new () => T, private destinationType: new () => U) { }

  createMap(source: T): Mapper<T, U> {
    this.source = source;
    return this;
  }

  forMember(fn: (source: T) => Partial<U>): Mapper<T, U> {
    this.mapped = fn(this.source);
    return this;
  }

  map(): U {
    const destination: U = new this.destinationType();
    const sourceKeys = Object.keys(this.source) as Array<keyof T>;
    for (const key of sourceKeys) {
      if (Object(destination).hasOwnProperty(key)) {
        destination[<any>key] = this.source[key];
      }
    }

    const mappedKeys = Object.keys(this.mapped) as Array<keyof Partial<U>>;
    for (const key of mappedKeys) {
      if (Object(destination).hasOwnProperty(key)) {
        destination[<any>key] = this.mapped[key];
      } else {
        throw (`Property '${key}' does not exist on type ${typeof this.destinationType}`);
      }
    }

    this.mapped = {};
    this.source = null;
    return destination;
  }
}
