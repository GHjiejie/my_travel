const userModel = require("../../model/userModel");
const guideModel = require("../../model/guide");
const guideInfoModel = require("../../model/guide_infos");

const guideController = {
  // 上传证书
  uploadPdf: async (pdfPath, data) => {
    const isExist = await guideModel.findOne({ userId: data.userId });

    if (!isExist) {
      // 用户不存在，创建用户
      const result = await guideModel.create({
        userId: data.userId,
        username: data.username,
        certificate: pdfPath,
        applyTime: data.applyTime,
      });
      // console.log(result);
      return result;
    } else {
      // 用户存在，更新数据
      const result = await guideModel.updateOne(
        { userId: id },
        { username: data.username },
        { certificate: pdfPath },
        { applyTime: data.applyTime }
      );
      return result;
      // console.log(result);
      // console.log("数据更新成功！！");
    }
  },
  // 获取所有的申请信息
  getAllApply: async () => {
    const result = await guideModel.find();
    return result;
  },

  // 根据id获取申请信息
  getApplyById: async (userId) => {
    const result = await guideModel.findOne({
      userId: userId,
    });
    return result;
  },
  // 通过导游申请
  pass: async (data) => {
    // console.log(data);
    const result = await guideModel.findOneAndUpdate(
      { _id: data.applyId },
      {
        isPass: data.isPass,
        passTime: data.passTime,
        passStatus: data.passStatus,
        passPerson: data.passPerson,
        passPersonPhone: data.passPersonPhone,
        passOpinion: data.passOpinion,
      }
    );
    // 修改userModel中的用户身份
    if (data.isPass) {
      // 先查看是否已经有guideInfo
      const guide = await guideInfoModel.findOne({ userId: data.userId });
      if (!guide) {
        console.log("没有guideInfo");
        const result = await guideInfoModel.create({
          userId: data.userId,
        });
        if (result) {
          await userModel.findOneAndUpdate(
            { _id: data.userId },
            { isGuide: true, role: "guide", guideNumber: result._id }
          );
        }
      } else {
        console.log("有guideInfo,准备更新");
        await userModel.findOneAndUpdate(
          { _id: data.userId },
          { isGuide: true, role: "guide", guideNumber: guide._id }
        );
      }
    }
    return result;
  },
  // 拒绝导游申请
  reject: async (data) => {
    const result = await guideModel.findOneAndUpdate(
      { _id: data.applyId },
      {
        isPass: data.isPass,
        passTime: data.passTime,
        passStatus: data.passStatus,
        passPerson: data.passPerson,
        passPersonPhone: data.passPersonPhone,
        passOpinion: data.passOpinion,
      }
    );
    if (!data.isPass) {
      await userModel.findOneAndUpdate(
        { _id: data.userId },
        { isGuide: false, role: "normal", guideNumber: null }
      );
    }
    return result;
  },
  // 完善导游信息
  completeInfo: async (id, data) => {
    console.log(data);
    // 更新同时返回更新后的数据
    const result = await guideInfoModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });

    return result;
  },

  // 根据导游id新增产品
  addProduct: async (id, data, photos) => {
    const guide = await guideInfoModel.findOne({ _id: id });
    guide.myProducts.push(data);
    // 将图片添加到productImage里面
    guide.save();
    // 找到产品数组里面的productImage字段
    const productImage =
      guide.myProducts[guide.myProducts.length - 1].productImage;
    // 将图片添加到productImage里面
    photos.forEach((item) => {
      productImage.push({ path: item });
    });
    return guide;
  },

  // 根据id获取导游信息
  getGuideInfoById: async (id) => {
    const result = await guideInfoModel.findOne({ _id: id });
    return result;
  },

  // 获取所有导游信息
  getAllGuide: async (pageSize, skipNum) => {
    const result = await guideInfoModel.find().limit(pageSize).skip(skipNum);
    return result;
  },

  // 根据id新增语种
  addLanguage: async (id, data) => {
    const guide = await guideInfoModel.findOneAndUpdate(
      { _id: id },
      { $push: { guideLanguage: data } },
      { new: true }
    );
    return guide;
  },

  // 根据id修改语种
  updateLanguage: async (id, data, index) => {
    try {
      const guide = await guideInfoModel.findOneAndUpdate(
        { _id: id },
        { $set: { [`guideLanguage.${index}`]: data } },
        { new: true }
      );
      if (!guide) {
        throw new Error("未查询到导游信息");
      }
      return guide;
    } catch (error) {
      console.error("更新失败:", error);
      // 可根据具体需求处理错误情况
      throw new Error("更新语种失败");
    }
  },

  // 根据id删除导游语种
  deleteLanguage: async (id, data, index) => {
    const guide = await guideInfoModel.findOne({ _id: id });
    guide.guideLanguage.splice(index, 1);
    guide.save();
    return guide;
  },

  // 添加用户评论
  // addComment: async (id, data, images) => {
  //   const guide = await guideInfoModel.findOne({ _id: id });
  //   if (images.length === 0) {
  //     guide.userComments.push(data);
  //   } else {
  //     guide.userComments.push(data);
  //     guide.userComments[guide.userComments.length - 1].comment_images = images;
  //   }
  //   guide.save();
  //   return guide;
  // },
  // 以下是优化后的代码->将图片和评论内容分开处理(添加用户评论)
  addComment: async (id, data, images) => {
    try {
      const guide = await guideInfoModel.findOne({ _id: id });

      let commentData = { ...data }; // 创建包含data内容的新对象

      if (images.length > 0) {
        commentData.comment_images = images;
      }
      guide.userComments.push(commentData);
      await guide.save();

      return guide;
    } catch (error) {
      console.error("发生错误：", error);
      throw error;
    }
  },

  // 回复用户评论
  // replyComment: async (guideID, index, data, images) => {
  //   const guide = await guideInfoModel.findOne({ _id: guideID });
  //   if (images.length === 0) {
  //     guide.userComments[index].replyList.push(data);
  //     guide.save();
  //     return guide;
  //   } else {
  //     guide.userComments[index].replyList.push(data);
  //     guide.userComments[index].replyList[
  //       guide.userComments[index].replyList.length - 1
  //     ].reply_images = images;
  //     guide.save();
  //     return guide;
  //   }
  // },
  // 以下是优化后的代码->将图片和回复内容分开处理(回复用户评论)
  replyComment: async (guideID, index, data, images) => {
    try {
      const guide = await guideInfoModel.findOne({ _id: guideID });

      let replyData = { ...data }; // 创建包含data内容的新对象

      if (images.length > 0) {
        replyData.reply_images = images;
      }

      guide.userComments[index].replyList.push(replyData);
      await guide.save();

      return guide;
    } catch (error) {
      console.error("发生错误：", error);
      throw error;
    }
  },

  // 删除用户评论
  deleteComment: async (guideID, index) => {
    console.log(guideID, index);
    const guide = await guideInfoModel.findOne({ _id: guideID });
    guide.userComments.splice(index, 1);
    guide.save();
    return guide;
  },

  // 删除用户回复
  deleteReply: async (guideID, index, replyIndex) => {
    const guide = await guideInfoModel.findOne({ _id: guideID });
    guide.userComments[index].replyList.splice(replyIndex, 1);
    guide.save();
    return guide;
  },

  // 为评论点赞
  likeComment: async (guideID, index) => {
    const guide = await guideInfoModel.findOne({ _id: guideID });
    guide.userComments[index].user_like += 1;
    guide.save();
    return guide;
  },
};

module.exports = guideController;
