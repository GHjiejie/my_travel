const userModel = require("../../model/userModel/index.js");
const userTravelPlanModel = require("../../model/user_travel_plan/index.js");
const userReportModel = require("../../model/user_report/index.js");

const userController = {
  // 验证用户名是否存在
  verifyUser_username: async (username) => {
    return await userModel.findOne({ username });
  },
  // 验证用户名和密码是否正确
  verifyUser_all: async (username, password) => {
    return await userModel.findOne({ username, password });
  },
  // 添加用户
  addUser: async (username, password) => {
    return await userModel.create({ username, password });
  },
  //根据用户id查询用户
  getUserInfoById: async (id) => {
    //暂时不使用级联查询
    // return await userModel.findOne({ _id: id }).populate("travelPlan");
    return await userModel.findOne({ _id: id });
  },
  // 根据id更新用户信息
  updateUserInfoById: async (id, data) => {
    return await userModel.findOneAndUpdate({ _id: id }, data, { new: true });
  },

  // 获取所有用户信息
  getAllUsers: async (id, pageSize, skipNumber) => {
    // 找出除了当前用户以外的所有用户
    return await userModel
      .find({ _id: { $ne: id } })
      .skip(skipNumber)
      .limit(pageSize);
  },

  // 获取所有用户信息
  getAll: async () => {
    return await userModel.find();
  },

  // 获取所有导游信息
  getAllGuides: async () => {
    return await userModel.find({ isGuide: true });
  },

  // 举报用户
  reportUser: async (reported_user_id, report_reason, reporter_user_id) => {
    return await userReportModel.create({
      reported_user_id,
      report_reason,
      reporter_user_id,
    });
  },
};

module.exports = userController;
