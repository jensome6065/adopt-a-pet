const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

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

app.get("/pets", async (req, res) => {
  const pets = await prisma.pet.findMany();
  res.status(200).json({ pets });
});

app.get("/pets/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(404).json({ error: "Pet not found" });
  }

  const pet = await prisma.pet.findUnique({
    where: { id }
  });

  if (!pet) {
    return res.status(404).json({ error: "Pet not found" });
  }

  res.status(200).json({ pet });
});

app.post("/pets", async (req, res) => {
  const { name, type, breed, age, description, adopted, imageUrl } = req.body;
  const validationErrors = validatePetPayload(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Invalid pet data: name, type, age, and description are required"
    });
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
  } catch (error) {
    res.status(400).json({
      error: "Invalid pet data: name, type, age, and description are required"
    });
  }
});

app.put("/pets/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(404).json({ error: "Pet not found" });
  }

  const { id: _ignoredId, ...updates } = req.body;
  const validationErrors = validatePetPayload(updates, true);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: "Invalid update data: provide at least one updatable field with valid values"
    });
  }

  try {
    const updatedPet = await prisma.pet.update({
      where: { id },
      data: updates
    });
    res.status(200).json({ pet: updatedPet });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Pet not found" });
    }
    throw error;
  }
});

app.delete("/pets/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(404).json({ error: "Pet not found" });
  }

  try {
    await prisma.pet.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Pet not found" });
    }
    throw error;
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
