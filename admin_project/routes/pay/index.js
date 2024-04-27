const express = require("express");
const router = express.Router();
const payServices = require("../../services/payService");

// 预定导游个人服务
router.post("/guide", payServices.guidePay);

// 根据用户id获取所有订单
router.post("/orderUpdate", payServices.orderUpdate);

// 查询订单状态
router.post("/orderStatus", payServices.orderStatus);

// 取消订单
// router.post("/cancelOrder", payServices.cancelOrder);

// 支付宝异步通知
// router.post("/notification", payServices.notification);

module.exports = router;
