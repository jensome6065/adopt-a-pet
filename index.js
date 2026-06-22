const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient()
const { ValidationError, NotFoundError } = require("./middleware/CustomErrors");

const express = require("express");

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000;
const allowedPetTypes = ["dog", "cat", "bird", "other"];
const updatableFields = ["name", "type", "breed", "age", "description", "adopted", "imageUrl"];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function validatePetPayload(payload, isUpdate = false) {
  const errors = [];

  if (isUpdate) {
    const providedFields = Object.keys(payload);
    if (providedFields.length === 0) {
      errors.push("At least one updatable field is required");
      return errors;
    }

    const hasInvalidField = providedFields.some((field) => !updatableFields.includes(field));
    if (hasInvalidField) {
      errors.push("Request body contains non-updatable fields");
      return errors;
    }
  } else {
    if (!isNonEmptyString(payload.name)) errors.push("name");
    if (!allowedPetTypes.includes(payload.type)) errors.push("type");
    if (!Number.isInteger(payload.age) || payload.age < 0) errors.push("age");
    if (!isNonEmptyString(payload.description)) errors.push("description");
  }

  if ("name" in payload && !isNonEmptyString(payload.name)) errors.push("name");
  if ("type" in payload && !allowedPetTypes.includes(payload.type)) errors.push("type");
  if ("age" in payload && (!Number.isInteger(payload.age) || payload.age < 0)) errors.push("age");
  if ("description" in payload && !isNonEmptyString(payload.description)) errors.push("description");
  if ("breed" in payload && payload.breed !== null && typeof payload.breed !== "string") errors.push("breed");
  if ("imageUrl" in payload && payload.imageUrl !== null && typeof payload.imageUrl !== "string") errors.push("imageUrl");
  if ("adopted" in payload && typeof payload.adopted !== "boolean") errors.push("adopted");

  return [...new Set(errors)];
}

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Adopt-a-Pet API!" });
});

app.get("/hello-world", (req, res) => {
  res.send("Hello, World!");
});

app.get("/hello-pet", (req, res) => {
  res.send("Hello, Pet!");
});

app.get("/pets", async (req, res, next) => {
  try {
    const pets = await prisma.pet.findMany();
    res.status(200).json({ pets });
  } catch (err) {
    next(err);
  }
});

app.get("/pets/:id", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    throw new NotFoundError("Pet not found");
  }

  try {
    const pet = await prisma.pet.findUnique({
      where: { id }
    });

    if (!pet) {
      throw new NotFoundError("Pet not found");
    }

    res.status(200).json({ pet });
  } catch (err) {
    next(err);
  }
});

app.post("/pets", async (req, res, next) => {
  const { name, type, breed, age, description, adopted, imageUrl } = req.body;
  const validationErrors = validatePetPayload(req.body);
  if (validationErrors.length > 0) {
    throw new ValidationError("Invalid pet data: name, type, age, and description are required");
  }

  try {
    const newPet = await prisma.pet.create({
      data: {
        name,
        type,
        breed,
        age,
        description,
        adopted: adopted ?? false,
        imageUrl
      }
    });

    res.status(201).json({ pet: newPet });
  } catch (err) {
    next(err);
  }
});

app.put("/pets/:id", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    throw new NotFoundError("Pet not found");
  }

  const { id: _ignoredId, ...updates } = req.body;
  const validationErrors = validatePetPayload(updates, true);
  if (validationErrors.length > 0) {
    throw new ValidationError("Invalid update data: provide at least one updatable field with valid values");
  }

  try {
    const updatedPet = await prisma.pet.update({
      where: { id },
      data: updates
    });
    res.status(200).json({ pet: updatedPet });
  } catch (err) {
    if (err.code === "P2025") {
      return next(new NotFoundError("Pet not found"));
    }
    next(err);
  }
});

app.delete("/pets/:id", async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    throw new NotFoundError("Pet not found");
  }

  try {
    await prisma.pet.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return next(new NotFoundError("Pet not found"));
    }
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err instanceof ValidationError || err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "A unique constraint violation occurred." });
    }
  }

  return res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
