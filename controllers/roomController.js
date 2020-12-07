const Room = require('./../models/roomModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');


exports.createRoom = async (req, res, next) => {
    let room = await Room.findOne(req.body);
    let already = true;
    
    if (!room) {
        room = await Room.create(req.body);
        already = false;
    }
        res.status(201).json({
            status: 'success',
            data: {
              room,
              already
            }
          });
  }

exports.deleteRoom = async (req, res, next) => {
    await Room.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
          });
  }


exports.getMyRooms = async (req, res, next) => {
    const data = await Room.find({ participants: req.params.id }).populate("participants").sort('-createdAt');

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: data.length,
      data: {
        data
      }
    });
  }

exports.updateRoom = factory.updateOne(Room);

