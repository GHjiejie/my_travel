const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
  // 用户id
  userId: String,
  // 用户名
  username: String,
  // 证书路径
  certificate: String,
  //审核结果
  isPass: {
    type: Boolean,
    default: false,
  },
  // 申请时间
  applyTime: {
    type: String,
  },
  // 审核时间
  passTime: {
    type: String,
  },
  // 审核状态
  passStatus: {
    type: Number,
    default: 0,
  },
  // 审核人
  passPerson: {
    type: String,
  },
  // 审核人联系方式
  passPersonPhone: {
    type: String,
  },
  // 审核意见
  passOpinion: {
    type: String,
  },
});

const guideModel = mongoose.model("guides", guideSchema);
module.exports = guideModel;
