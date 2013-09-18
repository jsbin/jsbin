Github Authentication
=====================

JS Bin allows users to sign in using their GitHub account. To enable this
feature for either local development or production use you need to create a
GitHub application and add the provided settings to your `config.local.json`.

1. Visit https://github.com/settings/applications and click the "Register new
   application" button.

2. Enter details for your app, the callback url will be your JS Bin host with
   the callback path. For example:

   ```
   http://localhost:3000/auth/github/callback
   ```

3. This will then give you a client id and secret which you can add to your
   `config.local.json`:

   ``` json
   "github": {
     "id": "GITHUB_CLIENT_ID",
     "secret": "GITHUB_CLIENT_ID"
   }
   ```

JS Bin detects this setting file and automatically sets up the GitHub sign in.
