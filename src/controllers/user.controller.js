const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userServices } = require('../services');
const util = require('../utils');
const pick = require("../utils/pick");
/**
 * Create a user 
 */
const userCreated = catchAsync(async (req, res) => {
  try {
    const userData = await userServices.userCreateServices(req.body);
    res.status(httpStatus.CREATED).send({
      code: 200,
      message: 'OTP has been sent to your email'
  })
  } catch (err) {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || 'internal server error'
    })
  }
});

/**
 * getAll user Details 
 */
// const getAllUsers = catchAsync(async (req, res) => {
//   const user = await userServices.getAllUserServices()
//   res.send({ user })
// })

const getAllUsers = catchAsync(async (req, res) => {
  const page = util.parser.tryParseInt(req.query.page, 10);
  const limit = util.parser.tryParseInt(req.query.limit, 0);
  const offset = 0 + (page - 1) * limit;
  try {
    const query = {
      offset,
      limit,
      order: [['id', 'ASC']],
      attributes: { exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"] }
    }
    const result = await userServices.getAllUserServices(query);
    res.send(util.response.paging(result, page, limit))
  } catch (err) {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || 'internal server error'
    })
  }
})


//** get by user Id */
const getUser = catchAsync(async (req, res) => {
  try {
    const user = await userServices.getUserById(req.params.userId);
    res.send(user)
  } catch (err) {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || 'internal server error'
    })
  }
})

//** Update the user details */
const updateUserDetail = catchAsync(async (req, res) => {
  try {
    const userData = await userServices.updateUserById(req.params.userId, req.body);
    res.send({ user: userData })
  } catch (err) {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || 'internal server error'
    })
  }
})

//** Delete user data */
const deleteUser = catchAsync(async (req, res) => {
  try {
    await userServices.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send()
  } catch (err) {
    res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
      code: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      message: err.message || 'internal server error'
    })
  }
})
module.exports = {
  userCreated,
  getAllUsers,
  getUser,
  updateUserDetail,
  deleteUser
};
