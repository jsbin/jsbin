# Account Logic

## Log in

Requires:

- username
- password
- no email address sent
- not logged in

    1. If username doesn't exist
      - ERROR: username doesn't exist
    2. Else
      2.1 If account hasn't been updated
        2.1.1 If sha1(password) matches
          - update password with bcrypt
          - save bcrypt value
        2.1.2 Else
          - ERROR: password doesn't match (old style)

      2.2 If bcrypt version of password matches
        2.2.1 If redirected from account update
          - SUCCESS: update email and update session
        2.2.2 Else
          - SUCCESS: successful log in. Update login time and set session
      2.3 Else if redirected from registration logic
        - ERORR: username taken
      2.4 Else // also covers account update route
        - ERROR: password doesn't match

## Registration logic

Requires:

- username
- password
- email address
- not logged in

    3. If username exists
      - Proceed with login logic (2)
    4. If username does not exist
      - SUCCESS: save details and login

## Account update logic

Requires:

- username
- password
- email address
- user is logged in

    5. If username exists
      - Proceed with login logic (2)
    6. If username does not exist
      - update username
      - find old saved bins based on logged in username and update to new username
      - update session









