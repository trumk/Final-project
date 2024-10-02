const express = require("express");
const { getAllUser, getOneUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUser); 
router.get("/:id", getOneUser); 

module.exports = router;
