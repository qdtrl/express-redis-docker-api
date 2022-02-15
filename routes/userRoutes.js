const express = require('express');

const userController = require('../controllers/userController')
const protect = require('../middleware/authMiddleware');

const router = express.Router()

router.route('/signup').post(userController.signUp);

router.route('/signin').post(userController.signIn);

router.route('/:id')
  .patch(protect, userController.updateUser)
  .delete(protect, userController.deleteUser)



module.exports = router;