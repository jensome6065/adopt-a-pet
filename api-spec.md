## Adopt-a-Pet API Contract

Base URL (example): `/api`
Content type for request/response bodies: `application/json`

### Global Error Response Shape

All error responses in this API use the same JSON shape:

```json
{
  "error": "string"
}
```

This includes validation errors (`400`), not-found errors (`404`), and unexpected server errors (`500`).

### Pet Object Shape

```json
{
  "id": 1,
  "name": "string",
  "type": "dog | cat | bird | other",
  "breed": "string",
  "age": 0,
  "description": "string",
  "adopted": false,
  "imageUrl": "string"
}
```

## Data Model

This section defines the pet profile shape used by the in-memory database in Lab 2 and later translated to `schema.prisma` in Lab 3.

- `id`
  - **Type**: integer
  - **Required**: yes
  - **Constraints/notes**: Auto-incrementing unique identifier managed by the server (clients do not provide it on create).

- `name`
  - **Type**: string
  - **Required**: yes
  - **Constraints/notes**: Trimmed, non-empty, recommended max length 100 characters.

- `type`
  - **Type**: string (enum-like)
  - **Required**: yes
  - **Constraints/notes**: Must be one of `dog`, `cat`, `bird`, `other`.

- `breed`
  - **Type**: string
  - **Required**: no
  - **Constraints/notes**: Optional because mixed or unknown breeds are common.

- `age`
  - **Type**: integer
  - **Required**: yes
  - **Constraints/notes**: Whole number in years, minimum `0`.

- `description`
  - **Type**: string
  - **Required**: yes
  - **Constraints/notes**: Short adoption summary (temperament, needs, behavior), non-empty.

- `adopted`
  - **Type**: boolean
  - **Required**: yes (stored record), optional in create requests
  - **Constraints/notes**: Defaults to `false` for new listings when omitted by the client.

- `imageUrl`
  - **Type**: string
  - **Required**: no
  - **Constraints/notes**: Optional URL to a pet photo.

---

## 0) Root health check / welcome route

- **Method**: `GET`
- **Path**: `/`
- **Request params/body**:
  - No route params
  - No query params
  - No request body

**Success response**
- **Status**: `200 OK`
- **Body**:

```json
{
  "message": "Welcome to the Adopt-a-Pet API!"
}
```

**Error response (example)**
- **Status**: `500 Internal Server Error`
- **When**: Unexpected server failure
- **Body**:

```json
{
  "error": "Internal server error"
}
```

---

## 0.1) Practice route: hello-world

- **Method**: `GET`
- **Path**: `/hello-world`
- **Request params/body**:
  - No route params
  - No query params
  - No request body

**Success response**
- **Status**: `200 OK`
- **Body**: plain text `Hello, World!`

**Error response (example)**
- **Status**: `500 Internal Server Error`
- **When**: Unexpected server failure
- **Body**:

```json
{
  "error": "Internal server error"
}
```

---

## 0.2) Practice route: hello-pet

- **Method**: `GET`
- **Path**: `/hello-pet`
- **Request params/body**:
  - No route params
  - No query params
  - No request body

**Success response**
- **Status**: `200 OK`
- **Body**: plain text `Hello, Pet!`

**Error response (example)**
- **Status**: `500 Internal Server Error`
- **When**: Unexpected server failure
- **Body**:

```json
{
  "error": "Internal server error"
}
```

---

## 1) Retrieve all pets

- **Method**: `GET`
- **Path**: `/pets`
- **Request params/body**:
  - No route params
  - Query params (all optional):
    - `type`
      - Filters pets by pet type
      - Expected type: string
      - Allowed values: `dog`, `cat`, `bird`, `other`
    - `age_min`
      - Filters pets to age greater than or equal to the provided value
      - Expected type: integer
    - `age_max`
      - Filters pets to age less than or equal to the provided value
      - Expected type: integer
  - Default behavior when query params are omitted: return all pets
  - Unrecognized query params: ignored (no error)
  - No request body

**Success response**
- **Status**: `200 OK`
- **Body**:

```json
{
  "pets": [
    {
      "id": 1,
      "name": "Luna",
      "type": "dog",
      "breed": "Labrador Mix",
      "age": 3,
      "description": "Friendly and energetic.",
      "adopted": false,
      "imageUrl": "https://example.com/luna.jpg"
    }
  ]
}
```

**Empty state behavior**
- **Status**: `200 OK`
- **Body**:

```json
{
  "pets": []
}
```

**Error responses**

- **Status**: `400 Bad Request`
- **When**: A supported query parameter has an invalid value (for example, `type=fish`, non-integer `age_min`, non-integer `age_max`, or `age_min > age_max`)
- **Body**:

```json
{
  "error": "Invalid query parameters"
}
```

- **Status**: `500 Internal Server Error`
- **When**: Unexpected server/database failure while retrieving pets
- **Body**:

```json
{
  "error": "Internal server error"
}
```

---

## 2) Retrieve a single pet by ID

- **Method**: `GET`
- **Path**: `/pets/:id`
- **Request params/body**:
  - Route params:
    - `id` (integer in URL path, required)
  - No request body

**Success response**
- **Status**: `200 OK`
- **Body**:

```json
{
  "pet": {
    "id": 1,
    "name": "Luna",
    "type": "dog",
    "breed": "Labrador Mix",
    "age": 3,
    "description": "Friendly and energetic.",
    "adopted": false,
    "imageUrl": "https://example.com/luna.jpg"
  }
}
```

**Error responses**
- **Status**: `404 Not Found`
- **When**: No pet exists with the provided `id`
- **Body**:

```json
{
  "error": "Pet not found"
}
```

- **Status**: `500 Internal Server Error`
- **When**: Unexpected server/database failure while retrieving pet by `id`
- **Body**:

```json
{
  "error": "Internal server error"
}
```

---

## 3) Create a new pet profile

- **Method**: `POST`
- **Path**: `/pets`
- **Request params/body**:
  - JSON body (required fields: `name`, `type`, `age`, `description`)
  - Optional fields: `imageUrl`, `adopted` (defaults to `false`)
  - `breed` is optional

```json
{
  "name": "Mochi",
  "type": "cat",
  "breed": "Domestic Shorthair",
  "age": 2,
  "description": "Calm and affectionate.",
  "imageUrl": "https://example.com/mochi.jpg",
  "adopted": false
}
```

**Success response**
- **Status**: `201 Created`
- **Body**:

```json
{
  "pet": {
    "id": 4,
    "name": "Mochi",
    "type": "cat",
    "breed": "Domestic Shorthair",
    "age": 2,
    "description": "Calm and affectionate.",
    "adopted": false,
    "imageUrl": "https://example.com/mochi.jpg"
  }
}
```

**Validation Rules**
- Required fields: `name` (non-empty string), `type` (one of `dog`, `cat`, `bird`, `other`), `age` (integer >= 0), `description` (non-empty string)
- Optional fields: `breed` (string), `imageUrl` (string), `adopted` (boolean, defaults to `false`)
- Runtime enforcement: Validation is enforced before Prisma calls in Lab 3. Invalid payloads return `400` with the error shape documented below.

**Error responses**
- **Status**: `400 Bad Request`
- **When**: Missing or invalid required fields
- **Body**:

```json
{
  "error": "Invalid pet data: name, type, age, and description are required"
}
```

- **Status**: `500 Internal Server Error`
- **When**: Unexpected server/database failure while creating a pet
- **Body**:

```json
{
  "error": "Internal server error"
}
```

---

## 4) Update a pet profile

- **Method**: `PUT`
- **Path**: `/pets/:id`
- **Update strategy note**: This API uses `PUT` (not `PATCH`) for updates in Lab 2. We keep one update endpoint shape and return a full pet record after merging provided fields into the existing object.
- **Request params/body**:
  - Route params:
    - `id` (integer in URL path, required)
  - JSON body:
    - Updatable fields:
      - `name`, `type`, `breed`, `age`, `description`, `adopted`, `imageUrl`
    - Partial body is allowed in this lab implementation (fields not included are preserved)

```json
{
  "name": "Luna",
  "type": "dog",
  "age": 4,
  "description": "Friendly, energetic, and leash-trained."
}
```

**Success response**
- **Status**: `200 OK`
- **Body**:

```json
{
  "pet": {
    "id": 1,
    "name": "Luna",
    "type": "dog",
    "breed": "Labrador Mix",
    "age": 4,
    "description": "Friendly, energetic, and leash-trained.",
    "adopted": true,
    "imageUrl": "https://example.com/luna-updated.jpg"
  }
}
```

**Error responses**
- **Status**: `404 Not Found`
- **When**: No pet exists with provided `id`
- **Body**:

```json
{
  "error": "Pet not found"
}
```

**Validation Rules**
- Partial body is allowed, but at least one updatable field must be present.
- Allowed update fields only: `name`, `type`, `breed`, `age`, `description`, `adopted`, `imageUrl`.
- If provided, fields must satisfy the same type/value rules used by `POST /pets`:
  - `name`: non-empty string
  - `type`: one of `dog`, `cat`, `bird`, `other`
  - `age`: integer >= 0
  - `description`: non-empty string
  - `breed`: string or `null`
  - `imageUrl`: string or `null`
  - `adopted`: boolean

**Validation error response (example)**
- **Status**: `400 Bad Request`
- **When**: Empty body, non-updatable fields, or invalid values/types in provided fields
- **Body**:

```json
{
  "error": "Invalid update data: provide at least one updatable field with valid values"
}
```

- **Status**: `500 Internal Server Error`
- **When**: Unexpected server/database failure while updating pet by `id`
- **Body**:

```json
{
  "error": "Internal server error"
}
```

---

## 5) Delete a pet profile

- **Method**: `DELETE`
- **Path**: `/pets/:id`
- **Request params/body**:
  - Route params:
    - `id` (integer in URL path, required)
  - No request body

**Success response**
- **Status**: `204 No Content`
- **Body**: none

**Error responses**
- **Status**: `404 Not Found`
- **When**: No pet exists with provided `id`
- **Body**:

```json
{
  "error": "Pet not found"
}
```

- **Status**: `500 Internal Server Error`
- **When**: Unexpected server/database failure while deleting pet by `id`
- **Body**:

```json
{
  "error": "Internal server error"
}
```

---

## Decisions Log — CRUD Implementation

- **Most interesting spec-vs-code moment**: `GET /pets` initially had a success example but no explicit empty-state behavior.  
  **Why it mattered**: Documenting `200` with `{ "pets": [] }` removed ambiguity for frontend handling when no records exist.

- **API design choice I'd defend**: Kept a consistent envelope response shape for resources (`{ "pets": [...] }`, `{ "pet": {...} }`) and a consistent error shape (`{ "error": "..." }`) across CRUD routes.  
  **Why**: Predictable response shapes simplify client parsing and reduce per-route conditionals.

- **Something I found during testing that changed the spec**: Early examples used `species` and string IDs, while implementation used `type` and integer IDs.  
  **Why it changed**: The spec was updated to match the actual data model and in-memory behavior before moving to Prisma.

---

## Decisions Log — API Contract

- **Decision**: Used a consistent JSON error shape: `{ "error": "..." }` for all failures.  
  **Why**: The frontend can handle errors with one predictable parser pattern.

- **Decision**: Used `PUT /pets/:id` for updates and treated it as full replacement of editable fields.  
  **Why**: It keeps update logic straightforward for an early in-memory implementation.

- **What I'd change after reflection**: I started with only `id`, `name`, and `species`, then expanded the pet model (`breed`, `age`, `description`, `adopted`, `imageUrl`, timestamps) so the frontend has enough data to render a useful profile without additional endpoints.

- **Decision**: For server setup, generated minimal Express boilerplate using CommonJS (`require`), created `app` with `express()`, set a configurable `PORT`, and started listening with `app.listen(...)`.  
  **Why**: This is the simplest stable starting point for local dev while staying compatible with default Node setup.

- **Decision**: Kept the startup code lean and deferred route registration and middleware (like `express.json()`) until endpoint implementation begins.  
  **Why**: It keeps setup focused on one concept at a time and makes later additions easier to reason about.

- **What I'd change after reflection**: I better understand that `app.listen` opens the server socket, and its callback runs after the server is actively accepting connections (it is not handling requests itself). I would next add `express.json()` before defining POST/PUT routes so request bodies are parsed correctly.

---

## Decisions Log — Data Model

- **Decision**: Used integer auto-increment `id` values.
  **Why**: They are simple to generate in-memory now and easy to migrate to Prisma later with `@id @default(autoincrement())`.

- **Decision**: Made `breed` optional.
  **Why**: Many adoption listings are mixed-breed or unknown-breed, so requiring breed would force placeholder values.

- **Decision**: Stored `age` as an integer and constrained `type` to `dog`, `cat`, `bird`, or `other`.
  **Why**: Integer `age` is easier to validate/filter/sort, and constrained `type` keeps API data consistent across clients.

- **What I'd reconsider**: Add `vaccinated` and `spayedNeutered` booleans in a future revision so adopters can filter by common health criteria.

---

## Decisions Log — Schema Formalization

- **Field that translated cleanly**: `name: String` and `description: String` mapped directly from required string fields with no ambiguity.

- **Field that required a spec update**: `adopted` was listed as optional in the provisional model, but because records should always have an adoption state and default to `false`, it was clarified as required in stored records (still optional in create input).

- **Constraint I added that wasn't explicit in Prisma terms**: `type` was enforced with a Prisma enum (`PetType`) to encode the existing allowed values (`dog`, `cat`, `bird`, `other`) structurally.

- **What the schema enforces that the array didn't**: PostgreSQL now enforces required fields and type correctness at write time, and auto-generates unique `id` values instead of relying on in-memory conventions.

---

## Spec Status — After Lab 1

### Implemented
- `GET /` — health check ✅
- `GET /hello-world` — practice route ✅
- `GET /hello-pet` — practice route ✅

### Planned (Labs 2–3)
- `GET /pets` — retrieve all pets (Lab 2)
- `GET /pets/:id` — retrieve single pet (Lab 2)
- `POST /pets` — create pet (Lab 2)
- `PUT /pets/:id` — update pet (Lab 2)
- `DELETE /pets/:id` — delete pet (Lab 2)

### Inconsistencies Found
- None at this stage. All currently implemented routes are documented in the spec.
- `GET /` matches spec (`200` + JSON welcome message).
- `GET /hello-world` and `GET /hello-pet` match spec (both return `200` + plain text responses).

---

## Spec Reconciliation — Lab 2

### Routes verified
- `GET /pets` — ✅ matches spec
- `GET /pets/:id` — ✅ matches spec
- `POST /pets` — ✅ matches spec
- `PUT /pets/:id` — ✅ matches spec
- `DELETE /pets/:id` — ✅ matches spec

### Gaps found and resolved
- `GET /pets` previously documented query filters (`species`, `adopted`) and a `400` error case not implemented in code; spec was updated to reflect current Lab 2 behavior (no query filtering).
- Early examples in multiple route sections used old fields (`species`, timestamp fields, string IDs) while implementation uses `type`, no timestamps, and integer IDs; examples were updated to match code.
- `GET /pets/:id` route param type was listed as string; corrected to integer-in-path semantics used by implementation.

### Intentional spec updates
- Added a clear note under `POST /pets` validation rules that runtime validation is deferred to Lab 3, so current Lab 2 behavior remains accurately documented.
- Kept envelope response shapes (`{ "pets": [...] }` and `{ "pet": {...} }`) as the contract because implementation and tests consistently use them.

---

## Spec Reconciliation — After Prisma Refactor

### Behavior that changed
- Optional fields (`breed`, `imageUrl`) now come back as `null` when not provided, because Prisma/PostgreSQL stores nullable columns as `NULL`; this replaces the in-memory behavior where those fields could be omitted or left `undefined`.
- `prisma.pet.update()` and `prisma.pet.delete()` throw `P2025` when the record does not exist; route-level `try/catch` now maps that to the contract's `404 { "error": "Pet not found" }` response so external behavior stays the same.

### Spec updates made
- Documented the nullable-field behavior (`null` for missing optional values) as an implementation note in this reconciliation section.
- No route contract changes were required: methods, paths, success status codes, error status codes, and response envelope shapes (`{ "pets": [...] }`, `{ "pet": {...} }`, `{ "error": "..." }`) remain unchanged.

---

## Decisions Log — Input Validation

- **Validation rule that was already in the spec**: `POST /pets` requires `name`, `type`, `age`, and `description`; this is now enforced before calling Prisma.

- **Validation rule I added to the spec before implementing**: `PUT /pets/:id` now explicitly requires at least one allowed updatable field and rejects unknown fields with `400`.

- **Edge case I didn't think about until implementing**: Empty strings (like `"name": "   "`) should fail validation even though a key is present; checks now require non-empty trimmed strings.

- **Why these checks happen before the Prisma call**: Early validation returns clear, contract-specific `400` responses and avoids relying on database/ORM exceptions for user input errors.

---

## Spec Reconciliation — Lab 3 Complete

### System state
- Database: Prisma + PostgreSQL (`pets` table, migration: `init_pets_table`)
- Routes: 5 CRUD endpoints (`GET /pets`, `GET /pets/:id`, `POST /pets`, `PUT /pets/:id`, `DELETE /pets/:id`)
- Validation: Strict required-field checks on `POST /pets`; `PUT /pets/:id` requires at least one allowed updatable field and validates all provided values

### Final gap report
- Gap found and resolved (documentation): the final validation summary language was clarified so `PUT /pets/:id` is documented accurately as partial-update validation (not full required-field validation like `POST`).
- No schema/model gaps found: all fields in `schema.prisma` (`id`, `name`, `type`, `breed`, `age`, `description`, `adopted`, `imageUrl`) are reflected in the API spec data model.
- No route contract gaps found: methods, paths, response envelope shapes, and success/error status codes match the implementation.

### What changed most from the original Lab 1 spec
- The spec evolved from a basic route contract to a full system document with a formal data model, Prisma/schema reconciliation notes, runtime validation rules, and decisions logs that explain why implementation choices were made.

---

## Decisions Log — Error Handling (Lab 4)

- **Error case I found that wasn't in my original spec**: Prisma unique constraint violations (`P2002`) can occur and should not leak raw Prisma errors to clients.
  **How I handled it**: Added centralized middleware handling for `Prisma.PrismaClientKnownRequestError` with `P2002`, returning `400` with `{ "error": "A unique constraint violation occurred." }`.

- **Consistent error shape I chose and why**: `{ "error": "..." }` for all failures.
  **Why**: Frontend code can always read one field (`error`) regardless of route or failure type, which keeps error parsing predictable.

- **One case where implementation diverged from the spec**: Prisma throws `P2025` for missing records during update/delete, while the external contract expects `404 Pet not found`.
  **How I handled it**: Route handlers translate `P2025` to `NotFoundError("Pet not found")`, and error middleware returns the contract-compliant `404` response shape.

---

## Decisions Log — Query Parameters (Lab 4)

- **Filter I added that wasn't in my initial draft**: Added `age_min` and `age_max` together (range filtering) instead of only exact-age filtering.
  **Why**: Age ranges map better to real adoption search behavior (for example, "young pets" or "senior pets") and combine naturally with `type`.

- **req.query always returns strings — what this required**: Converted `age_min`/`age_max` with `parseInt(...)` and validated with `Number.isInteger(...)` before building Prisma filters.
  **Why**: Prevents passing invalid numeric values into the Prisma `where` clause and keeps query-validation failures explicit as `400`.

- **Edge case I had to decide on**: `type=dog&age_max=0` can validly return an empty array.
  **Why**: A valid filter that finds no matches should still be `200` with `{ "pets": [] }`; only malformed query values return `400`.

---

## Decisions Log — Automated Tests (Lab 4)

- **Test that revealed a gap between spec and implementation**: Initial test setup highlighted that the server file started listening immediately, which made route-level Supertest imports brittle.
  **How I handled it**: Split Express app construction into `app.js` and kept `index.js` for startup only, so tests can import the app without binding a network port.

- **Error case I almost didn't test**: `POST /pets` with missing required fields.
  **Why**: Success paths are easy to focus on first, but this `400` validation case verifies that contract-level input validation is actually enforced.

- **One thing npm test confirmed about the contract**: Core CRUD routes return the documented status codes (`200`, `201`, `204`) and error responses include the consistent `{ "error": "..." }` shape.

---

## Spec Reconciliation — Lab 4 Final

### Routes verified
- `GET /pets` — ✅ matches spec
- `GET /pets/:id` — ✅ matches spec
- `POST /pets` — ✅ matches spec
- `PUT /pets/:id` — ✅ matches spec
- `DELETE /pets/:id` — ✅ matches spec

### Error shapes verified
- Consistent `{ "error": "..." }` shape across all routes: ✅

### Query parameters verified
- `type` filter: ✅ matches spec
- `age_min` / `age_max` filters: ✅ match spec

### Frontend integration verified
- Frontend fetch calls match documented routes: ✅
- Response fields frontend reads are returned by backend: ✅

### Gaps found and resolved
- Frontend initially had no API calls implemented; added fetch integration for list/filter (`GET /pets`), read-by-id (`GET /pets/:id`), create (`POST /pets`), update (`PUT /pets/:id`), and delete (`DELETE /pets/:id`).
- Frontend filter UI state used `ageMin`/`ageMax` while the contract documents `age_min`/`age_max`; mapped frontend values to documented query parameter names before issuing requests.
- Frontend add/update forms initially omitted `description` even though `POST`/`PUT` validation requires it when supplied; added `description` input and included it in request payloads.
- Frontend now reads and displays standardized error responses via the `{ "error": "..." }` field for non-2xx responses.

### Intentional spec updates made during this audit
- No contract changes were required; implementation was updated to match the existing API spec.
