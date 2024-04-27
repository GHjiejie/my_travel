const express = require("express");
const router = express.Router();
const companionService = require("../../services/companion/index.js");
const multer = require("multer");
const path = require("path");

// 处理上传pdf文件
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/companion_pdfs"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// 处理上传头像
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/companion_avatars"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/guide_product_images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const userCommentImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/user_comment_images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const userReplyImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads/user_reply_images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const uploadPdf = multer({ storage: pdfStorage });
const uploadAvatar = multer({ storage: avatarStorage });
const uploadProductImage = multer({ storage: productImageStorage });
const uploadUserCommentImage = multer({ storage: userCommentImageStorage });
const uploadUserReplyImage = multer({ storage: userReplyImageStorage });
// 上传证书
router.post(
  "/uploadPdf",
  uploadPdf.single("companionpdf"),
  companionService.uploadPdf
);

// 获取所有的申请信息
router.get("/allApply", companionService.getAllApply);

// //根据id获取申请信息
// router.get("/applyById", guideService.getApplyById);

// // 通过导游申请
router.put("/pass", companionService.pass);

// // 拒绝导游申请
router.put("/reject", companionService.reject);

// // 完善导游信息
router.post(
  "/completeInfo",
  uploadAvatar.single("newAvatar"),
  companionService.completeInfo
);

// // 获取所有导游信息
router.get("/getAllCompanion", companionService.getAllCompanion);
// // 根据导游id新增产品
// router.post(
//   "/addProduct",
//   uploadProductImage.array("productPhotos"),
//   guideService.addProduct
// );

// // 根据id获取导游信息
router.get("/getCompanionInfoById", companionService.getCompanionInfoById);

// // 根据id增加导游语种
// router.post("/addLanguage", guideService.addLanguage);

// // 根据id修改语种
// router.post("/updateLanguage", guideService.updateLanguage);

// // 根据id删除导游语种
// router.post("/delLanguage", guideService.deleteLanguage);

// //添加用户评论
// router.post(
//   "/comment",
//   uploadUserCommentImage.array("comment_photos"),
//   guideService.addComment
// );

// //回复用户评论
// router.post(
//   "/reply",
//   uploadUserReplyImage.array("reply_photos"),
//   guideService.replyComment
// );

// //删除用户评论
// router.post("/deleteComment", guideService.deleteComment);

// //删除用户回复
// router.post("/deleteReply", guideService.deleteReply);

// //为评论点赞
// router.post("/likeComment", guideService.likeComment);

module.exports = router;
