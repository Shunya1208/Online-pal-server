const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {

    if (!req.file) return next();
  
    req.file.filename = `user-${req.params.id}-${Date.now()}.jpeg`;
  
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);
  
    next();
});

const filterObj = (obj,allowedList) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
      if (allowedList.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }
  
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const allowedList = ['name',"birth","gender","country","native","summary","hobby","learning"]
    const filteredBody = filterObj(req.body, allowedList);

    if (req.file) 
    filteredBody.photo = req.file.filename;

  
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {new: true});

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.addBookmark = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    user.bookmark.push(req.body.id);

    await user.save();
  
    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    });
});

exports.removeBookmark = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    console.log(req)
    user.bookmark.splice(user.bookmark.indexOf(req.body.id),1);

    await user.save();
  
    res.status(204).json({
      status: 'success',
      data: null
    });
});

exports.getUser = factory.getOne(User,"bookmark");
exports.getAllUsers = factory.getAll(User);

exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);