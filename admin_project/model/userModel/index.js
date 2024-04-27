const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  //用户名
  username: String,
  //用户密码
  password: String,
  //用户头像
  avatar: {
    type: String,
    default: "http://127.0.0.1:3000/images/default.jpg",
  },
  // 出生日期
  birthday: {
    type: Date,
    default: new Date("2000-01-01").toLocaleString(),
  },
  // 用户性别
  sex: {
    type: String,
    default: "男",
  },
  // 用户年龄
  age: {
    type: Number,
    default: 18,
  },
  // 个性标签
  tags: {
    type: Array,
    default: ["帅气", "有趣", "阳光", "活泼", "开朗", "热情"],
  },
  // 个性签名
  signature: {
    type: String,
    default: "这个人很懒，什么都没有留下~",
  },
  // 兴趣爱好
  hobbies: {
    type: Array,
    default: ["唱", "跳", "rap", "篮球"],
  },
  // 受教育程度
  education: {
    type: String,
    default: "本科",
  },
  // 用户状态、
  status: {
    type: String,
    default: "正常",
  },
  // 用户简介
  introduction: {
    type: String,
    default:
      "全民制作人大家好，我是练习时长两年半的个人练习生蔡徐坤喜欢唱跳rap篮球",
  },
  // 用户手机号
  phone: {
    type: String,
    default: "12345678910",
  },
  //用户邮箱
  email: {
    type: String,
    default: "123456@qq.com",
  },
  //用户QQ
  qq: {
    type: String,
    default: "123456",
  },
  //用户微信
  wechat: {
    type: String,
    default: "12345655665",
  },
  // 用户角色
  role: {
    type: String,
    default: "normal",
  },

  // 当前的城市
  currentCity: {
    type: String,
    default: "北京",
  },

  // 详细地址
  address: {
    type: String,
    default: "北京市昌平区",
  },

  // 用户好友信息列表，用于存储好友的ID
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "friends",
    },
  ],
  // 好友申请列表
  applyList: {
    type: Array,
    default: [],
  },
  // 个人动态
  dynamic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserDynamic",
    },
  ],
  // 旅游计划
  travelPlan: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userTravelPlans",
    },
  ],
  // 私人相册
  privateAlbum: [
    {
      path: {
        type: String,
        default: "/images/default.jpg",
      },
    },
  ],
  // 我的订单
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
  ],
  // 用户创建时间
  createTime: {
    type: Date,
    default: Date.now,
  },
  // 用户更新时间
  updateTime: {
    type: Date,
    default: Date.now,
  },
  // 用户旅游证书路径
  isGuide: {
    type: Boolean,
    default: false,
  },
  // 是否是陪玩
  isCompanion: {
    type: Boolean,
    default: false,
  },
  // 陪玩号
  companionNumber: {
    type: String,
  },
  // 用户权限 0: 正常 1:被禁言 2:被封号
  uesrPermission: {
    type: Number,
    default: 0,
  },
  // 导游号
  guideNumber: {
    type: String,
  },
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
