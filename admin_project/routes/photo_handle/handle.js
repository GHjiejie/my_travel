const express = require("express");
const router = express.Router();
const photoHandleService = require("../../services/photoHandleServices/index");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/chat_photos"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// 处理图片上传
router.post("/", upload.array("chatPhotos"), photoHandleService.uploadPhoto);
module.exports = router;
