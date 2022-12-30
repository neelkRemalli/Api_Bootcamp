const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../util/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // else if(req.cookies.token){
  //   // Set token from cookie
  //   token = req.cookies.token;  
  // }

  // Make sure token exits
  if (!token) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
});

// Grand access to specific roles

exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `user role ${req.user.role} is not authorize to access this route`
        )
      );
    }
    next();
  };

// exports.protects = asyncHandler(async (req, res, next) => {
//   let token;
//   if (
//     (req.headers.authorization && req,
//     headers.authorization.startsWith('Bearer'))
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }
//   if(!token){
//     return next(new ErrorResponse('Not allowed to access this route', 401))
//   }
//   try {
//      const decoded = jwt.verify(token, process.env.JWT_SECRET);
//      req.user = await User.findById(decoded.id)
//     next()
    
//   } catch (error) {
//     return next(new ErrorResponse('Not allowed to access this route', 401))
//   }
// });


