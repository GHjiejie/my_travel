const chatHistoryModel = require("../model/chat_history");

const saveChatContent = {
  // 创建聊天室
  createChatRoom: async (data) => {
    const roomId1 = `room_${data.from}_${data.to}`;
    const roomId2 = `room_${data.to}_${data.from}`;

    // 查询数据库中是否存在这两个 roomId
    const [isExist1, isExist2] = await Promise.all([
      chatHistoryModel.findOne({ roomId: roomId1 }),
      chatHistoryModel.findOne({ roomId: roomId2 }),
    ]);

    // 如果不存在 roomId1，则创建
    if (!isExist1) {
      await chatHistoryModel.create({ roomId: roomId1 });
    }

    // 如果不存在 roomId2，则创建
    if (!isExist2) {
      await chatHistoryModel.create({ roomId: roomId2 });
    }
  },

  // 存储聊天记录
  saveChatContent: async (data) => {
    // console.log("saveChatContent: ", data);
    const roomId_1 = `room_${data.sender}_${data.receiver}`;
    const roomId_2 = `room_${data.receiver}_${data.sender}`;
    // console.log("saveChatContent: ", roomId);

    const messageContent = {
      sender: data.sender,
      receiver: data.receiver,
      message: data.message,
      time: data.time,
      avatar: data.avatar,
      username: data.username,
      photos: data.photos,
      showTime: data.showTime,
    };
    try {
      // 使用 Promise.all 同时更新两个房间的历史记录
      await Promise.all([
        chatHistoryModel.updateOne(
          { roomId: roomId_1 },
          { $push: { history: messageContent } }
        ),
        chatHistoryModel.updateOne(
          { roomId: roomId_2 },
          { $push: { history: messageContent } }
        ),
      ]);
    } catch (error) {
      console.error("Error saving chat content:", error);
    }
  },

  // 获取聊天记录
  getChatHistory: async (req, res) => {
    const { sender, receiver } = req.query;
    const roomId = `room_${sender}_${receiver}`;
    const chatContent = await chatHistoryModel.findOne({
      roomId: roomId,
    });
    // console.log("getChatContent: ", chatContent);

    res.json(chatContent);
  },
};

module.exports = saveChatContent;
