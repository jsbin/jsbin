Session secrets in jsbin
========================

If you see a warning message when runnign jsbin `Warning: Generating a session key` it means that you have not configured a session secret in your config.local.json or ENV. 
If you want your sessions to persist between reboots you'll need to use the same one. JSBin will generate a random 34 char
key for you, you can choose to use this or one of your own.

```json
  {
    "session": {
      "secret": "bfksfysa7e32kdhayu292sz" // session secret
    }
  }
```
