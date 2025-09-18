const express = require('express');
const { authUserMiddleware } = require('../middlewares/auth.middleware');
const { createChatController, getChats, deleteChatController, getMessagesController } = require('../controllers/chat.controller');
const router = express.Router();

router.post('/', authUserMiddleware, createChatController);
router.get('/', authUserMiddleware, getChats);
router.get('/:chatId', authUserMiddleware, getMessagesController)
router.delete('/:chatId', authUserMiddleware, deleteChatController);


module.exports = router;
