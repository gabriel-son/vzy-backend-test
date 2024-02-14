
# Application Name

VZY Backend Test

## Application Architecture

This application follows a clean architecture pattern, separating concerns into distinct layers to promote maintainability, scalability, and ease of testing. The architecture is divided into models, routes, controllers, modules, middlewares, and utilities.

### Core Components

- **Models**: Define the schema for the database entities and are used by Mongoose for data validation and querying.
- **Routes**: Handle incoming HTTP requests and route them to the appropriate controller actions.
- **Controllers**: Act as an intermediary between the models/services and the views, processing incoming requests, handling user input, and sending responses.
- **Modules**: Contain the core business logic and interact directly with the database models, performing necessary operations and transformations.
- **Middlewares**: Functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle.
- **Utilities**: Helper functions and classes used across the application, including custom error handling and response formatting.

### Custom Error Handling

Custom error handling is implemented to provide meaningful error responses. A `CustomError` class extends the native Error class, adding a `statusCode` property used by an error-handling middleware to send consistent error responses.

### Response Formatting

A response handler utility standardizes the API response structure, ensuring consistency across all endpoints.


## Setup and Running

- Install dependencies:

```bash
npm install
```

- Run the application:

```bash
npm run start:development
```

## Environmental Variables

Ensure you have the following environmental variables set up in your `.development.env` file:

- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Secret key for JSON Web Tokens.
- `JWT_EXPIRES_IN`: Expiration time foR JSON Web Tokens.
- `PORT`: Server Port.


## API Documentation

Refer to the Postman documentation https://documenter.getpostman.com/view/24504937/2s93mATKmS
