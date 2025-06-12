# Backend Engineer Work Sample

This project skeleton contains a basic Express setup one endpoint to create a user and one endpoint to fetch all users, as well as a basic empty unit test.

## Setup

1. Add `DB_USER` and `DB_PASSWORD` to the .env file.
2. Run `npm install`

## Scripts

Run the server in watch mode:

```sh
npm run dev
```

Start the server:

```sh
npm start
```

Execute tests (needs the server running):

```sh
npm test
```

## Project Goal

1. Adjust POST /users that it accepts a user and stores it in a database.
    - The user should have a unique id, a name, a unique email address and a creation date
2. Adjust GET /users that it returns (all) users from the database.
    - This endpoint should be able to receive a query parameter `created` which sorts users by creation date ascending or descending.

Feel free to add or change this project as you like.

## Project Description

I wanted the code to feel simple and easy to understand. I usually prefer writing the logic in vanilla js to avoid being too locked in to a library.

### The Setup

#### Database

Nothing was mentioned about how and where the database should exist. Since I wanted to create a more realistic microservice setup where the api doesn't own the database I went with a cloud alternative. This would in the future allow me to scale the api up and down without any problems. In a production environment I would prefer to have a database service separate but in the same local network and not public to the internet. Since this API is the interface outwards.

I had also heard that Perspective used MongoDb so I found it fitting to use MongoDb Atlas. Right now we only have to support adding a user and listing all users, which any database supports. But we already automatically have an index on the User ID allowing us to efficiently fetch a user from a User ID and we could have more indices as well.

Since databases are very capable at sorting and we don't want to re-implement that behavior we let the database sort the users for us.

The database connection is established when the server starts following recommended procedures and closed before shutdown. If we would loose connection there is a built in connect that is done before each call, so that should be handled.

#### API

The API can already have multiple instances if needed to handle a heavy production load. In the future it could be placed a Redis in front of it to handle the connections towards the multiple instances and handle caching and any locks needed.

The API validates all input with zod since Express doesn't handle any of that for us. Validation code is very optimal for a library since there are so many cases to account for and it easily becomes a lot of code that is critical and difficult to maintain.

### Folder Structure

The folder structure is made to indicate that users are supported right now but it will be easy to add on other entities, such as feature toggles, workspaces etc. We have everything separated, with `userRoutes.ts` in the routes folder, `userController.ts` in the controllers folder and a `User.ts` in the models folder. It could be as easy as adding a `workspaceRoutes.ts`, `workspaceController.ts`, `Workspace.ts` and maybe a `WorkspaceDatabaseClient.ts` (depending on your setup).

### Error Handling

1. The first recipient of the request to the Express API is the request context middleware, adding a logger and a trace ID to a context object. The logger adds the trace ID to each log and the output format can easily be reformatted or redirected. The trace ID is also outputted together with any error message for traceability.
2. Second is the validate middleware using zod to ensure we get the parameters we expect, in the correct types. The validation fails with a 400 or with a 500 unknown error if it's not the zod validation error we expect.
3. Third it's the router, any error here is wrapped by the `errorWrapper` and sent to the error middleware. If nothing goes wrong we return a response directly.
4. The forth step is the error middleware, here we only arrive if we get an unexpected error from step 3. Right now we only write "Internal Server Error" to not leak anything sensitive and we log the full error so that we can look into and fix it.

The place where error handling lacks the most is for the database. Here we might retry on transient errors and handle query errors depending on use case. Right now these would be Internal Server Errors outwardly. There is also the option of using transactions that can be retried, especially when changing multiple things to avoid leaving the database in a bad state.

### Documentation

The best documentation is clean code. To write very clear class, function, variable and file names.

Adding an API specification would however be recommended. The zod schemas I have added can be used to generate openapi specs, with for example the [zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi) library. Unfortunately since Express doesn't integrate very well with openapi you would have to define the routes yourself, which is error prone but still worth it if you have consumers of the API outside of your direct team.
