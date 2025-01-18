const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");


const isEmailTaken = async (email) => {
    const user = await User.findOne({ where: { email } });
    return !!user
}

/**
 * @description Get all user details 
 * @param {empty} 
 * @returns {Promise<User>} ArrayOfObject
 */
// const getAllUserServices = async (query) => {
//     const user = await User.findAll({ attributes: {
//         exclude: ["createdBy", "createdAt", "updatedBy", "updatedAt"]
//     }});
//     return user
// }


const getAllUserServices = async (query) => {
    const users = await User.findAndCountAll(query);
    return users
}

/**
 * @description Create a new user
 * @param {Object} userBody
 * @returns {Promise<User>} Object
 */
 const userCreateServices = async (userBody) => {
    userBody.createdBy = 0
    if (await isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User already registered!");
    }
    return User.create(userBody)
}

/**
 * @description Register functionality
 * @param {Object} userBody
 * @returns {Promise<User>} Object
 */
const userRegisterServices = async (userBody) => {
    userBody.createdBy = 0
    if (await isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User already registered!");
    }
    return User.create(userBody)
}

/**
* @description Get SinglePackage by userId
* @param {ObjectId<string} userId
* @returns {Promise<User>}
*/
const getUserById = async (userId) => {
    return User.findByPk(userId);
}

/**
 * @description Get user by email
 * @param {string} email
 * @returns {Promise<User>} Object
 */
const getUserByEmail = async (email) => {
    return User.findOne({ where: { email } })
}

/**
 * @description Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if(updateBody.email && (await getUserByEmail(updateBody.email))){
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');  
    }
    Object.assign(user, updateBody);
    await user.save();
    return user
}
/**
 * @description Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.destroy();
    return user
}
module.exports = {
    getAllUserServices,
    userCreateServices,
    userRegisterServices,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById
}