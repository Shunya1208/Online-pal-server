
const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');


const router = express.Router();
router.post('/signup', authController.signup);
router.patch('/validUser/:token', authController.varification);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword/:id', authController.updatePassword);
router.patch(
    '/updateMe/:id',
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
);
router.delete('/deleteMe/:id', userController.deleteMe);

router.post('/bookmark/:id', userController.addBookmark);
router.delete('/bookmark/:id', userController.removeBookmark);

router
  .route('/')
  .get(userController.getAllUsers)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;