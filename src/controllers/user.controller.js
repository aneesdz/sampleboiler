const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, stripeService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const { name, email } = req.body
 /* const stripeUser = await stripeService.createCustomer(name, email);
  req.body.stripeId = stripeUser.id;*/
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const userOld = await userService.getUserById(req.params.userId);
  if (!userOld) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const name = req.body.name || userOld.name;
  const email = req.body.email || userOld.email;
 // await stripeService.updateCustomer(userOld.stripeId, name, email);
  const user = await userService.updateUser(userOld, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  await userService.deleteUserById(req.params.userId);
 // if(user.stripeId) await stripeService.deleteCustomer(user.stripeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
