const Message = require('./../models/messageModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');


exports.createMessage = factory.createOne(Message);

exports.getAllMessages = async (req, res, next) => {
    const data = await Message.find({room:req.params.id}).populate("room").sort('+timestamp');

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: data.length,
      data: {
        data
      }
    });
}

exports.deleteAllMessages = async (req, res, next) => {
  const data = await Message.deleteMany({room:req.params.id});

  // SEND RESPONSE
  res.status(204).json({
    status: 'success',
    data: null
  });
}


