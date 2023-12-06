# Social Media App API

This project provides a RESTful API for social media application for managing post, profile, likes, comments and followings.
Frontend with the API is build in [repo here](https://github.com/rnimisha/social-media-client).

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
```

Rename .env.example to .env and configure values

```bash
cp .env.example .env
```

Build image and start docker containers

```bash
  docker compose up --build -d
```

## API documentation locally:

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
