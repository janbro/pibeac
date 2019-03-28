# Frontend Documentation

## Documentation

[https://janbro.github.io/pibeac/](https://janbro.github.io/pibeac/)

## Deployment
The github repo is hooked into Travis CI which runs automated tests whenever a push to a branch is made. When changes are merged to master and the all tests pass, the app will be deployed to heroku at https://pibeac.herokuapp.com/. 

## Development
Change [config.ts](./src/app/helpers/config.ts) to point to `https://localhost:8080/api`

Development:

`npm run devbuild`

Production:

`npm run build`

Build Documentation Locally:

`npm run compodoc`

Serve Documentation Locally:

`npm run servedocs`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
