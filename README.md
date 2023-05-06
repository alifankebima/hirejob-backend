<br />
<p align="center">
  <div align="center">
    <img height="150" src="./docs/readme/logo.svg" alt="hirejob" border="0"/>
  </div>
  <h3 align="center">Hirejob (Hiring App)</h3>
  <p align="center">
    <a href="https://github.com/alifankebima/hirejob-backend"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://hirejob-frontend-alifankebima.vercel.app">View Demo</a>
    ·
    <a href="https://hirejob-backend-production-c841.up.railway.app">Api Demo</a>
  </p>
</p>

## Table of Contents

- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Documentation](#documentation)
- [Related Project](#related-project)

# About The Project

Hirejob is a hiring website to make it easier to connect workers with recruiters. Workers can create account and display portfolios, work experiences, and skills on this website. Recruiters can create account for searching and hire workers based on company needs. Workers will be notified if they are hired by recruiter.

## Built With

These are the libraries and service used for building this backend API

- [Express](https://expressjs.com)
- [PostgreSQL](https://www.postgresql.org)
- [Json Web Token](https://jwt.io)
- [Multer](https://github.com/expressjs/multer)
- [Google Cloud Platform](https://cloud.google.com)

# Getting Started

## Prerequisites

You'll need these programs installed before proceeding to installation

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download)

## Installation

Follow this steps to run the server locally

1. Clone this repository

```sh
git clone https://github.com/alifankebima/hirejob-backend.git
```

2. Change directory to hirejob-backend

```sh
cd hirejob-backend
```

3. Install all of the required modules

```sh
npm install
```

4. Create PostgreSQL database, query are provided in [hirejob-database-query.sql](./docs/hirejob-database-query.sql)

5. Create and configure `.env` file in the root directory, example credentials are provided in [.env.example](./.env.example)

```txt
- Please note that this server requires Google Drive API credentials
- Otherwise API endpoint with image upload won't work properly
```

6. Run this command to run the server

```sh
npm run server
```

- Or run this command for running in development environment

```sh
npm run dev
```

- Run this command for debugging and finding errors

```sh
npm run lint
```

## Documentation

Documentation files are provided in the [docs](./docs) folder

- [Postman API colletion](./docs/Hirejob.postman_collection.json)
- [PostgreSQL database query](./docs/hirejob-database-query.sql)
- [Database diagram](./docs/hirejob-database-diagram.png)

API endpoint list are also available as published postman documentation

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/26309865/2s93eSaavy)

# Related Project

:rocket: [`Frontend Hirejob`](https://github.com/alifankebima/hirejob-frontend)

:rocket: [`Backend Hirejob`](https://github.com/alifankebima/hirejob-backend)

:rocket: [`Demo Hirejob`](https://hirejob-frontend-alifankebima.vercel.app)
