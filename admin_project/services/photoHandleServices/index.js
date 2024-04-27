// const { log } = require("console");
const path = require("path");
const sharp = require("sharp");

const photoHandleService = {
  // 处理图片上传
  uploadPhoto: (req, res) => {
    const files = req.files;
    const compressTasks = [];
    const path_collection = [];

    // 处理每个文件的压缩任务
    for (let i = 0; i < files.length; i++) {
      compressTasks.push(compressImage(files[i]));
    }
    Promise.all(compressTasks)
      .then(() => {
        files.forEach((file) => {
          path_collection.push(file.path);
        });
        res.json({ path_collection });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "图片上传和压缩过程中出现错误" });
      });
  },
};

// 压缩图片

async function compressImage(file) {
  return new Promise((resolve, reject) => {
    sharp(file.path)
      .resize({ width: 800, withoutEnlargement: true })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(
        path.join(
          __dirname,
          `../../public/uploads/compress_chat_photos/${file.filename}`
        ),
        async (err, info) => {
          if (err) {
            reject(err);
          } else {
            file.path = `http://127.0.0.1:3000/uploads/compress_chat_photos/${file.filename}`;
            resolve();
          }
        }
      );
  });
}
module.exports = photoHandleService;
