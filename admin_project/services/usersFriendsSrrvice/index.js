const userFriendsController = require("../../controller/userFriendsController/index.js");

const uesrFriendsService = {
  // 添加用户好友
  addFriend: async (req, res) => {
    const { userId, friendId } = req.query;
    const result = await userFriendsController.addFriend(userId, friendId);
    res.send(result);
  },

  // 添加好友申请
  applyFriend: async (req, res) => {
    const { userId, friendId } = req.body;
    const result = await userFriendsController.applyFriend(userId, friendId);
    res.send(result);
  },

  // 同意好友申请
  agreeFriend: async (req, res) => {
    const { userId, applyId } = req.body;
    console.log(userId, applyId);
    const result = await userFriendsController.agreeFriend(userId, applyId);
    res.send(result);
  },

  // 删除好友
  deleteFriend: async (req, res) => {
    const { userId, friendId } = req.body;
    console.log(userId, friendId);
    const result = await userFriendsController.deleteFriend(userId, friendId);
    res.send(result);
  },
};

module.exports = uesrFriendsService;
