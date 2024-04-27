const alipaySdk = require("../../config/alipaysdk");
const AlipayFormData = require("alipay-sdk/lib/form").default;
const orderController = require("../../controller/orderController/index");
const retuenResult = require("../../utils/return_result");

const payServices = {
  // 预约导游个人服务
  guidePay: async (req, res) => {
    const { userID, guideID, orderID, orderPrice, orderName, timeout } =
      req.body;
    // console.log(orderID);
    console.log(guideID);
    const formData = new AlipayFormData();
    formData.setMethod("get");
    //使用post更加安全
    // formData.setMethod("post");
    // 失效原因：在开发环境中使用 localhost 作为异步通知 URL 可能会导致支付宝无法正确访问。支付宝需要能够通过公共互联网访问到您提供的通知 URL。因此，建议您使用可以被支付宝访问到的公网 IP 地址或域名作为异步通知 URL。
    // 所以这个notifyUrl不能使用localhost，需要使用公网IP或者域名
    // formData.addField(
    //   "notifyUrl",
    //   `http://localhost:3000/api/pay/notification`
    // );
    formData.addField(
      "returnUrl",
      `http://localhost:9000/user/order/${userID}/allOrders`
    );
    formData.addField("bizContent", {
      // 订单号：唯一
      outTradeNo: orderID,
      // 产品码：固定值
      productCode: "FAST_INSTANT_TRADE_PAY",
      // 订单金额：单位元
      totalAmount: orderPrice,
      // 订单标题
      subject: orderName,
      // 设置超时时间
      timeExpire: timeout,
      // 商店门户编号
      storeId: guideID,
    });

    const result = await alipaySdk.exec(
      "alipay.trade.page.pay",
      {},
      { formData: formData }
    );
    // console.log(result);
    res.send(result);
  },

  // 取消订单
  // cancelOrder: async (req, res) => {
  //   const { userID, orderID } = req.query;
  //   console.log(userID, orderID);
  //   const result = await alipaySdk.exec("alipay.trade.close", {
  //     bizContent: {
  //       outTradeNo: orderID,
  //     },
  //   });
  //   if (result) {
  //     console.log(result);
  //     const result = await orderController.cancelOrder(userID, orderID);
  //   }
  //   // const result = await orderController.cancelOrder(userID, orderID);
  //   // res.json(retuenResult.success(result));
  // },
  // 获取用户所有订单
  orderUpdate: async (req, res) => {
    const { userID, orderID } = req.query;
    const { appendData } = req.body;
    // console.log("appendData", appendData);
    const result = await alipaySdk.exec("alipay.trade.query", {
      bizContent: {
        outTradeNo: orderID,
      },
    });
    if (result) {
      const newData = {
        ...appendData,
        ...result,
      };
      console.log(newData);
      const addOrder = await orderController.addOrder(userID, newData);
      res.json(retuenResult.success(addOrder));
    } else {
      res.json(retuenResult.fail());
    }
    // res.send(result);
  },

  // 查询订单状态
  orderStatus: async (req, res) => {
    const { orderID } = req.body;
    const result = await alipaySdk.exec("alipay.trade.query", {
      bizContent: {
        outTradeNo: orderID,
      },
    });
    res.send(result);
  },

  // 支付宝异步通知，可以在文档nginx里面编写一个接口，然后在支付宝里面配置这个接口地址，在本地是跑不了的
  // notification: async (req, res) => {
  //   console.log("支付宝异步通知");
  // const params = req.body;
  // console.log(params);
  // const result = await alipaySdk.exec("alipay.trade.query", {
  //   bizContent: {
  //     outTradeNo: params.out_trade_no,
  //   },
  // });
  // console.log(result);
  // res.send("success");
  // },
};
module.exports = payServices;
