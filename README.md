# 🎥 Cinema app backend

A backend service for a cinema mobile app (https://github.com/palp1ix/cinema-app) built with NestJS for managing cinema operations including sessions, films, rooms, and seat bookings. 

This is a preparation project for a contest written in a couple of days to meet the deadline.

## Features

- **Session Management 📝**: Create, read, update, and delete movie sessions
- **Film Integration 🎥**: Link sessions with films and manage film data
- **Room Management 🔢**: Handle cinema room configurations
- **Seat Booking System 📖**: Track and manage occupied seats for each session
- **Caching Implementation ⏲**: Redis-based caching for improved performance
- **RESTful API ✨**: Full CRUD operations for cinema resources

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- Redis
- PostgreSQL

## Prerequisites

- Docker

## Installation

1. Clone the repository
2. Place a `.env` file in the root folder of the project *(example below)*
3. Run `docker compose up`

## Example of the `.env` file

```env
POSTGRES_HOST = "postgres"
POSTGRES_DB = "cinema"
POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"
JWT_SECRET = "secret"
REDIS_HOST = "redis"
REDIS_PORT = 6379
```
