const express = require("express");
const router = express.Router();
const chat = require("../../chatRoom/saveChatContent");

// 获取历史聊天记录
router.get("/history", chat.getChatHistory);

module.exports = router;
