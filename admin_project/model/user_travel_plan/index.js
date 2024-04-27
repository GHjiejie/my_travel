const mongoose = require("mongoose");

const usertravelPanlSchema = new mongoose.Schema({
  // 对应用户id:
  userId: {
    type: String,
    required: true,
  },
  // 旅游计划标题
  travelTitle: {
    type: String,
    required: true,
  },
  // 当前城市
  currentCity: {
    type: String,
    required: true,
    default: "北京",
  },
  // 目的城市
  destinationCity: {
    type: String,
    required: true,
    default: "南京",
  },

  // 出发时间
  departureTime: {
    type: String,
    required: true,
    default: "2021-07-01",
  },
  // 返回时间
  returnTime: {
    type: String,
    required: true,
    default: "2021-07-10",
  },
  // 出行人数
  numberOfPeople: {
    type: Number,
    required: true,
    default: 1,
  },

  // 出行人员联系方式
  contactInformation: {
    type: String,
    required: true,
  },
  // 出行人员备注
  remarks: {
    type: String,
    default: "无",
  },
  // 计划创建时间
  createTime: {
    type: String,
    required: true,
  },
  // 计划更新时间
  updateTime: {
    type: String,
  },
  // 计划状态:
  isAchieved: {
    type: Boolean,
    default: false,
  },
});

const userTravelPlanModel = mongoose.model(
  "userTravelPlans",
  usertravelPanlSchema
);

module.exports = userTravelPlanModel;
