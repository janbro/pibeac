# Backend Documentation

## Deployment
The github repo is hooked into Travis CI which runs automated tests whenever a push to a branch is made. When changes are merged to master and the all tests pass, the app will be deployed to heroku at https://beam-hub-backend.herokuapp.com/. 

## Testing Locally
To run the server locally, clone the repository and run `npm install` and then `npm start`. Run `npm run dev` instead of `npm start` to have the server automatically restart on file changes. To run automated tests, run `npm test`.

## API
GET `/api/beacons` - returns all beacons