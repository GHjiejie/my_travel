const orderModel = require("../../model/user_order/index");

const orderController = {
  // 新增订单
  addOrder: async (userID, orderInfo) => {
    const existingOrder = await orderModel.findOne({ userId: userID });

    if (existingOrder) {
      // 如果已存在订单信息，则更新订单列表
      const updatedOrder = await orderModel.findOneAndUpdate(
        { userId: userID },
        { $push: { orderList: orderInfo } },
        { new: true } // 返回更新后的文档
      );
      return updatedOrder;
    } else {
      // 如果不存在订单信息，则创建新订单
      const newOrder = await orderModel.create({
        userId: userID,
        orderList: [orderInfo],
      });
      return newOrder;
    }
  },

  // 取消订单
  cancelOrder: async (userID, orderID) => {
    try {
      const result = await orderModel.findOne({ userId: userID });

      if (!result) {
        console.log("User not found");
        return null;
      }

      const filter = { userId: userID, "orderList.outTradeNo": orderID };

      const update = {
        $set: {
          "orderList.$.code": "10001",
          "orderList.$.tradeStatus": "TRADE_CLOSED",
        },
      };

      const options = { new: true };

      const updatedResult = await orderModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      if (updatedResult) {
        // console.log("订单取消成功");
        return updatedResult;
      } else {
        // console.log("订单取消失败");
        return null;
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      throw new Error("Failed to cancel order");
    }
  },

  // 获取所有订单
  allOrders: async (userID) => {
    const result = await orderModel.findOne({ userId: userID });
    return result;
  },

  //更新订单状态
  updateOrderStatus: async (orderID, userID, payTime) => {
    try {
      const result = await orderModel.findOne({ userId: userID });

      if (!result) {
        console.log("User not found");
        return null;
      }

      const filter = { userId: userID, "orderList.outTradeNo": orderID };

      const update = {
        $set: {
          "orderList.$.tradeStatus": "TRADE_SUCCESS",
          "orderList.$.code": "10000",
          "orderList.$.sendPayDate": payTime,
        },
      };

      const options = { new: true };

      const updatedResult = await orderModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      if (updatedResult) {
        // console.log("订单状态更新成功");
        return updatedResult;
      } else {
        // console.log("订单状态更新失败");
        return null;
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      throw new Error("Failed to update order status");
    }
  },
};

module.exports = orderController;
