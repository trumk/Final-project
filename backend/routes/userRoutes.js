const express = require("express");
const multer = require("multer");
const { getAllUser, getOneUser, updateProfile } = require("../controllers/userController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getAllUser); 
router.get("/:id", getOneUser); 
router.put('/:id', upload.single('avatar'), updateProfile);

module.exports = router;
