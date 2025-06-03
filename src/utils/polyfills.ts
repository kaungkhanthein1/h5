// Polyfill for Object.hasOwn() for older browsers (iOS 15 and older)
if (!Object.hasOwn) {
  Object.hasOwn = function(obj: any, prop: string | number | symbol): boolean {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

export {}; 