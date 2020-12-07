const Message = require('./../models/messageModel');
const factory = require('./handlerFactory');


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


