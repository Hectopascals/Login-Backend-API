# Login-Backend-API
Example backend API for a login flow. Built using Express, JWT, and PostgreSQL. Covers `login` and `signup` endpoints, as well as `users` that can be accessed if you're logged in (using JSON Web Tokens).

## Instructions
**\*Assuming a Mac is used to build and run this application\***

* Ensure postgres, node, and npm is installed (can be done via `brew`)

Run `npm install` in project root directory to get all the node_modules

To start postgres:
`brew services start postgresql` or `pg_ctl -D /usr/local/var/postgres start`

To setup our DB table (this will create a table called `users`):
`node db createTable`

To drop the table (for any reason):
`node db dropTable`

In the project directory, create a `.env` file with the following two variables:
`DATABASE_URL=postgres://{username}@127.0.0.1:5432/{databaseName}`
`SECRET={yourSecretKeyForJWT}`

Note: *you are supposed to fill in the fields in curly braces {}*

Run `npm run build`, then `npm run dev-start` to launch (and allow reloading of) the app


## API Specs

### `POST /signup`
Endpoint to create a new user. 

Payload fields:
```json
{
  "email": "abc@github.com",
  "password": "octocat",
  "firstName": "Bob",
  "lastName": "Butterfield"
}
```

Response body returns a JWT on success, used for other endpoints:
```json
{
  "token": "some_jwt_token" 
}
```

### `POST /login`
Endpoint to log in an existing user. Payload fields:
```json
{
  "email": "abc@github.com",
  "password": "octocat"
}
```

Response body returns a JWT on success, used for other endpoints:
```json
{
  "token": "some_jwt_token"
}
```

### `GET /users`
Endpoint to retrieve a JSON of all users. Requires a valid header: `x-authentication-token` to be passed in with the request (the JWT token).

Response body:
```json
{
  "users": [
    {
      "email": "abc@github.com",
      "firstName": "Bob",
      "lastName": "Ross"
    }
  ]
}
```

### `PUT /users`
Endpoint to update the current user's name. Requires a valid header: `x-authentication-token` to be passed in and updates the user of the JWT being passed in. 

Payload fields:
```json
{
  "firstName": "NewFirstName",
  "lastName": "NewLastName"
}
```