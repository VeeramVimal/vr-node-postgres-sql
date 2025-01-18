const httpStatus = require("http-status");
const { User, Token } = require("../models");
const ApiError = require("../utils/ApiError");
const userServices = require("./user.service");
const { tokenTypes } = require("../config/tokens");
/**
 * @description Login with email and password
 * @param {string} email
 * @param {string} password
 * @return {Promise<User>} Object
 */
const userLoginServices = async (email, password) => {
  const user = await userServices.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user
}

/**
 * @description Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const logoutServices = async (refreshToken) => {
  const refrestokenDoc = await Token.findOne({
    where: {
      token: refreshToken,
      tokenType: tokenTypes.REFRESH,
      blacklisted: false
    }
  })
  if (!refrestokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  } else {
   
    return  refrestokenDoc.destroy();
  }
}

// /**
//  * @description Refresh auth tokens
//  * @param {string} refreshToken
//  * @returns {Promise<Object>}
//  */
// const refreshAuthServices = async (refreshToken) => {
//   try {
//     const refreshTokenDoc = await tokenServices.verifyToken(refreshToken, tokenTypes.REFRESH);
//     const user = await userServices.getUserById(refreshTokenDoc.userId);
//     if (!user) throw new Error();
//     await refreshTokenDoc.destroy();
//     return tokenServices.generateAuthToken(user)
//   } catch (error) {
//     throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
//   }
// }
/**
 * @description forget Password using user email
 * @param {string} email
 * @return {Promise<User>} Object
 */
const forgetPasswordServices = async (body) => {
  const user = await userServices.getUserByEmail(body.email);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
}
/**
 * @description reset Password using request params query
 * @param {Query<string>} token 
 * @param {String<UserId>} UserId 
 * @return {Promise<User>} Object
 */
const resetPasswordServices = async (resetPasswordToken, newPassword) => {
  try {
    const user = await userServices.getUserById(resetPasswordTokenDoc.userId);
    if (!user) throw new Error();
    await userServices.updateUserById(user.id, { password: newPassword });
    await Token.destroy({ where: { userId: user.id, tokenType: tokenTypes.RESET_PASSWORD } });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
}


module.exports = {
  userLoginServices,
  logoutServices,
  forgetPasswordServices,
  resetPasswordServices,
  
}