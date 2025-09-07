const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth.middleware');
const { createChatController } = require('../controllers/chat.controller');
const router = express.Router();

router.post('/', authUserMiddleware, createChatController);


module.exports = router;
