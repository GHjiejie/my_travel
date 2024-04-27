const userController = require("../../controller/userController/index");
const multer = require("multer");
const path = require("path");
const returnResult = require("../../utils/return_result");
const JWT = require("../../utils/jwt");

const userService = {
  // 用户注册功能
  registerUser: async (req, res) => {
    const { username, password } = req.body;
    // 首先验证用户是否存在
    const verifyResult = await userController.verifyUser_username(username);
    // console.log("verifyResult", verifyResult);

    if (verifyResult) {
      // 用户已存在
      res.json(returnResult.userHasExist());
    } else {
      // 用户不存在，直接向数据库插入数据
      const result = await userController.addUser(username, password);
      if (result) {
        // 设置token
        const token = JWT.generateToken({
          username,
          password,
        });
        res.header("authorization", token);

        res.json(returnResult.success(result));
      } else {
        res.json(returnResult.fail());
      }
    }
  },
  // 用户登录
  loginUser: async (req, res) => {
    const { username, password } = req.body;
    // console.log("username", username);
    // console.log("password", password);
    const result = await userController.verifyUser_all(username, password);
    // console.log("verifyUser_all", result);
    if (result) {
      // console.log("result", result);
      const token = JWT.generateToken({
        username,
        password,
      });
      res.header("authorization", token);
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.accountOrPasswordError());
    }
  },
  // 根据用户id获取用户信息
  getUserInfoById: async (req, res) => {
    const { id } = req.query;
    const result = await userController.getUserInfoById(id);
    // console.log("result", result);
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },

  // 根据用户id更新用户信息
  updateUserInfoById: async (req, res) => {
    const { id } = req.query;
    const data = req.body;
    // 首先判断是否有文件上传
    if (req.file) {
      // 有文件上传
      const newAvatarPath = req.file.filename;
      const avatar = `http://127.0.0.1:3000/uploads/${newAvatarPath}`;
      const newdata = {
        ...data,
        avatar,
      };
      // 我们使用变量提升来将result提升到作用域顶部
      var result = await userController.updateUserInfoById(id, newdata);
    } else {
      // 没有文件上传
      var result = await userController.updateUserInfoById(id, data);
    }
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },

  // 获取所有用户信息（除自己外）
  getAllUsers: async (req, res) => {
    const { id, pageSize, currentPage } = req.query;
    const skipNumber = (Number(currentPage) - 1) * Number(pageSize);

    const result = await userController.getAllUsers(id, pageSize, skipNumber);
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },
  // 获取所有用户信息
  getAll: async (req, res) => {
    // console.log("getAll");
    const result = await userController.getAll();
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },
  // 获取所有导游信息
  getAllGuides: async (req, res) => {
    const result = await userController.getAllGuides();
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },
  // 举报用户
  reportUser: async (req, res) => {
    const { reported_user_id, report_reason, reporter_user_id } = req.body;
    const result = await userController.reportUser(
      reported_user_id,
      report_reason,
      reporter_user_id
    );
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },
};

module.exports = userService;
