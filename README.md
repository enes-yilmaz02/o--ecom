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



## Readme for Configuration Module

This module handles the configuration of the application using the dotenv package. It loads environment variables from a .env file and exports a configuration object.

#Installation
To use this configuration module, you need to install the dotenv package. Run the following command:

bash

`npm install dotenv`

#### Configuration

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

## Readme for Firebase Initialization Module

This module initializes the Firebase Admin SDK using the firebase-admin package and the configuration provided in the config.js file.

Installation
To use this Firebase initialization module, you need to install the firebase-admin package. Run the following command:

bash

`npm install firebase-admin`

#### Configuration

The module uses the config.js file for Firebase configuration. Ensure that the config.js file is correctly set up with the required Firebase credentials. Refer to the Firebase documentation for details on obtaining Firebase credentials.

## Readme for Express Application
This repository contains an Express.js application with Google Cloud Storage integration and Google OAuth authentication using Passport.

#### Prerequisites
Before running the application, make sure you have the following installed:

#### Node.js
npm (Node Package Manager)

Google Cloud Storage credentials (for file upload/download)

Google OAuth client credentials (for authentication)

#### Installation

Clone the repository:

git clone <repository-url>

cd <repository-directory>

Install dependencies:

bash

`npm install`

Set up environment variables:

Create a .env file in the project root and add the following variables:

#### env

PORT=3000

HOST=http://localhost

STORAGE_BUCKET='<your-storage-bucket-name>'

GOOGLE_CLIENT_ID='<your-google-client-id>'

GOOGLE_CLIENT_SECRET='<your-google-client-secret>'

SESSION_SECRET='mysecret'

Update the values with your actual configurations.


#### Run the application:

bash

`npm start`

The application will be available at http://localhost:3000.

#### Features

File Upload and Download:

Upload a file using the /upload endpoint.
Download a file using the /files/:filename endpoint.
Google OAuth Authentication:

Access the Google authentication page at /auth/google.

Callback after authentication is handled at /auth/google/callback.

Successful authentication redirects to http://localhost:4200/pages.

Failed authentication redirects to http://localhost:4200/notfound.

#### Session Management:

The application uses Express session middleware for session management.

Session secret is set to mysecret.

Role Assignment:

Upon successful authentication, the user role is assigned.
If the role is not available, it defaults to 'USER'.

#### Usage
File Upload:

Use the /upload endpoint to upload a file.
File Download:

Access the file using the /files/:filename endpoint.
Google Authentication:

Visit /auth/google to initiate Google OAuth authentication.
User Home:

After successful authentication, access the home page at /.
Logout:

Logout by accessing the /auth/logout endpoint.





## Passport Configuration for Google OAuth
This file configures Passport.js to use Google OAuth2. It uses the passport-google-oauth2 strategy for authentication.

#### Installation
Before using this configuration, make sure to install the necessary dependencies:

bash

`npm install passport passport-google-oauth20 dotenv`

#### Configuration
This configuration assumes that you have registered your application with the Google Developer Console and obtained the clientID and clientSecret.

Create a .env file in the project root:

#### env

GOOGLE_CLIENT_ID='<your-client-id>'

GOOGLE_CLIENT_SECRET='<your-client-secret>'

Update the values with your actual Google OAuth credentials.

Configure the Passport strategy in the provided file (e.g., passport-config.js):

#### javascript

`const passport = require('passport');`

`const GoogleStrategy = require('passport-google-oauth20').Strategy;`

`require('dotenv').config();`

`passport.use(new GoogleStrategy({`

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    passReqToCallback: true
  },

  `function(request, accessToken, refreshToken, profile, done) {`

    done(null, profile);

 ` }));`

`passport.serializeUser((user, done) => {`

    done(null, user);

`});`

`passport.deserializeUser((user, done) => {`

    done(null, user);

`});`

`module.exports = passport;`



Integrate this Passport configuration into your main application file (e.g., app.js or index.js):

#### javascript

`const express = require('express');`

`const passport = require('./path-to-passport-config-file');`

`const app = express();`

// ... Other configurations ...

// Initialize Passport and restore authentication state, if any, from the session.
`app.use(passport.initialize());`
`app.use(passport.session());`

// ... Other routes and middleware ...

// Start the server
`const PORT = process.env.PORT || 8080;
`
`app.listen(PORT, () => {`

    console.log(`Server is running on http://localhost:${PORT}`);

`});`

Ensure that your routes and callbacks are correctly set up to handle authentication.

Feel free to customize the configuration based on your application's requirements. If you have any specific needs or additional functionalities, adjust the code accordingly.

## API Routes Overview
The API routes are organized into different modules to handle user-related operations, orders, favorites, carts, and email sending functionality. Here's a brief overview of each route and its corresponding functionality:

#### User Routes (/users)

POST /users: Adds a new user.

POST /users-admin: Adds a new admin user.

GET /users: Retrieves all users.

GET /users/:userId: Retrieves a user by ID.

GET /users/email/:email: Retrieves a user by email.

PUT /users/:userId: Updates user information.

PUT /users/:userId/password: Updates user password.

DELETE /users/:userId: Deletes a user.

#### Order Routes (/orders)

POST /orders: Adds a new order.

POST /users/:userId/orders: Adds a new order for a specific user.

GET /users/:userId/orders: Retrieves all orders for a user.

GET /users/:userId/orders/:orderId: Retrieves an order by user and order ID.

PUT /users/:userId/orders/:orderId: Updates order information.

DELETE /users/:userId/orders/:orderId: Deletes an order.

#### Favorite Routes (/favorites)

POST /users/:userId/favorites/:favoriteId: Adds a new favorite product for a user.

GET /users/:userId/favorites: Retrieves all favorite products for a user.

GET /users/:userId/favorites/:favoriteId: Retrieves a favorite product by ID.

DELETE /users/:userId/favorites/:favoriteId: Deletes a favorite product.

DELETE /users/:userId/favorites/product/:productId: Deletes a favorite product by product ID.

PUT /users/:userId/favorites/:favoriteId: Updates favorite product information.

#### Cart Routes (/carts)

POST /users/:userId/carts/:cartId: Adds a new product to the user's cart.

GET /users/:userId/carts: Retrieves all products in the user's cart.

GET /users/:userId/carts/:cartId: Retrieves a product in the user's cart by cart ID.

PUT /users/:userId/carts/:cartId: Updates product information in the user's cart.

DELETE /users/:userId/carts/:cartId: Deletes a product from the user's cart.

DELETE /users/:userId/carts: Clears all products from the user's cart.

#### Email Sending Routes (/users/sendEmail)

POST /users/sendEmail: Sends an email.

#### Login/Logout Routes (/login, /logout)

POST /login: Logs in a user.

POST /logout: Logs out a user.


