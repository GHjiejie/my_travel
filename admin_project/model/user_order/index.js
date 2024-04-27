const mongoose = require("mongoose");

const userOrderScheam = new mongoose.Schema({
  //用户id
  userId: {
    type: String,
    required: true,
  },
  // 订单数组
  orderList: [
    {
      type: Object,
    },
  ],
});
const userOrderModel = mongoose.model("orders", userOrderScheam);
module.exports = userOrderModel;
