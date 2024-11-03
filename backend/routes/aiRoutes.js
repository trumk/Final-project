const express = require('express');
const { generatePrompt } = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', generatePrompt); 

module.exports = router;