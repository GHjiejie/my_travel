const mongoose = require("mongoose");

const userDynamicSchema = new mongoose.Schema({
  currentUserAvatar: {
    type: String,
    default: "http://127.0.0.0.1:3000/images/default.jpg",
  },
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  // 存放路径的数组
  photos: [
    {
      path: {
        type: String,
      },
    },
  ],
  // 用户评论数组
  comments: [
    {
      commentsUserAvatar: {
        type: String,
        default: "/images/default.jpg",
      },
      userId: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createTime: {
        type: String,
        default: new Date().toLocaleString(),
      },
    },
  ],
  // 浏览量
  view: {
    type: Number,
    default: 0,
  },
  // 点赞量
  like: {
    type: Number,
    default: 0,
  },
  // 转发量
  forward: {
    type: Number,
    default: 0,
  },

  // 用户权限
  isPublic: {
    type: Boolean,
    default: true,
    required: true,
  },
  // 动态创建时间
  createTime: {
    type: String,
    default: new Date().toLocaleString(),
  },
});

const UserDynamicModel = mongoose.model("UserDynamic", userDynamicSchema);

module.exports = UserDynamicModel;
