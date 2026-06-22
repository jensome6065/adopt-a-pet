const request = require("supertest");
const { app, prisma } = require("../app");

const createdPetIds = new Set();

function makePetData(overrides = {}) {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  return {
    name: `Test Pet ${unique}`,
    type: "dog",
    breed: "Mixed",
    age: 2,
    description: "Friendly test pet",
    adopted: false,
    imageUrl: "https://example.com/test-pet.jpg",
    ...overrides
  };
}

async function seedPet(overrides = {}) {
  const pet = await prisma.pet.create({
    data: makePetData(overrides)
  });
  createdPetIds.add(pet.id);
  return pet;
}

afterEach(async () => {
  const ids = [...createdPetIds];
  if (ids.length > 0) {
    await prisma.pet.deleteMany({
      where: { id: { in: ids } }
    });
    createdPetIds.clear();
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /pets", () => {
  it("returns 200 with pets array", async () => {
    await seedPet();

    const res = await request(app).get("/pets");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("pets");
    expect(Array.isArray(res.body.pets)).toBe(true);
  });
});

describe("GET /pets/:id", () => {
  it("returns 200 with a single pet object", async () => {
    const pet = await seedPet();

    const res = await request(app).get(`/pets/${pet.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("pet");
    expect(res.body.pet.id).toBe(pet.id);
  });

  it("returns 404 for an invalid id", async () => {
    const res = await request(app).get("/pets/not-a-number");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Pet not found");
  });
});

describe("POST /pets", () => {
  it("returns 201 with created pet including id", async () => {
    const payload = makePetData({ type: "cat", age: 1 });

    const res = await request(app).post("/pets").send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("pet");
    expect(res.body.pet).toHaveProperty("id");
    expect(typeof res.body.pet.id).toBe("number");
    createdPetIds.add(res.body.pet.id);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app).post("/pets").send({
      type: "dog",
      age: 3
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});

describe("PUT /pets/:id", () => {
  it("returns 200 with updated pet object", async () => {
    const pet = await seedPet({ name: "Before Update" });

    const res = await request(app)
      .put(`/pets/${pet.id}`)
      .send({ name: "After Update" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("pet");
    expect(res.body.pet.id).toBe(pet.id);
    expect(res.body.pet.name).toBe("After Update");
  });
});

describe("DELETE /pets/:id", () => {
  it("returns 204 for successful delete", async () => {
    const pet = await seedPet();

    const res = await request(app).delete(`/pets/${pet.id}`);
    createdPetIds.delete(pet.id);

    expect(res.statusCode).toBe(204);
    expect(res.text).toBe("");
  });
});
