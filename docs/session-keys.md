Session secrets in jsbin
========================

If you see this warning message when running jsbin, you'll want to set up a session secret.
```text
Warning: Generating a session key
``` 
It means that you have not configured a session secret in your config.local.json or ENV. 
If you want your sessions to persist between reboots you'll need to use the same one. JS Bin will generate a random 34 char
key for you, you can choose to use this or one of your own. Just place it into your config.local.json (in the root of the project) like so:

```json
  {
    "session": {
      "secret": "bfksfysa7e32kdhayu292sz"
    }
  }
```
