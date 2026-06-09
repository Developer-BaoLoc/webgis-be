# Users Module

Manages user records in PostgreSQL and exposes admin-only CRUD plus a self-service profile endpoint.

## Purpose

- Persist users with hashed passwords and roles
- Support auth login via `findByEmail()`
- Allow ADMIN users to list and create accounts

## Files

| File | Role |
|------|------|
| `users.controller.ts` | HTTP endpoints |
| `users.service.ts` | Repository operations |
| `users.module.ts` | TypeORM feature registration |
| `entities/user.entity.ts` | `User` entity mapped to `users` table |
| `dto/create-user.dto.ts` | Create-user request body |
| `enums/role.enum.ts` | `ADMIN`, `USER` |

## Entity: `User`

| Field | Column | Notes |
|-------|--------|-------|
| `id` | `id` | `bigint`, auto-generated |
| `email` | `email` | unique |
| `passwordHash` | `password_hash` | excluded from serialization |
| `role` | `role` | `ADMIN` or `USER`, default `USER` |
| `createdAt` | `created_at` | auto |
| `updatedAt` | `updated_at` | auto |

## Endpoints

| Method | Path | Auth | Role | Description |
|--------|------|------|------|-------------|
| `GET` | `/users` | JWT | ADMIN | List all users |
| `POST` | `/users` | JWT | ADMIN | Create user |
| `GET` | `/users/me` | JWT | any | Current user from JWT |

### `POST /users` body

```json
{ "email": "user@example.com", "password": "...", "role": "USER" }
```

Password is hashed with bcrypt (10 rounds) before save. Duplicate email returns `400 Bad Request`.

## Service methods

- `findByEmail(email)` — used by `AuthService.login()`
- `findAll()` — returns all users (password hash included in entity; consider DTO mapping for production)
- `createUser(dto)` — validates uniqueness, hashes password, saves

## Dependencies

- `AuthModule` guards (`JwtAuthGuard`, `RolesGuard`, `@Roles`)
- TypeORM `Repository<User>`

## Database

Table defined in [infra/postgres/migrations/005_create_users.sql](../../../../infra/postgres/migrations/005_create_users.sql).
