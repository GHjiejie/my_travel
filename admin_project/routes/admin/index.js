const express = require("express");
const path = require("path");
const router = express.Router();
const adminService = require("../../services/adminService/index");

// 管理员登录
router.post("/login", adminService.login);

// 管理员注册
router.post("/register", adminService.register);

module.exports = router;
