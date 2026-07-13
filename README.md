# NestJS Crypto Service

Hybrid Encryption/Decryption API using AES-256-CBC + RSA

## Features

- Hybrid encryption: AES-256-CBC for data + RSA for key encryption
- RESTful API with Swagger documentation
- Input validation with class-validator
- Built with NestJS + TypeScript

## Installation

### Install dependencies

```bash
$ pnpm install
```

### Create ENV file

Copy `.env.example` to `.env` and update values as needed.

### Create RSA key pair

Form url: `https://cryptotools.net/rsagen` 

Rename private.example.key, public.example.key to private.key and public.key 

Replace contents of private.key and public.key with your generated keys 

### Running the App

```bash
# development mode
$ pnpm run start

# watch mode (auto-restart on changes)
$ pnpm run start:dev

# production mode
$ pnpm run build
$ pnpm run start:prod
```

The server will start at `http://localhost:3000`

Swagger documentation: `http://localhost:3000/api-docs`

### Testing

```bash
# unit tests
$ pnpm run test
```
