const express = require('express');
const messageController = require('./../controllers/messageController');

const router = express.Router();

router
  .route('/')
  .post(messageController.createMessage)

router
  .route('/:id')
  .get(messageController.getAllMessages)
  .delete(messageController.deleteAllMessages)

module.exports = router;
