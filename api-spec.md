## Adopt-a-Pet API Contract

Base URL (example): `/api`
Content type for request/response bodies: `application/json`

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
  - No query params in Lab 2 implementation
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

**Error response (example)**
- **Status**: `404 Not Found`
- **When**: No pet exists with the provided `id`
- **Body**:

```json
{
  "error": "Pet not found"
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
- Note: Lab 2 implementation does not yet enforce validation at runtime; validation checks are planned for Lab 3.

**Error response (example)**
- **Status**: `400 Bad Request`
- **When**: Missing or invalid required fields
- **Body**:

```json
{
  "error": "Invalid pet data: name, type, age, and description are required"
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

**Error response (example)**
- **Status**: `404 Not Found`
- **When**: No pet exists with provided `id`
- **Body**:

```json
{
  "error": "Pet not found"
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

**Error response (example)**
- **Status**: `404 Not Found`
- **When**: No pet exists with provided `id`
- **Body**:

```json
{
  "error": "Pet not found"
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
