const express = require("express");
const router = express.Router();
const usersDynamicsService = require("../../services/usersDynamicsService/index.js");
const path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/user_dynamics_photos"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 添加用户动态
router.post(
  "/",
  upload.array("updatesPhotos"),
  usersDynamicsService.addUserDynamic
);

// 获取用户动态
router.get("/", usersDynamicsService.getUserDynamic);

// 删除用户动态
router.delete("/:id", usersDynamicsService.deleteUserDynamic);

// 更新动态权限
router.put("/:id", usersDynamicsService.updateUserDynamic);

// 获取公开的用户动态
router.get("/public", usersDynamicsService.getPublicUserDynamic);
module.exports = router;
