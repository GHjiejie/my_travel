<template>
  <div class="allOrders">
    <template v-if="obligationOrders.length !== 0">
      <div class="orderList">
        <div class="orderItem" v-for="(item, index) in obligationOrders">
          <div class="orderItemTitle">
            <span class="orderFromName">{{ item.guideName }}的旅游小屋</span>
            <span class="order_state">
              <!-- {{ item.tradeStatus }} -->
              <template v-if="item.tradeStatus == 'TRADE_SUCCESS'">
                <el-tag type="success">已完成</el-tag>
              </template>
              <template v-else-if="item.tradeStatus == 'WAIT_BUYER_PAY'">
                <el-tag type="warning">待付款</el-tag>
              </template>
              <template v-else-if="item.tradeStatus == 'TRADE_CLOSED'">
                <el-tag type="info">已取消</el-tag>
              </template>
            </span>
          </div>

          <div class="orderItemContent">
            <div class="contentTop">
              <div class="orderItemContentLeft">
                <img :src="item.guideAvatar" alt="商品图片" />
              </div>
              <div class="orderItemContentRight">
                <div class="orderItemContentRightTop">
                  <span class="order_main_content"> 五星级导游{{ item.guideName }}的私人服务</span>
                </div>
                <div class="orderItemContentRightBottom">
                  <span class="order_num">数量： 1 </span>
                  <span class="single_price">单价：￥{{ item.totalAmount }}</span>
                </div>
              </div>
            </div>
            <div class="contentBottom">
              <template v-if="item.tradeStatus == 'TRADE_SUCCESS'">
                <span class="total_price">合计:￥{{ item.totalAmount }}</span>
              </template>
              <template v-else-if="item.tradeStatus == 'WAIT_BUYER_PAY'">

                <span class="timeout"><el-countdown title="剩余时间" :value="item.timeout"
                    @finish="time_end(item.outTradeNo)" /></span>
                <span class="total_price">合计:￥{{ item.totalAmount }}</span>
              </template>

            </div>
          </div>

          <div class="orderItemFooter">
            <div class="footer_left">
              <span class="more_info" @click="viewMore_info(item)">更多</span>
            </div>
            <div class="footer_right">

              <template v-if="item.tradeStatus == 'TRADE_SUCCESS'">
                <el-tag type="warning" size="small" @click="goEvaluate">前往评价</el-tag>
                <el-tag type="primary" size="small" @click="view_logistics">查看物流</el-tag>
                <el-tag type="info" size="small" @click="req_refund"> 申请退款</el-tag>
                <el-tag type="danger" size="small" @click="anotherOrder">再来一单</el-tag>

              </template>
              <template v-else-if="item.tradeStatus == 'WAIT_BUYER_PAY'">
                <el-tag type="danger" size="small" @click="cancelOrder(item.outTradeNo, index)">取消订单</el-tag>
                <el-tag type="primary" size="small" @click="reOrder(item.orderPath, item.outTradeNo)">立即支付</el-tag>
              </template>
              <template v-else-if="item.tradeStatus == 'TRADE_CLOSED'">
                <el-tag type="info" size="small" @click="reOrder(item.orderPath, item.outTradeNo)">重新下单</el-tag>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <el-empty :image-size="200" />
    </template>

    <el-dialog v-model="view_panel_state" :show-close="false">
      <div class="order_more_info">
        <div class="more_header">
          <span>订单详情</span>
        </div>
        <div class="more_center">
          <span>订单号：{{ view_data.outTradeNo }}</span>
          <span>订单状态：{{ view_data.tradeStatus }}</span>
          <span>订单金额：{{ view_data.totalAmount }}</span>
          <span>订单支付时间：{{ view_data.sendPayDate }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import useLoginUserInfoStore from '../../../../stores/login_user_info_store';

const loginUserInfoStore = useLoginUserInfoStore();
const orderId = ref('')
const userId = ref('');

const view_panel_state = ref(false);
const view_data = ref({});

const allOrders_info = ref([]);
const obligationOrders = ref([]);

// 前往评价
const goEvaluate = () => {
  console.log('前往评价');
}
// 查看物流
const view_logistics = () => {
  ElMessage.info('API要钱，抱歉');
}

// 申请退款
const req_refund = () => {
  ElMessage.warning('买了还想退？？？');
}

// 再来一单
const anotherOrder = () => {
  ElMessage.warning('功能重复，不写辣！');
}

// 获取当前用户的所有订单
onBeforeMount(async () => {
  allOrders_info.value = loginUserInfoStore.user_orders;
  obligationOrders.value = allOrders_info.value.orderList.filter(item => item.tradeStatus == 'WAIT_BUYER_PAY');
  console.log('待付款订单', obligationOrders.value);
});
// 查看更多
const viewMore_info = (item) => {
  view_panel_state.value = true;
  view_data.value = item;
}

// 重新下单
const reOrder = (orderPath, tradeID) => {
  loginUserInfoStore.repay_order_id = tradeID;
  window.open(orderPath);
}

// 查询订单状态
const requeryOrderState = async (orderID) => {
  const res = await axios({
    method: 'post',
    url: '/api/pay/orderStatus',
    data: {
      orderID: orderID
    }
  });
  // console.log('重新查询订单状态', res.data);
  if (res.data.tradeStatus == 'TRADE_SUCCESS') {
    // 更新订单状态
    await ReupdateOrderState(orderID, res.data.sendPayDate);
    // ElMessage.success('订单状态更新成功');
  }
  // if (res.data.tradeStatus == 'WAIT_BUYER_PAY') {
  //   return;
  //   // ElMessage.success('订单状态更新成功');
  // }
}
// 重新更新订单状态
const ReupdateOrderState = async (orderID, pay_time) => {
  // console.log('更新订单状态', loginUserInfoStore.login_user_info._id, orderID);
  const res = await axios({
    method: 'post',
    url: '/api/order/updateOrderStatus',
    data: {
      orderID: orderID,
      userID: loginUserInfoStore.login_user_info._id,
      payTime: pay_time
    }
  });

  if (res.data.code == 200) {
    // ElMessage.success('订单状态更新成功');
    loginUserInfoStore.repay_order_id = '';

  }
}
// 取消订单
const cancelOrder = async (trade_id, index) => {
  // console.log('订单号', trade_id);
  // 弹窗提示是否取消订单
  ElMessageBox.confirm('确定取消订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    allOrders.value.orderList[index].tradeStatus = 'TRADE_CLOSED';
    await cancelOrder_true(trade_id);
  }).catch(() => {
    ElMessage.info('已取消取消订单');
  });
}

// 取消订单
const cancelOrder_true = async (id) => {
  const res = await axios({
    method: 'post',
    url: '/api/order/cancelOrder',
    data: {
      userID: userId.value,
      orderID: id
    }
  });
  if (res.data.code == 200) {
    ElMessage.success('订单取消成功');
  }

}

// 倒计时结束
const time_end = () => {
  // console.log('倒计时结束');
  ElMessage.error('订单已超时，请重新下单');
  // 取消订单
  cancelOrder_true();
}

// 获取当前用户的所有订单
const getAllOrders = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/order/allOrders',
    params: {
      userID: userId.value
    }
  });
  if (res.data.code == 200) {
    allOrders.value = res.data.data;
    // console.log('获取当前用户的所有订单', allOrders.value);
    allOrders.value.orderList = allOrders.value.orderList.filter(item => item.code == 10000 || item.code == 10001);
    loginUserInfoStore.user_orders = allOrders.value;
    // console.log('获取当前用户的所有订单', allOrders.value);

  }
}

// 获取更新后的用户所有订单
const updateOrder = async (order_id) => {
  const res = await axios({
    method: 'post',
    url: '/api/pay/orderUpdate',
    params: {
      orderID: order_id,
      userID: userId.value
    },
    data: {
      appendData: loginUserInfoStore.order_need_data
    }
  });
  if (res.data.code == 200) {
    orderId.value = loginUserInfoStore.lastTime_pay_order_id;
    allOrders.value.orderList = allOrders.value.orderList.filter(item => item.code == 10000 || item.code == 10001);
    loginUserInfoStore.user_orders = allOrders.value;
  }
}


</script>

<style lang="scss" scoped>
:deep(.el-statistic__content) {
  font-size: 0.8rem;
  color: red;
}

:deep(.el-dialog) {
  background-color: #188fff00;
  box-shadow: none;
}

.allOrders {
  padding: 1rem;

  .orderList {
    display: flex;
    flex-direction: column;

    .orderItem {

      display: flex;
      flex-direction: column;


      width: 75%;
      margin: 0 auto;
      padding: 1rem;
      box-shadow: 0 0 2px #ccc;
      border-radius: 1rem;
      margin-bottom: 1rem;

      .orderItemTitle {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;

        .orderFromName {
          font-size: 1rem;
          font-weight: bold;
        }
      }

      .orderItemContent {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .contentTop {
          display: flex;
          justify-content: flex-start;

          .orderItemContentLeft {
            margin-right: 1rem;

            img {
              width: 5rem;
              height: 5rem;
              border-radius: 0.2rem;
              object-fit: cover;
            }
          }

          .orderItemContentRight {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            gap: 0.5rem;

            .orderItemContentRightTop {
              .order_main_content {
                font-size: 1rem;
                font-weight: bold;
              }
            }

            .orderItemContentRightBottom {

              .order_num {
                font-size: 0.9rem;
                color: #ccc;
                margin-right: 1rem;
              }

              .single_price {
                font-size: 0.9rem;
                color: #ccc;
              }
            }
          }
        }

        .contentBottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.5rem;

          .total_price {
            font-size: 0.9rem;
            color: red;
            font-weight: bold;
          }

          .timeout {
            font-size: 0.9rem;
            color: #ccc;
          }
        }
      }

      .orderItemFooter {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-tag {
          &:hover {
            cursor: pointer;
          }
        }

        .footer_left {
          span {
            color: #1890ff;
            cursor: pointer;
          }
        }

        .footer_right {
          display: flex;
          gap: 1rem;

          el-tag {
            cursor: pointer;
          }
        }
      }
    }
  }
}

.order_more_info {
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;

  .more_header {
    background-color: #eaeaea;
    padding: 5px;
    border-bottom: 1px solid #ccc;
    font-weight: bold;
  }

  .more_center {
    padding: 10px;

    span {
      display: block;
      margin-bottom: 5px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    span:nth-child(odd) {
      color: #333;
    }

    span:nth-child(even) {
      color: #666;
    }
  }
}
</style>