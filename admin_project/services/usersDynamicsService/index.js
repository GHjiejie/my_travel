const usersDynamicsController = require("../../controller/userDynamicsController/index");
const returnResult = require("../../utils/return_result");
const path = require("path");
const sharp = require("sharp");
const usersDynamicsService = {
  // 添加用户动态
  addUserDynamic: async (req, res) => {
    const { userId } = req.query;
    const { content, isPublic } = req.body;
    const basicInfo = { userId, content, isPublic };
    // console.log("basicInfo", basicInfo);
    const files = req.files;
    const compressTasks = [];
    // 创建路径数组
    const photoArr = [];
    for (let i = 0; i < files.length; i++) {
      compressTasks.push(compressImage(files[i]));
    }
    try {
      await Promise.all(compressTasks);

      files.forEach((item) => {
        photoArr.push(item.path);
      });

      const result = await usersDynamicsController.addUserDynamic(
        basicInfo,
        photoArr
      );

      if (result) {
        res.json(returnResult.success(result));
      } else {
        res.json(returnResult.fail());
      }

      // console.log("压缩成功");
    } catch (error) {
      console.log(error);
    }
  },

  // 获取用户动态(用户自己查看，别人查看需要权限控制)
  getUserDynamic: async (req, res) => {
    const { userId } = req.query;
    const result = await usersDynamicsController.getUserDynamic(userId);
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },

  // 删除用户动态
  deleteUserDynamic: async (req, res) => {
    const { id } = req.params;
    // console.log("id", id);
    const result = await usersDynamicsController.deleteUserDynamic(id);
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },

  // 更新动态权限
  updateUserDynamic: async (req, res) => {
    const { id } = req.params;
    const { isPublic } = req.body;
    const result = await usersDynamicsController.updateUserDynamic(
      id,
      isPublic
    );
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },

  // 获取公开的用户动态
  getPublicUserDynamic: async (req, res) => {
    const { id } = req.query;
    const result = await usersDynamicsController.getPublicUserDynamic(id);
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },
};

// 图片压缩
async function compressImage(file) {
  return new Promise((resolve, reject) => {
    sharp(file.path)
      .resize({ width: 800, withoutEnlargement: true })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(
        path.join(
          __dirname,
          "../../public/uploads/compress_user_dynamics_photos",
          file.filename
        ),
        (err, info) => {
          if (err) {
            reject(err);
          } else {
            file.path = `http://127.0.0.1:3000/uploads/compress_user_dynamics_photos/${file.filename}`;
            resolve(info);
          }
        }
      );
  });
}
module.exports = usersDynamicsService;
