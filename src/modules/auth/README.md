# Auth Module

Handles user login, JWT access-token issuance, and request guards used across the API.

## Purpose

- Validate email/password against the `users` table
- Issue signed JWT access tokens
- Protect routes with `JwtAuthGuard`
- Enforce role requirements with `RolesGuard` and `@Roles()`

## Files

| File | Role |
|------|------|
| `auth.controller.ts` | HTTP endpoints |
| `auth.service.ts` | Login logic, bcrypt verify, JWT sign |
| `auth.module.ts` | Wires Passport, JwtModule, UsersModule |
| `dto/login.dto.ts` | Login request body (`email`, `password`) |
| `strategies/jwt.strategy.ts` | Passport JWT strategy — extracts `sub`, `email`, `role` from token |
| `guards/jwt-auth.guard.ts` | Rejects unauthenticated requests |
| `guards/roles.guard.ts` | Checks `@Roles()` metadata against `req.user.role` |
| `decorators/roles.decorator.ts` | `@Roles('ADMIN')` decorator |

## Endpoints

### `POST /auth/login`

Public. Body: `{ email, password }`.

Response:

```json
{
  "accessToken": "<jwt>",
  "user": { "id": 1, "email": "...", "role": "ADMIN" }
}
```

Returns `401 Unauthorized` on invalid credentials.

### `GET /auth/profile`

Protected by `JwtAuthGuard`. Returns the decoded JWT payload attached to `req.user`.

## JWT payload

```json
{ "sub": "<userId>", "email": "...", "role": "ADMIN" | "USER" }
```

## Usage in other modules

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Get()
findAll() { ... }
```

## Dependencies

- `UsersModule` — `findByEmail()` for credential lookup
- `@nestjs/jwt` — token signing
- `@nestjs/passport` — JWT strategy
- `bcrypt` — password comparison

## Frontend integration

The client stores `accessToken` in `localStorage` and sends `Authorization: Bearer <token>` on protected requests. See [webgis-client/context/README.md](../../../../webgis-client/context/README.md).
