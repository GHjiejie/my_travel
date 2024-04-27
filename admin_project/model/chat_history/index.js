const mongoose = require("mongoose");
const chatHistorySchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  history: [
    {
      // 发送者
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      // 接受者
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      // 发送的消息
      message: {
        type: String,
        required: true,
      },
      // 发送时间
      time: {
        type: String,
      },
      // 发送这头像
      avatar: {
        type: String,
      },
      // 发送者昵称
      username: {
        type: String,
      },
      // 发送的图片集合
      photos: {
        type: Array,
        default: [],
      },
      // 是否是显示时间
      showTime: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const chatHistoryModel = mongoose.model("chathistories", chatHistorySchema);
module.exports = chatHistoryModel;
