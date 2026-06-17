const express = require("express");

const app = express();
app.use(express.json())

const PORT = process.env.PORT || 3000;

let pets = [
  {
    id: 1,
    name: "Luna",
    type: "dog",
    breed: "Labrador Mix",
    age: 3,
    description: "Friendly, energetic, and great with kids.",
    adopted: false,
    imageUrl: "https://example.com/luna.jpg"
  },
  {
    id: 2,
    name: "Mochi",
    type: "cat",
    breed: "Domestic Shorthair",
    age: 2,
    description: "Calm indoor cat who likes quiet spaces.",
    adopted: false,
    imageUrl: "https://example.com/mochi.jpg"
  },
  {
    id: 3,
    name: "Pico",
    type: "bird",
    breed: "Parakeet",
    age: 1,
    description: "Social and chirpy, comfortable with gentle handling.",
    adopted: false,
    imageUrl: "https://example.com/pico.jpg"
  }
];

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Adopt-a-Pet API!" });
});

app.get("/hello-world", (req, res) => {
  res.send("Hello, World!");
});

app.get("/hello-pet", (req, res) => {
  res.send("Hello, Pet!");
});

app.get("/pets", (req, res) => {
  res.status(200).json({ pets });
});

app.get("/pets/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const pet = pets.find((pet) => pet.id === id);

  if (!pet) {
    return res.status(404).json({ error: "Pet not found" });
  }

  res.status(200).json({ pet });
});

app.post("/pets", (req, res) => {
  const { name, type, breed, age, description, adopted, imageUrl } = req.body;

  const newPet = {
    id: pets.length + 1,
    name,
    type,
    breed,
    age,
    description,
    adopted: adopted ?? false,
    imageUrl
  };

  pets.push(newPet);
  res.status(201).json({ pet: newPet });
});

app.put("/pets/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const petIndex = pets.findIndex((pet) => pet.id === id);

  if (petIndex === -1) {
    return res.status(404).json({ error: "Pet not found" });
  }

  const updates = req.body;
  const updatedPet = { ...pets[petIndex], ...updates, id };
  pets[petIndex] = updatedPet;

  res.status(200).json({ pet: updatedPet });
});

app.delete("/pets/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const initialLength = pets.length;
  pets = pets.filter((pet) => pet.id !== id);

  if (pets.length === initialLength) {
    return res.status(404).json({ error: "Pet not found" });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
