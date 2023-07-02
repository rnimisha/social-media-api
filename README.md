# Social Media App API

This project provides a RESTful API for social media application for managing post, profile, likes, comments and followings.

## Features

- User authentication and authorization using JWT
- CRUD operations for managing posts.
- Like and comment for post.
- Follow and unfollow user.
- Feed based on followings.
- Real time chat with websocket.
- Database integration with PostgreSQL and prisma.
- Unit testing using Jest.
- API endpoints documented with swagger.

## Installation

Clone the repository

```bash
    git clone https://github.com/rnimisha/social-media-api.git
```

Install the project dependencies

```bash
  cd social-media-api
  npm install
```

Configure .env file

```bash
POSTGRES_USER=YOUR_POSTGRES_USER
POSTGRES_PASSWORD=YOUR_POSTGRES_PASSWORD
POSTGRES_DB=YOUR_POSTGRES_DB

PGADMIN_DEFAULT_EMAIL=YOUR_PGADMIN_DEFAULT_EMAIL
PGADMIN_DEFAULT_PASSWORD=YOUR_PGADMIN_DEFAULT_PASSWORD

ACCESS_SECRET=SECRETKEY_FOR_ACCESSTOKEN
REFRESH_SECRET=SECRETKEY_FOR_REFRESHTOKEN

DATABASE_URL="postgresql://YOUR_POSTGRES_USER:YOUR_POSTGRES_PASSWORD@localhost:5434/YOUR_POSTGRES_DB?schema=public"

```

Start docker containers

```bash
  docker compose up -d
```

Run database migration

```bash
  npx prisma migrate dev
```

Run database migration

```bash
  npx prisma migrate dev
```

Build and run the project

```bash
  npm run Build
  npm start
```

## Test

```bash
  npm test
```

## API documentation:

`http://localhost:3000/api` to access the Swagger API documentation.

## Swagger Documentation

![Sqagger UI](https://raw.githubusercontent.com/rnimisha/social-media-api/main/src/common/demo/apidemo.gif)

## Tech Stack

- Node.js
- Nest.js
- Prisma
- PostgreSQL
- Jest
- Docker
