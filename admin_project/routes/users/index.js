const express = require("express");
const path = require("path");
const route = express.Router();
const userService = require("../../services/usersService/index");
const multer = require("multer");

// 设置用户头像上传路径
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 处理有头像的用户注册
// route.post(
//   "/users/register/_with_avatar",
//   upload.single("avatar"),
//   userService.addUser
// );

// 用户注册
// route.post("/users/register", userService.registerUser);
route.post("/register", userService.registerUser);

// 用户登录
// route.post("/users/login", userService.loginUser);
route.post("/login", userService.loginUser);

//根据用户id获取用户信息
// route.get("/users", userService.getUserInfoById);
route.get("/", userService.getUserInfoById);

// 更新用户信息
// route.put("/users", upload.single("newAvatar"), userService.updateUserInfoById);
route.put("/", upload.single("newAvatar"), userService.updateUserInfoById);

// 获取所有用户信息(除自己外)(用于添加好友)
route.get("/all", userService.getAllUsers);

//获取所有用户信息
route.get("/allusers", userService.getAll);

//获取所有导游的信息
route.get("/allguides", userService.getAllGuides);

//举报用户
route.post("/report", userService.reportUser);

module.exports = route;
