const express = require('express');
const roomController = require('./../controllers/roomController');

const router = express.Router();

router
  .route('/')
  .post(roomController.createRoom)
  

router
  .route('/:id')
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom)
  .get(roomController.getMyRooms)


module.exports = router;
