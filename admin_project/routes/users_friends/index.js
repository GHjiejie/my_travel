const express = require("express");
const uesrFriendsService = require("../../services/usersFriendsSrrvice/index.js");

const router = express.Router();

// 添加好友
router.post("/", uesrFriendsService.addFriend);

//添加好友申请
router.post("/apply", uesrFriendsService.applyFriend);

// 同意好友申请
router.post("/agree", uesrFriendsService.agreeFriend);

// 删除好友
router.delete("/", uesrFriendsService.deleteFriend);

module.exports = router;
