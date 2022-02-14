const express = require('express');

const userController = require('../controllers/userController')

const router = express.Router()

router.route('/signup').post(userController.signUp);

router.route('/signin').post(userController.signIn);

router.route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser)



module.exports = router;