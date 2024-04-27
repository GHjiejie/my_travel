// const userAlbumModel = require("../../model/user_album/index");
const userModel = require("../../model/userModel/index");

const userAlbumController = {
  // 添加用户图片
  addUserPhoto: async (id, file) => {
    const user = await userModel.findById(id);
    if (user) {
      for (let i = 0; i < file.length; i++) {
        user.privateAlbum.push({ path: file[i] });
      }
      await user.save();
      return user.privateAlbum;
    } else {
      return null;
    }
  },

  // 获取用户图片
  getUserPhoto: async (id) => {
    const user = await userModel.findById(id);
    return user.privateAlbum;
  },

  // 根据id删除用户图片
  deleteUserPhoto: async (id, index) => {
    // console.log("index", index);
    const user = await userModel.findById(id);
    // console.log("before_length", user.privateAlbum.length);
    const result = user.privateAlbum.splice(index, 1);
    // console.log("result", result);
    // console.log("after_length", user.privateAlbum.length);
    await user.save();
    return result;
  },
};
module.exports = userAlbumController;
