const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const usersAlbumServices = require("../../services/usersAlbumServices/index");
const storage = multer.diskStorage({
  // 存储路径
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/album"));
  },
  // 文件名
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 添加用户图片
router.post("/", upload.array("photos"), usersAlbumServices.addUserPhoto);

// 获取用户图片
router.get("/", usersAlbumServices.getUserPhoto);

// 根据id删除用户图片
router.delete("/", usersAlbumServices.deleteUserPhoto);

module.exports = router;
