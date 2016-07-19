# EmailService

When requiring the email module you'll get an instance of EmailService returned to you.

This object has two methods `createEmail` and `sendEmail`

## `createEmail`

create Email returns an instance of Email.

You can either pass two strings, a single object or a string and an object:

### Two `String`s
```js
  createEmail('to@mail.com', 'body-content');
```

### `String` and `Object`
```js
createEmail('to@mail.com', {
  body: 'body',
  text: 'body',
  subject: 'optional subject line'
});
```

### Single `Object`
```js
createEmail({
  to: 'to@mail.com',
  from: 'optionalFrom@mail.com',
  body: 'body',
  subject: 'optional subject line'
});
```

## `sendEmail`

This function returns a promise, which you can use to check for the success or error of the email being sent.
This function takes an object which you can create yourself but it is reccomended that you pass it the return
value of a call to `createEmail`

# Email

The email object can be passed into `EmailService#sendEmail` but can also be sent via it's own method

## `send`

The send method can be called with no arguments and the email will be sent to the to value of the data passed to it.

Optionally it can be called with a single argument, this argument will override any internal data and send the email
to that address.

```js
var email = emailService.createEmail('to@something.com', 'hello world');
email.send(); // will send to to@something.com
email.send('other@something.com'); // will send to other@something.com
```
