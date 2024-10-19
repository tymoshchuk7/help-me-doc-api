# Help me Doc API

This project is a Node.js server using Express.js, PostgreSQL and Redis, with authentication handled by Auth0. The server provides a robust REST API for managing *Help me Doc*.

## Development

For development, run the following:
1. Install dependencies `npm run install`
2. Set up PostgreSQL and create `help-me-doc` database
3. Set up Auth0 (Create app and generate credentials)
4. Set up Sendgrid for sending email (Create app and generate credentials)
5. Create and set up .env file according to `.example.env` file
6. Run database migrations `npm run db:migrate`
7. Seed the database `npm run db:seed`
8. Run server `npm run start`