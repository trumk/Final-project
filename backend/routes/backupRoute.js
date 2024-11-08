const express = require('express');
const router = express.Router();
const { backupDatabase } = require('../controllers/backupController'); 

router.post('/', backupDatabase);

module.exports = router;
