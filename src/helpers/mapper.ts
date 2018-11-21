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

