const usersAlbumController = require("../../controller/userAlbumController/index");
const returnResult = require("../../utils/return_result");
const sharp = require("sharp");
// const fs = require("fs");
const path = require("path");

const usersAlbumServices = {
  // 添加用户图片
  addUserPhoto: async (req, res) => {
    const files = req.files;
    const { userId } = req.query;
    const compressTasks = [];
    const path_collection = [];

    // 处理每个文件的压缩任务
    for (let i = 0; i < files.length; i++) {
      compressTasks.push(compressImage(files[i]));
    }
    try {
      await Promise.all(compressTasks);

      files.forEach((file) => {
        path_collection.push(file.path);
      });

      const result = await usersAlbumController.addUserPhoto(
        userId,
        path_collection
      );
      if (result) {
        res.json(returnResult.success(result));
      } else {
        res.json(returnResult.fail());
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "图片上传和压缩过程中出现错误" });
    }
  },

  // 获取用户图片
  getUserPhoto: async (req, res) => {
    const { userId } = req.query;
    const result = await usersAlbumController.getUserPhoto(userId);
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },

  // 根据id删除用户图片
  deleteUserPhoto: async (req, res) => {
    const { userId, index } = req.query;
    const result = await usersAlbumController.deleteUserPhoto(userId, index);
    if (result) {
      res.json(returnResult.success(result));
    } else {
      res.json(returnResult.fail());
    }
  },
};

async function compressImage(file) {
  return new Promise((resolve, reject) => {
    sharp(file.path)
      .resize({ width: 800, withoutEnlargement: true })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(
        path.join(
          __dirname,
          `../../public/uploads/compress_album/${file.filename}`
        ),
        async (err, info) => {
          if (err) {
            reject(err);
          } else {
            file.path = `http://127.0.0.1:3000/uploads/compress_album/${file.filename}`;
            resolve();
          }
        }
      );
  });
}
module.exports = usersAlbumServices;
