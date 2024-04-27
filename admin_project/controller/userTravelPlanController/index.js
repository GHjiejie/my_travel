const userTravelPlanModel = require("../../model/user_travel_plan");
const userModel = require("../../model/userModel/index");

const userTravelPlanController = {
  // 为用户添加出行计划
  addTravelPlan: async (id, data) => {
    // console.log("data", data);
    // console.log("id", id);
    const user = await userModel.findById(id);
    if (user) {
      // 说明查询到用户信息，可以为其设置出行计划
      const result = await userTravelPlanModel.create(data);
      user.travelPlan.push(result._id);
      const newResult = await user.save();
      return newResult;
    } else {
      return user;
    }
  },

  // 根据用户id获取用户的出行计划(所有的，分页查询)
  getTravelPlanByUserId: async (userId, pageSize, skipNum) => {
    const result = await userTravelPlanModel
      .find({ userId })
      .sort({ updateTime: -1 })
      .skip(skipNum)
      .limit(pageSize);

    // console.log("result", result);
    return result;
  },
  // 获取当前的用户计划
  getCurrentPlan: async (travelId) => {
    const result = await userTravelPlanModel.findById({ _id: travelId });
    return result;
  },

  // 根据旅游id删除用户的出行计划
  deleteTravelPlanById: async (travelId, userId) => {
    // 删除指定 travelId
    const pullResult = await userModel.updateOne(
      { _id: userId },
      // $pull 用于删除数组中的指定元素,这里我们需要将字符串转换为对象，因为 travelPlan 是一个对象数组
      { $pull: { travelPlan: Object(travelId) } }
    );
    // console.log("pullResult", pullResult);
    if (pullResult.matchedCount !== 0) {
      // 如果 $pull 操作成功，则继续删除对应 travelId 的文档
      const deleteResult = await userTravelPlanModel.findByIdAndDelete({
        _id: travelId,
      });
      return deleteResult;
    } else {
      // 如果 $pull 操作失败或未匹配到数据，则返回 null 或错误信息
      return null;
    }
  },

  // 根据旅游id更新用户的出行计划
  updateTravelPlanById: async (travelId, data) => {
    // 将 data 中的 userId 删除,否则获取不到对应用户的数据
    delete data.userId;
    const result = await userTravelPlanModel.findByIdAndUpdate(
      { _id: travelId },
      { ...data },
      { new: true }
    );

    return result;
  },
};

module.exports = userTravelPlanController;
