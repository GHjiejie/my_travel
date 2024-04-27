const companionController = require("../../controller/companionController/index.js");
const path = require("path");
const returnResult = require("../../utils/return_result.js");
const sharp = require("sharp");

const companionService = {
  // 上传证书
  uploadPdf: async (req, res) => {
    console.log(req.file);
    // formData里面的非文件数据通过req.body获取，文件被解析到req.file里面，在进入之前已经被multer解析过了
    // console.log(req.body);
    const { userId, username, applyTime } = req.body;
    const data = {
      userId,
      username,
      applyTime,
    };

    try {
      const pdfPath = `http://localhost:3000/uploads/companion_pdfs/${req.file.filename}`;
      const result = await companionController.uploadPdf(pdfPath, data);
      res.json(returnResult.success(result));
    } catch (error) {
      res.json(returnResult.fail(error));
    }
  },
  // // 获取所有的申请信息
  getAllApply: async (req, res) => {
    const result = await companionController.getAllApply();
    res.json(returnResult.success(result));
  },

  // // 根据id获取申请信息
  // getApplyById: async (req, res) => {
  //   const { userId } = req.query;
  //   const result = await guideController.getApplyById(userId);
  //   res.json(returnResult.success(result));
  // },
  // // 通过导游申请
  pass: async (req, res) => {
    const {
      applyId,
      userId,
      isPass,
      isCheck,
      passTime,
      passPerson,
      passPersonPhone,
      passOpinion,
    } = req.body;
    // console.log(req.body);
    const data = {
      applyId,
      userId,
      isPass,
      passTime,
      isCheck,
      passPerson,
      passPersonPhone,
      passOpinion,
    };
    const result = await companionController.pass(data);
    res.json(returnResult.success(result));
  },

  // // 拒绝导游申请
  reject: async (req, res) => {
    const {
      applyId,
      userId,
      isPass,
      passTime,
      isCheck,
      passPerson,
      passPersonPhone,
      passOpinion,
    } = req.body;
    const data = {
      applyId,
      userId,
      isPass,
      passTime,
      isCheck,
      passPerson,
      passPersonPhone,
      passOpinion,
    };
    const result = await companionController.reject(data);
    res.json(returnResult.success(result));
  },

  // // 完善导游信息
  completeInfo: async (req, res) => {
    const { id } = req.query;

    const file = req.file;

    const avatar = file
      ? `http://localhost:3000/uploads/companion_avatars/${file.filename}`
      : "http://localhost:3000/images/default.jpg";

    const data = {
      ...req.body.companionInfo,
      avatar,
    };
    // console.log(data);

    const result = await companionController.completeInfo(id, data);
    res.json(returnResult.success(result));
  },

  // // 根据导游id新增产品
  // addProduct: async (req, res) => {
  //   const files = req.files;
  //   const { id } = req.query;
  //   // console.log(req.body);
  //   const data = {
  //     ...req.body,
  //   };
  //   const compressTasks = [];
  //   const path_collection = [];
  //   // 处理每个文件的压缩任务
  //   for (let i = 0; i < files.length; i++) {
  //     compressTasks.push(compressImage(files[i]));
  //   }
  //   try {
  //     await Promise.all(compressTasks);

  //     files.forEach((file) => {
  //       path_collection.push(file.path);
  //     });
  //     // console.log(path_collection);

  //     const result = await guideController.addProduct(
  //       id,
  //       data,
  //       path_collection
  //     );
  //     if (result) {
  //       res.json(returnResult.success(result));
  //     } else {
  //       res.json(returnResult.fail());
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "图片上传和压缩过程中出现错误" });
  //   }
  // },

  // // 根据导游id获取导游信息
  getCompanionInfoById: async (req, res) => {
    const { id } = req.query;
    const result = await companionController.getCompanionInfoById(id);
    res.json(returnResult.success(result));
  },

  // // 获取所有导游信息
  getAllCompanion: async (req, res) => {
    const result = await companionController.getAllCompanion();
    res.json(returnResult.success(result));
  },

  // // 根据id增加导游语种
  // addLanguage: async (req, res) => {
  //   const { id, language } = req.body;
  //   const result = await guideController.addLanguage(id, language);
  //   res.json(returnResult.success(result));
  // },

  // // 根据id修改语种
  // updateLanguage: async (req, res) => {
  //   const { id, language, index } = req.body;
  //   // console.log(req.body);
  //   const result = await guideController.updateLanguage(id, language, index);
  //   res.json(returnResult.success(result));
  // },

  // // 根据id删除导游语种
  // deleteLanguage: async (req, res) => {
  //   const { id, language, index } = req.body;
  //   const result = await guideController.deleteLanguage(id, language, index);
  //   res.json(returnResult.success(result));
  // },

  // //添加用户评论
  // addComment: async (req, res) => {
  //   const { guideID } = req.query;
  //   const { comment } = req.body;
  //   const handleComment = JSON.parse(comment);
  //   const files = req.files;
  //   if (!files) {
  //     const result = guideController.addComment(guideID, handleComment, []);
  //     res.json(returnResult.success(result));
  //     return;
  //   }
  //   const compressTasks = [];
  //   const path_collection = [];
  //   // 处理每个文件的压缩任务
  //   for (let i = 0; i < files.length; i++) {
  //     compressTasks.push(compressCommentImage(files[i]));
  //   }
  //   Promise.all(compressTasks)
  //     .then(() => {
  //       files.forEach((file) => {
  //         path_collection.push(file.path);
  //       });
  //       const result = guideController.addComment(
  //         guideID,
  //         handleComment,
  //         path_collection
  //       );
  //       res.json(returnResult.success(result));
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       res.status(500).json({ error: "图片上传和压缩过程中出现错误" });
  //     });
  // },

  // //回复用户评论
  // replyComment: async (req, res) => {
  //   const { guideID, index } = req.query;
  //   const { reply } = req.body;
  //   const handlereply = JSON.parse(reply);
  //   const files = req.files;
  //   // console.log(files);
  //   // console.log(handlereply);
  //   if (!files) {
  //     const result = guideController.replyComment(
  //       guideID,
  //       index,
  //       handlereply,
  //       []
  //     );
  //     res.json(returnResult.success(result));
  //     return;
  //   }
  //   const compressTasks = [];
  //   const path_collection = [];
  //   // 处理每个文件的压缩任务
  //   for (let i = 0; i < files.length; i++) {
  //     compressTasks.push(compressReplyImage(files[i]));
  //   }
  //   Promise.all(compressTasks)
  //     .then(() => {
  //       files.forEach((file) => {
  //         path_collection.push(file.path);
  //       });
  //       const result = guideController.replyComment(
  //         guideID,
  //         index,
  //         handlereply,
  //         path_collection
  //       );
  //       res.json(returnResult.success(result));
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       res.status(500).json({ error: "图片上传和压缩过程中出现错误" });
  //     });
  //   // const { guideID, index } = req.query;
  //   // const result = await guideController.replyComment(guideID, index, req.body);
  //   // res.json(returnResult.success(result));
  // },

  // //删除用户评论
  // deleteComment: async (req, res) => {
  //   const { guideID, index } = req.body;
  //   const result = await guideController.deleteComment(guideID, index);
  //   res.json(returnResult.success(result));
  // },

  // //删除回复
  // deleteReply: async (req, res) => {
  //   const { guideID, commentIndex, replyIndex } = req.body;
  //   const result = await guideController.deleteReply(
  //     guideID,
  //     commentIndex,
  //     replyIndex
  //   );
  //   res.json(returnResult.success(result));
  // },

  // // 为评论点赞
  // likeComment: async (req, res) => {
  //   const { guideID, commentIndex } = req.body;
  //   const result = await guideController.likeComment(guideID, commentIndex);
  //   res.json(returnResult.success(result));
  // },
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
          `../../public/uploads/compress_guide_product_images/${file.filename}`
        ),
        async (err, info) => {
          if (err) {
            reject(err);
          } else {
            file.path = `http://127.0.0.1:3000/uploads/compress_guide_product_images/${file.filename}`;
            resolve();
          }
        }
      );
  });
}
// 压缩评论图片
async function compressCommentImage(file) {
  return new Promise((resolve, reject) => {
    sharp(file.path)
      .resize({ width: 800, withoutEnlargement: true })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(
        path.join(
          __dirname,
          `../../public/uploads/compress_user_comment_images/${file.filename}`
        ),
        async (err, info) => {
          if (err) {
            reject(err);
          } else {
            file.path = `http://127.0.0.1:3000/uploads/compress_user_comment_images/${file.filename}`;
            resolve();
          }
        }
      );
  });
}
// 压缩回复图片
async function compressReplyImage(file) {
  return new Promise((resolve, reject) => {
    sharp(file.path)
      .resize({ width: 800, withoutEnlargement: true })
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(
        path.join(
          __dirname,
          `../../public/uploads/compress_user_reply_images/${file.filename}`
        ),
        async (err, info) => {
          if (err) {
            reject(err);
          } else {
            file.path = `http://127.0.0.1:3000/uploads/compress_user_reply_images/${file.filename}`;
            resolve();
          }
        }
      );
  });
}

module.exports = companionService;
