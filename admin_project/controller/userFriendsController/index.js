const userModel = require("../../model/userModel/index.js");
const chatHistoryModel = require("../../model/chat_history/index.js");
const userFriendsController = {
  // 添加用户好友
  addFriend: async (userId, friendId) => {
    // console.log(userId, friendId);
    // 1.根据userId查询用户信息
    const user = await userModel.findOne({ _id: userId });
    // 2.根据friendId查询用户信息
    const friend = await userModel.findOne({ _id: friendId });
    // 3.判断用户是否存在
    if (!user || !friend) {
      return {
        code: 404,
        msg: "用户不存在",
      };
    }
    // 4.判断是否已经是好友
    if (user.friends.includes(friendId)) {
      return {
        code: 400,
        msg: "已经是好友了",
      };
    }
    // 5.添加好友
    user.friends.push(friendId);
    await user.save();
    return {
      code: 200,
      msg: "添加好友成功",
    };
  },

  // 添加好友申请
  applyFriend: async (userId, friendId) => {
    console.log(userId, friendId);
    // 1.根据userId查询用户信息
    const user = await userModel.findOne({ _id: userId });
    // 2.根据friendId查询用户信息
    const friend = await userModel.findOne({ _id: friendId });
    // 3.判断用户是否存在
    if (!user || !friend) {
      return {
        code: 404,
        msg: "用户不存在",
      };
    }
    // 4.判断是否已经是好友
    if (user.friends.includes(friendId)) {
      return {
        code: 400,
        msg: "已经是好友了",
      };
    }
    // 5.判断是否已经发送过好友申请
    if (friend.applyList.includes(userId)) {
      return {
        code: 400,
        msg: "已经发送过好友申请了",
      };
    }
    // 6.添加好友申请
    friend.applyList.push(userId);
    await friend.save();
    return {
      code: 200,
      msg: "添加好友申请成功",
    };
  },

  // 同意好友申请

  agreeFriend: async (userId, applyId) => {
    console.log(userId, applyId);
    // 1.根据userId查询用户信息
    const user = await userModel.findOne({ _id: userId });
    // 2.根据friendId查询用户信息
    const friend = await userModel.findOne({ _id: applyId });
    // 3.判断用户是否存在
    if (!user || !friend) {
      return {
        code: 404,
        msg: "用户不存在",
      };
    }
    // 4.判断是否已经是好友
    if (user.friends.includes(applyId)) {
      return {
        code: 400,
        msg: "已经是好友了",
      };
    }
    // // 5.判断是否已经发送过好友申请
    // if (!user.applyList.includes(applyId)) {
    //   return {
    //     code: 400,
    //     msg: "还未发送好友申请",
    //   };
    // }

    // 6.同意好友申请
    user.friends.push(applyId);
    friend.friends.push(userId);
    user.applyList = user.applyList.filter((item) => item != applyId);
    await user.save();
    await friend.save();
    return {
      code: 200,
      msg: "同意好友申请成功",
    };
  },

  // 删除好友
  deleteFriend: async (userId, friendId) => {
    const roomId1 = `room_${userId}_${friendId}`;
    const roomId2 = `room_${friendId}_${userId}`;

    // 1.根据userId查询用户信息
    const user = await userModel.findOne({ _id: userId });

    // 2.根据friendId查询用户信息
    const friend = await userModel.findOne({ _id: friendId });

    // 3.判断用户是否存在
    if (!user || !friend) {
      return {
        code: 404,
        msg: "用户不存在",
      };
    }

    // 4.判断是否已经是好友
    if (!user.friends.includes(friendId)) {
      return {
        code: 400,
        msg: "还不是好友",
      };
    }

    // 5.删除好友
    user.friends = user.friends.filter((item) => item != friendId);
    friend.friends = friend.friends.filter((item) => item != userId);
    await user.save();
    await friend.save();

    // 删除聊天记录

    await chatHistoryModel.deleteOne({ roomId: roomId1 });
    await chatHistoryModel.deleteOne({ roomId: roomId2 });

    return {
      code: 200,
      msg: "删除好友成功",
    };
  },
};
module.exports = userFriendsController;
