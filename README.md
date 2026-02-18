# Lendsqr Backend Engineering Assessment - Demo Credit Wallet Service MVP

This project implements a wallet service MVP for Demo Credit using:

- Node.js
- TypeScript
- Express.js
- Knex.js
- MySQL
- Jest for unit tests

## 1. Problem Scope

The following core requirements were implemented:

- User can create account
- Users that appear on Adjutor Karma blacklist are blocked during signup
- User can login (JWT authentication)
- User can fund their wallet
- User can withdraw funds
- User can transfer funds from their account to another user
- User can track transaction history for all balance-changing operations

## 2. Design Decisions

1. Authentication — JWT cookies (RSA key pair)
   Explanation: JWT authentication was implemented using an RSA key pair to ensure secure token signing and verification. Sessions were intentionally not used because the assessment scope does not require session management.

2. Wallet ledger approach
   Explanation: Every balance-changing operation creates a transaction record.This ensures auditability, financial traceability, and easier reconciliation.

3. Transaction scoping
   Explanation: All wallet operations (fund, withdraw, transfer) run inside database transactions with row locking (FOR UPDATE) to prevent race conditions and inconsistent balances.

4. Layered architecture (routes -> controller -> service -> repository).
   Explanation: Reason for this is to achieve clean separation, ease of maintainance and abity to test easily.

5. Amount precision
   Explanation: Monetary values are stored as integer units (BIGINT) instead of floating-point decimals to prevent rounding and precision errors associated with JavaScript floating-point arithmetic.

## 3. Architecture

```
src/
  app.ts
  server.ts
  common/
    errors.ts
    http.ts
    ids.ts
    money.ts
  config/
    env.ts
  db/
    knex.ts
    migrations/
      20260213112000_init_wallet_schema.ts
  lib/
    logger.ts
  middleware/
    auth.ts
  types/
    auth.types.d.ts
    db.types.d.ts
    wallet.types.d.ts
  modules/
    dependencies.ts
    auth/
      auth.service.ts
      controller.ts
      karma.client.ts
      password.service.ts
      repository.ts
      routes.ts
      schema.ts
      token.service.ts
    wallet/
      controller.ts
      repository.ts
      routes.ts
      schema.ts
      wallet.service.ts
    health/
      routes.ts
tests/
  unit/
    auth.service.test.ts
    wallet.service.test.ts
```

## 4. Entity Relationship Diagram

![Demo Credit Database relationship diagram](docs/er-diagram.png)

## 5. API Endpoints

Base path: `/api/v1`

### Health

- `GET /health`

### Auth

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

### Wallet

- `GET /wallet/balance`
- `GET /wallet/transactions`
- `POST /wallet/fund`
- `POST /wallet/withdraw`
- `POST /wallet/transfer`

## 6. Request Samples

### Signup

```http
POST /api/v1/auth/signup

{
  "email": "user1@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "StrongPass123"
}
```

### Login

```http
POST /api/v1/auth/login

{
  "email": "user1@example.com",
  "password": "StrongPass123"
}
```

### Fund Wallet

```http
POST /api/v1/wallet/fund

{
  "amount": "5000.00",
  "narration": "Initial funding"
}
```

### Transfer

```http
POST /api/v1/wallet/transfer

{
  "toUserId": "<recipient-user-id>",
 "amount": "1200.00",
  "narration": "Repayment"
}
```
### Withdraw

```http
POST /api/v1/wallet/withdraw

{
  "amount": "3500.00",
  "narration": "First withdrawal"
}
```

### Balance

```http
GET /api/v1/wallet/balance

```
### Transactions

```http
GET /api/v1/wallet/balance

```

## 7. Environment Variables

set values:

- `PORT`

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

- `JWT_PRIVATE_KEY`
- `JWT_PUBLIC_KEY`
- `JWT_EXPIRES_IN`

- `ADJUTOR_BASE_URL`
- `ADJUTOR_BEARER_TOKEN`

## 8. Running Locally

1. Install dependencies

```bash
npm install
```

2. Configure `.env`

3. Run migrations

```bash
npm run knex:migrate
```

4. Start development server

```bash
npm run dev
```

## 9. Testing

Unit tests implemented for positive and negative scenarios:

- `AuthService`:
  - successful signup
  - blocked signup (Karma)
  - failed login (wrong password)
- `WalletService`:
  - successful funding
  - failed withdrawal (insufficient balance)
  - successful transfer

Run tests:

```bash
npm test
```

## 10. Submission Notes

- The project follows DRY and modular design principles.
- Database transactions are used to ensure financial consistency.
- Repository pattern isolates database logic.
- Services contain business rules.
- Controllers handle request/response mapping.

## 11. Engineering Notes / Tradeoffs (Design Rationale)

1) Money precision (BIGINT units vs DECIMAL)
Decision: store money as integer “units” (e.g., kobo) in BIGINT columns (balance_units, amount_units, balance_before_units and balance_after_units).
Why: JavaScript numbers are floating-point, so using decimals in calculations can introduce rounding errors. Integer math avoids that completely.
Tradeoff: values are less human-readable in the DB, so the API converts units to a formatted string when returning responses.

2) Ledger-based wallet design
Decision: every balance change creates a row in wallet_transactions.
Why: it provides an audit trail: like for instance, “who did what, when and why” (narration + reference).
Benefit: supports reconciliation, debugging, fraud review and rollback investigations.

3) Transaction scoping with row locking
Decision: fund/withdraw/transfer operations run inside a DB transaction and lock relevant wallet rows using FOR UPDATE.
Why: prevents race conditions like: two simultaneous withdrawals both reading the same balance and issues like transfer and withdrawal updating the same wallet at the same time.
Transfer deadlock prevention: wallets are locked in a consistent order (sorted user IDs) to reduce the risk of deadlocks when two transfers happen in opposite directions.

4) Repository pattern vs “direct knex queries everywhere”
Decision: DB access lives in repositories, business rules live in services.
Why: improves maintainability and testability. This makes the repositories small and predictable (CRUD + mapping). Services express the business rules clearly. With this, my unit tests can mock repositories without touching a real DB.
Tradeoff: slightly more files, but the code becomes easier to read and review.

5) Validation + error handling consistency
Decision: request validation is handled using Zod schemas, and errors return a consistent JSON format.
Why: reduces defensive code inside controllers and keeps error responses consistent for clients.

6) Authentication choice (JWT cookies)
Decision: JWT authentication uses RSA keys and is stored in httpOnly cookies.
Why: cookie-based auth makes it easy to test protected endpoints without manually copying headers and RSA signing avoids sharing a symmetric secret across environments.
Tradeoff: production apps typically add CSRF protection + refresh token handling depending on threat model, but those were intentionally out of scope for this MVP.

7) Database constraints and indexes
Decisions: users.email is unique, wallet_accounts.user_id is unique (1 wallet per user) and transaction reference is indexed
Why: constraints enforce integrity at the database level. Indexes improve lookup and auditing.

8) Unit testing approach (positive + negative scenarios)
Decision: tests cover both happy paths and failure cases: signup blocked by Karmam, wrong password login, insufficient funds withdrawal and transfer validation
Why: demonstrates correctness and prevents regressions.
