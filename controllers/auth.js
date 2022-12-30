const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../util/errorResponse');
const sendEmail = require('../util/sendEmail');
const User = require('../models/User');
// const { send } = require('express/lib/response');

// @Descrition register user
// @route  Post /api/v1/auth/register
// @access public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({ name, email, password, role });

  sendTokenResponse(user, 200, res);

  // const token = user.getSignedJwtToken();
  // res.status(200).json({ success: true, token });
});

// @Descrition login user
// @route  Post /api/v1/auth/login
// @access public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse(`Please provide email and password`, 400));
  }

  //user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse(`Invalid credetials`, 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse(`invalid credetials`, 401));
  }

  sendTokenResponse(user, 200, res);
  // const token = user.getSignedJwtToken();

  // res.status(200).json({ success: true, token });
});

// @Descrpition log user out/ clear cookie
// @route  Post /api/v1/auth/logout
// @access private

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none',{
    expires: new Date(Date.now()  + 10 * 1000),
    httpOnly: true,
  })

  res.status(200).json({ success: true, data:{}});
});

// @Descrpition forgotpassword
// @route  Post /api/v1/auth/forgotpassword
// @access private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// @Descrpition  update password
// @route  Put /api/v1/auth/updatepassword
// @access private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const {currentPassword, newPassword} = req.body;
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse(`Password is incorrect`, 401));
  }
  console.log(currentPassword, newPassword)

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
// @Descrpition update user
// @route  Put /api/v1/auth/updatedetails
// @access private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @Description forgot password
// @route  Post /api/v1/auth/forgotpassword
// @access public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('The is no user with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

 
  const message = `You are receiving this
   email because you requested the reset of
   a pasword. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }

  // res.status(200).json({ success: true, data: user });
});

// @Descrpition  Reset password
// @route  Put /api/v1/auth/resetpaswword/:resettoken
// @access public

exports.resetPassword = asyncHandler(async (req, res, next) => {
 
  
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('-role');
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create coockie and get response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
