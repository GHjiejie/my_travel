const orderController = require("../../controller/orderController/index.js");
const returnResult = require("../../utils/return_result.js");

const orderService = {
  // 新增订单
  addOrder: async (req, res) => {
    console.log("addOrder");
    // try {
    //   const result = await orderController.addOrder(req);
    //   res.json(result);
    // } catch (error) {
    //   res.json(error);
    // }
  },
  // 获取所有订单
  allOrders: async (req, res) => {
    const { userID } = req.query;
    try {
      const result = await orderController.allOrders(userID);
      res.json(returnResult.success(result));
    } catch (error) {
      res.json(returnResult.fail());
    }
  },

  // 取消订单
  cancelOrder: async (req, res) => {
    const { userID, orderID } = req.body;
    try {
      const result = await orderController.cancelOrder(userID, orderID);
      // console.log(result);
      res.json(returnResult.success(result));
    } catch (error) {
      res.json(returnResult.fail());
    }
  },

  // 修改订单状态
  updateOrderStatus: async (req, res) => {
    const { orderID, userID, payTime } = req.body;
    try {
      const result = await orderController.updateOrderStatus(
        orderID,
        userID,
        payTime
      );
      res.json(returnResult.success(result));
    } catch (error) {
      res.json(returnResult.fail());
    }
  },
};

module.exports = orderService;
