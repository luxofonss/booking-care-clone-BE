import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      errMessage: "Missing inputs parameters!",
    });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; //?all || ?id
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  console.log(req.body);
  let message = await userService.createNewUser(req.body);
  console.log(message);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

let handleSoftDeleteUser = async (req, res) => {
  if (!req.query.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
    });
  }
  let message = await userService.softDeleteUser(req.query.id);
  return res.status(200).json({
    message,
  });
};

let handleForceDeleteUser = async (req, res) => {
  let id = req.body.id;
  if (!id) {
    res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
    });
  }

  let message = await userService.forceDeleteUser(id);
  return res.status(200).json({
    message,
  });
};

let handleRestoreUser = async (req, res) => {
  let id = req.query.id;
  if (!id) {
    res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
    });
  } else {
    let message = await userService.restoreUser(id);
    return res.status(200).json({
      message,
    });
  }
};

let getAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (error) {
    console.log("get allcodes error", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from sever",
    });
  }
};

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleSoftDeleteUser,
  handleForceDeleteUser,
  handleRestoreUser,
  getAllCode,
};
