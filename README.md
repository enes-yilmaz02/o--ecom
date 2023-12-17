# EcomPrimeng

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



Readme for Configuration Module
This module handles the configuration of the application using the dotenv package. It loads environment variables from a .env file and exports a configuration object.

#Installation
To use this configuration module, you need to install the dotenv package. Run the following command:

bash

`npm install dotenv`

#Configuration
The configuration module loads the following environment variables from the .env file:

PORT: The port on which the server will run.
HOST: The host address or IP on which the server will bind.
HOST_URL: The URL of the host.
API_KEY: Firebase API key.
AUTH_DOMAIN: Firebase authentication domain.
DATABASE_URL: Firebase database URL.
PROJECT_ID: Firebase project ID.
STORAGE_BUCKET: Firebase storage bucket.
MESSAGING_SENDER_ID: Firebase messaging sender ID.
APP_ID: Firebase application ID.
