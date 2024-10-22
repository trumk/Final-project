const express = require('express');
const { getAIResponseWithUserData } = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', getAIResponseWithUserData); 

module.exports = router;
