const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Adopt-a-Pet API!" });
});

app.get("/hello-world", (req, res) => {
  res.send("Hello, World!");
});

app.get("/hello-pet", (req, res) => {
  res.send("Hello, Pet!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
