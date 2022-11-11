import db from "../models";
import bcrypt from "bcryptjs";
import { response } from "express";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      console.log(email);

      let isExist = await checkUserEmail(email);
      if (isExist) {
        //compare password
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password", "firstName", "lastName"],
          where: { email: email },
          raw: true,
        });

        if (user) {
          let check = await bcrypt.compareSync(password, user.password);

          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "user not found";
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage = "your email is not exist";
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = async (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(user);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "all") {
        users = await db.User.findAll({
          attributes: { exclude: ["password"] },
        });
      } else if (userId && userId !== "all") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: { exclude: ["password"] },
        });
      }

      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check email is exist ???
      let check = await checkUserEmail(data.email);
      if (check === false) {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender === "1" ? true : false,
          roleId: data.roleId,
          positionId: null,
        });

        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
      resolve({
        errCode: 1,
        errMessage: "your email is exist",
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "id is required",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });

      console.log(data);

      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;

        await user.save();
        resolve({
          errCode: 0,
          errMessage: "update user successfully",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "user not found",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let softDeleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
        paranoid: true,
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "user not found",
        });
      }

      await db.User.destroy({
        where: { id: id },
        paranoid: true,
      });
      resolve({
        errCode: 0,
        errMessage: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let forceDeleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
        paranoid: false,
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "user not found",
        });
      }

      await db.User.destroy({
        where: { id: id },
        paranoid: false,
        force: true,
      });

      resolve({
        errCode: 1,
        errMessage: "Delete user successfully",
      });
    } catch (error) {
      reject(error);
    }
  });
};

let restoreUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("userId: " + userId);
      let user = await db.User.findOne({
        where: { id: userId },
        paranoid: false,
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "user not found",
        });
      } else {
        await db.User.restore({
          where: { id: userId },
          paranoid: false,
        });
        resolve({
          errCode: 0,
          errMessage: "Restore user successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "missing required parameter",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        // await new Promise((r) => setTimeout(r, 2000));
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin,
  checkUserEmail,
  getAllUsers,
  createNewUser,
  updateUserData,
  softDeleteUser,
  forceDeleteUser,
  restoreUser,
  getAllCodeService,
};
