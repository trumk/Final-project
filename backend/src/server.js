const express = require("express")
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb+srv://nguyentrung2292003:GYCKF3LGpSWUfabU@databases.l0xs9.mongodb.net/Final-project")
  .then(() => {
    console.log("Connected to mongodb!");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });