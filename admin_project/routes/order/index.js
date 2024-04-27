const express = require("express");
const router = express.Router();
const orderService = require("../../services/orderService");

// 新增订单
router.post("/addOrder", orderService.addOrder);

//获取所有订单
router.get("/allOrders", orderService.allOrders);

// 取消订单
router.post("/cancelOrder", orderService.cancelOrder);

//修改订单状态
router.post("/updateOrderStatus", orderService.updateOrderStatus);

module.exports = router;
