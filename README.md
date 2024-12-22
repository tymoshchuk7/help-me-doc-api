# Help me Doc API

This project is a Node.js server using Express.js, PostgreSQL and Redis, with authentication handled by Auth0. The server provides a robust REST API for managing *Help me Doc*.

## Development

For development, run the following:
1. Set up Auth0 (Create app and generate credentials)
2. Set up Sendgrid for sending email (Create app and generate credentials)
3. Create and set up .env file according to `.example.env` file
4. Set DB_PASSWORD env variable, e.g. `export DB_PASSWORD=some_password` 
5. Run docker-compose `podman-compose -f docker-compose.local.yml up` 
