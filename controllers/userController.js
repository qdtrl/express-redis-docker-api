const User = require("../models/userModel");
const bcrypt = require('bcryptjs');

exports.signIn = async (req, res, next) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      })
    }
    const correctPassword = await bcrypt.compare(password, user.password);
    if (correctPassword) {
      // req.session.user = user;
      res.status(201).json({
        status: 'connect',
        data: {
          user
        }
      })
    } else {
      res.status(400).json({
        status: `fail`,
        message: 'Incorrect password'
      })
    }
  } catch (e) {
    res.status(400).json({
      status: `fail ${e}`,
    })
  }
}

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      password: hashPassword
    });

    // req.session.user = user;
    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    })
  } catch (e) {
    res.status(400).json({
      status: `fail ${e}`,
    })
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    })
  } catch (e) {
    res.status(400).json({
      status: `fail ${e}`,
    })
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
    })
  } catch (e) {
    res.status(400).json({
      status: `fail ${e}`,
    })
  }
}