## Adopt-a-Pet API Contract

Base URL (example): `/api`
Content type for request/response bodies: `application/json`

### Pet Object Shape

```json
{
  "id": "string",
  "name": "string",
  "species": "string",
  "breed": "string",
  "age": 0,
  "description": "string",
  "adopted": false,
  "imageUrl": "string",
  "createdAt": "ISO-8601 string",
  "updatedAt": "ISO-8601 string"
}
```

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
  - Query params (optional):
    - `species` (string) - filter by species
    - `adopted` (boolean) - filter by adoption status
  - No request body

**Success response**
- **Status**: `200 OK`
- **Body**:

```json
{
  "pets": [
    {
      "id": "pet_123",
      "name": "Luna",
      "species": "dog",
      "breed": "Labrador Mix",
      "age": 3,
      "description": "Friendly and energetic.",
      "adopted": false,
      "imageUrl": "https://example.com/luna.jpg",
      "createdAt": "2026-06-17T15:00:00.000Z",
      "updatedAt": "2026-06-17T15:00:00.000Z"
    }
  ]
}
```

**Error response (example)**
- **Status**: `400 Bad Request`
- **When**: `adopted` query param is not `true` or `false`
- **Body**:

```json
{
  "error": "Invalid query parameter: adopted must be true or false"
}
```

---

## 2) Retrieve a single pet by ID

- **Method**: `GET`
- **Path**: `/pets/:id`
- **Request params/body**:
  - Route params:
    - `id` (string, required)
  - No request body

**Success response**
- **Status**: `200 OK`
- **Body**:

```json
{
  "pet": {
    "id": "pet_123",
    "name": "Luna",
    "species": "dog",
    "breed": "Labrador Mix",
    "age": 3,
    "description": "Friendly and energetic.",
    "adopted": false,
    "imageUrl": "https://example.com/luna.jpg",
    "createdAt": "2026-06-17T15:00:00.000Z",
    "updatedAt": "2026-06-17T15:00:00.000Z"
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
  - JSON body (required fields: `name`, `species`, `breed`, `age`, `description`)
  - Optional fields: `imageUrl`, `adopted` (defaults to `false`)

```json
{
  "name": "Mochi",
  "species": "cat",
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
    "id": "pet_124",
    "name": "Mochi",
    "species": "cat",
    "breed": "Domestic Shorthair",
    "age": 2,
    "description": "Calm and affectionate.",
    "adopted": false,
    "imageUrl": "https://example.com/mochi.jpg",
    "createdAt": "2026-06-17T15:05:00.000Z",
    "updatedAt": "2026-06-17T15:05:00.000Z"
  }
}
```

**Error response (example)**
- **Status**: `400 Bad Request`
- **When**: Missing or invalid required fields
- **Body**:

```json
{
  "error": "Invalid pet data: name, species, breed, age, and description are required"
}
```

---

## 4) Update a pet profile

- **Method**: `PUT`
- **Path**: `/pets/:id`
- **Request params/body**:
  - Route params:
    - `id` (string, required)
  - JSON body:
    - Full replacement of editable pet fields:
      - `name`, `species`, `breed`, `age`, `description`, `adopted`, `imageUrl`

```json
{
  "name": "Luna",
  "species": "dog",
  "breed": "Labrador Mix",
  "age": 4,
  "description": "Friendly, energetic, and leash-trained.",
  "adopted": true,
  "imageUrl": "https://example.com/luna-updated.jpg"
}
```

**Success response**
- **Status**: `200 OK`
- **Body**:

```json
{
  "pet": {
    "id": "pet_123",
    "name": "Luna",
    "species": "dog",
    "breed": "Labrador Mix",
    "age": 4,
    "description": "Friendly, energetic, and leash-trained.",
    "adopted": true,
    "imageUrl": "https://example.com/luna-updated.jpg",
    "createdAt": "2026-06-17T15:00:00.000Z",
    "updatedAt": "2026-06-17T15:10:00.000Z"
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
    - `id` (string, required)
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
