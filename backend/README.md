# Backend Documentation

## Deployment
The github repo is hooked into Travis CI which runs automated tests whenever a push to a branch is made. When changes are merged to master and the all tests pass, the app will be deployed to heroku at https://pibeac.herokuapp.com/. 

## Development
First, make sure that you have `key.pem` and `cert.pem` files. You can generate them using this command:

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`

Then create a private key to sign jwt user tokens

`export TOKEN_SIG=private_key`

Finally create the file `secrets.json` with mongodb credentials

```
{
    "MONGO_CREDENTIALS": "USER:PASSWORD"
}
```

`npm run start`

## Testing Locally
To run the server locally, clone the repository and run `npm install` and then `npm start`. Run `npm run dev` instead of `npm start` to have the server automatically restart on file changes. To run automated tests, run `npm test`.

## API
### [BeaconRouter](./routes/beacon-api.routes.js)

GET `/api/beacons` - returns all beacons

PATCH `/api/beacons/:id` - updates beacon with pass
ed data

### [UserRouter](./routes/user.routes.js)

GET `/api/users` - returns all users

GET `/api/users/:id` - returns user

PUT `/api/users` - updates user

DELETE `/api/users` - deletes user

POST `/api/register` - registers user

POST `/api/login` - returns jwt credentials token

GET `/api/logout` - deletes jwt token and redirects to home

POST `/api/authenticate` - checks the user has a valid jwt token
