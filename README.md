# babel-plugin-es5-proxy
Babel plugin to use ES6 Proxy in ES5. Inspired by the work of https://github.com/krzkaczor/babel-plugin-proxy, fixed for babel7.

The plugin has 100% behaviour coverage.
## How it works
Everytime a property is accessed or set on an object, it is replaced by a function call to respectively `globalGetter` or `globalSetter` which either accesses or set the original property or calls the getter or setter in the Proxy. 
## Example
The following code
```javascript
let obj = {};
obj.foo = 5;
obj.foo;
```
becomes
```javascript
let obj = {};
globalSetter(obj, 'foo', 5);
globalGetter(obj, 'foo');
```
The plugin supports any expression in the getter and the setter,
```javascript
let obj = {};
let bar = 'fo';
obj[bar + 'o'] = 5;
obj.foo;
```
becomes
```javascript
let obj = {};
let bar = 'fo';
globalSetter(obj, bar + 'fo', 5);
globalGetter(obj, 'foo');
```
When a proxy with a getter is defined, the call goes through the getter
```javascript
let obj = new Proxy({}, { get(property) { return 4 } })
obj.foo // 4
```
The interface is identical to es6 Proxies.

