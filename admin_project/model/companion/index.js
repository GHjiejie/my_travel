const mongoose = require("mongoose");
const companionSchema = new mongoose.Schema({
  // 陪玩者姓名
  username: {
    type: String,
    default: "初级陪玩者",
  },
  userId: {
    type: String,
    required: true,
  },
  // 陪玩者性别
  sex: {
    type: String,
    default: "男",
  },
  // 陪玩者头像
  avatar: {
    type: String,
    default: "http://127.0.0.1:3000/images/default.jpg",
  },
  // 申请的pdf路径
  certificate: {
    type: String,
  },

  // 申请时间
  applyTime: {
    type: String,
    default: "2021-01-01",
  },
  // 是否通过
  isPass: {
    type: Boolean,
    default: false,
  },
  // 通过时间
  passTime: {
    type: String,
    default: "2021-01-01",
  },
  //  是否被审查
  isCheck: {
    type: Boolean,
    default: false,
  },
  // 审查意见
  passOpinion: {
    type: String,
    default: "无",
  },
  // 通过人
  passPerson: {
    type: String,
    default: "admin",
  },
  // 通过人电话
  passPersonPhone: {
    type: String,
    default: "12345678910",
  },
  // 陪玩者的陪玩照片
  photos: [
    {
      type: String,
    },
  ],
  // 用户评价
  comment: [
    {
      type: Object,
    },
  ],
  // 陪玩者年龄
  age: {
    type: Number,
    default: 18,
  },
  // 陪玩者语言
  language: {
    type: Array,
    default: ["中文"],
  },
  // 陪玩者电话
  phone: {
    type: String,
    default: "12345678910",
  },
  // 陪玩者地址
  address: {
    type: String,
    default: "北京",
  },
  // 陪玩者简介
  introduce: {
    type: String,
    default: "这个人很懒，什么都没有留下...",
  },
  // 陪玩者服务
  service: {
    type: Array,
    default: ["聊天", "游戏", "看电影"],
  },
  // 陪玩者价格
  price: {
    type: Number,
    default: 999,
  },
  // 陪玩者评分
  score: {
    type: Number,
    default: 5,
  },
  // 陪玩者状态
  status: {
    type: String,
    default: "空闲",
  },
  // 陪玩者创建时间
  create_time: {
    type: Date,
    default: Date.now,
  },
});
const CompanionModel = mongoose.model("Companions", companionSchema);
module.exports = CompanionModel;
