const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userServices, authServices, emailServices } = require("../services/index");
const { Token } = require('../models');

/**
 * Create a register 
 */
const register = catchAsync(async (req, res) => {
  try {
    const userData = await userServices.userRegisterServices(req.body);
    // const otp = await otpServices.sendingOtp(userData, res);
    // const token = await tokenServices.generateAuthToken(userData);
    // res.status(httpStatus.CREATED).send({ user: userData, token, otp })
    res.status(httpStatus.CREATED).send({
      code: 200,
      message: 'OTP has been sent to your email'
  })
  } catch (err) {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || 'internal server error'
    })
  }
});

/**
 * user Login functions 
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authServices.userLoginServices(email, password);
    res.send({ user, token })
  } catch (error) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'internal server error'
    })
  }
});

/**
 * user LogOut functions 
 */
const logOut = catchAsync(async (req, res) => {
  try {
    const response = await authServices.logoutServices(req.body.refreshToken);
    if (response) {
      res.send({
        code: 200,
        message: 'user logout successfully'
      });
    }
  } catch (error) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'internal server error'
    })
  }
})

//** refresh tokens */
const refreshTokens = catchAsync(async (req, res) => {
  try {
    const tokens = await authServices.refreshAuthServices(req.body.refreshToken);
    res.send({ ...tokens })
  } catch (error) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'internal server error'
    })
  }
})

//** forget password */
const forgetPassword = catchAsync(async (req, res) => {
  try {
    await authServices.forgetPasswordServices(req.body);
    // res.status(httpStatus.NO_CONTENT).send();
    res.send({
      code: 200,
      message: 'user forget the password send successfully check your mail'
    });
  } catch (error) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'internal server error'
    })
  }
});

//** reset password */
const resetPassword = catchAsync(async (req, res) => {
  try {
    await authServices.resetPasswordServices(req.query.token, req.body.password);
    res.send({
      code: 200,
      message: 'user reset password successfully'
    });
  } catch (error) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'internal server error'
    })
  }
})

//** send email verification */
const sendEmailVerification = catchAsync(async (req, res) => {
  try {
    await emailServices.sendVerificationEmail(verifyEmailToken, req.user);
    res.send({
      code: 200,
      message: 'send email verification please check your email and verified'
    });
  } catch (error) {
    res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message || 'internal server error'
    })
  }

})

//** send verify Email */
const verifyEmail = catchAsync(async (req, res) => {
  try {
    await authServices.verifyEmailServices(req.query.token);
    res.send({
      code: 200,
      message: 'your email verified successfully'
    });
  } catch (err) {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || 'internal server error'
    })
  }
})

const verifyOtp = catchAsync(async (req, res) => {
  try {
    const verified = await otpServices.verifyOtpServices(req.body, res);
    if (verified) {
      res.status(httpStatus.CREATED).send({
        message: "Login successful!"
      });
    }
  } catch (err) {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).send({
      code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || 'internal server error'
    })
  }
})
module.exports = {
  register,
  login,
  logOut,
  refreshTokens,
  forgetPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
  verifyOtp
}