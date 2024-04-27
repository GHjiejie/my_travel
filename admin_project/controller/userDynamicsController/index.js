const UserDynamicModel = require("../../model/user_dynamic/index");
const userModel = require("../../model/userModel/index");
const userDynamicsController = {
  // 添加用户动态
  addUserDynamic: async (basicInfo, photoArr) => {
    const { userId, conent, isPublic } = basicInfo;
    const user = await userModel.findById(userId);
    if (user) {
      // 创建一个新的动态
      const result = await UserDynamicModel.create(basicInfo);

      for (let i = 0; i < photoArr.length; i++) {
        result.photos.push({ path: photoArr[i] });
      }

      result.currentUserAvatar = user.avatar;
      await result.save();
      user.dynamic.push(result._id);
      await user.save();
      return result;
    } else {
      return null;
    }
  },

  // 获取用户动态
  getUserDynamic: async (userId) => {
    const result = await UserDynamicModel.find({ userId });
    return result;
  },

  // 删除用户动态
  deleteUserDynamic: async (id) => {
    const result = await UserDynamicModel.deleteOne({ _id: id });
    return result;
  },

  // 更新动态权限
  updateUserDynamic: async (id, isPublic) => {
    const result = await UserDynamicModel.updateOne({ _id: id }, { isPublic });
    return result;
  },

  // 获取公开的用户动态
  getPublicUserDynamic: async (id) => {
    // 根据用户id获取用户的所有的公开动态
    const result = await UserDynamicModel.find({ userId: id, isPublic: true });
    // console.log("我获取到了所有的公开数据", result);
    return result;
  },
};
module.exports = userDynamicsController;
``;
