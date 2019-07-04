/* eslint-disable prefer-rest-params, no-var */
function inObject(value) {
  var OBJECT_FUNCTIONS = [
    Object.assign,
    Object.getOwnPropertyDescriptor,
    Object.getOwnPropertyDescriptors,
    Object.getOwnPropertyNames,
    Object.getOwnPropertySymbols,
    Object.is,
    Object.preventExtensions,
    Object.seal,
    Object.create,
    Object.defineProperties,
    Object.defineProperty,
    Object.freeze,
    Object.getPrototypeOf,
    Object.setPrototypeOf,
    Object.isExtensible,
    Object.isFrozen,
    Object.isSealed,
    Object.keys,
    Object.entries,
    Object.values,
    Object.fromEntries,
  ];

  for (var i = 0; i < OBJECT_FUNCTIONS.length; i++) {
    if (OBJECT_FUNCTIONS[i] === value) return true;
  }
  return false;
}

function globalDeleter(object, propertyName) {
  return isProxy(object) ? object.deleteProperty(propertyName) : delete object[propertyName];
}

function globalGetter(object, propertyName) {
  var value;
  if (isProxy(object)) {
    value = object.get(propertyName);
  } else {
    value = object[propertyName];
  }
  if (typeof value === 'function' && inObject(value)) {
    return function() {
      arguments[0] = objectTarget(arguments[0]);

      return value.apply(Object, arguments);
    };
  }
  return value;
}

function globalSetter(object, propertyName, value) {
  if (isProxy(object)) {
    return object.set(propertyName, value);
  }
  object[propertyName] = value;
  return value;
}

function isProxy(object) {
  return object.constructor && object.constructor.name === 'Proxy';
}

function objectTarget(object) {
  return isProxy(object) ? object.target : object;
}

function Proxy(target, handlers = {}) { // eslint-disable-line no-unused-vars
  this.target = target;
  this.get = function(property) {
    return (handlers.get || globalGetter)(target, property);
  };

  this.set = function(property, value) {
    return (handlers.set || globalSetter)(target, property, value);
  };

  this.deleteProperty = function(property) {
    return (handlers.deleteProperty || globalDeleter)(target, property);
  };
}

/* eslint-enable prefer-rest-params, no-var */
