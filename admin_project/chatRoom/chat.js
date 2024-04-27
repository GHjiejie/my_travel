const { Server } = require("socket.io");
const saveChatContent = require("./saveChatContent");

function setupChatRoom(server) {
  const io = new Server(server, {
    // 接受所有的跨域请求
    cors: {
      origin: "*",
    },
  });

  // 监听客户端的连接事件
  io.on("connection", (socket) => {
    // 实现私聊功能
    // 处理加入私聊房间事件
    socket.on("joinPrivateChatRoom", async (data) => {
      // console.log("joinPrivateChatRoom: ", data);
      socket.join(data.roomId);
      // 创建房间
      await saveChatContent.createChatRoom(data);
      // console.log(`User joined room ${data.roomId}`);
    });

    // 监听客户端的消息事件
    socket.on("send", async (msg) => {
      const { sender, receiver } = msg;
      // console.log("客户端输出的Message: ", msg);
      // 将用户的聊天记录存储到数据库里面
      await saveChatContent.saveChatContent(msg);

      // 根据msg的from与to内容，来回复用户的消息

      io.to(`room_${sender}_${receiver}`)
        .to(`room_${receiver}_${sender}`)
        .emit("privateMessage", msg);
    });

    // 监听客户端的断开连接事件
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}

module.exports = setupChatRoom;
