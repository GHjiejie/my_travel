import { defineStore } from "pinia";
import { ref } from "vue";

const useLoginUserInfoStore = defineStore(
  "login_user_info",
  () => {
    // 当前登录的用户信息
    const login_user_info = ref({});
    // 当前用户的所有好友信息
    const user_friends = ref([]);
    // 需要查看的用户信息
    const viewUser = ref({});
    // 用户提交导游事情的结果
    const examine_result = ref({});
    // 用户导游号信息是否更新
    const is_guide_info_updated = ref(false);
    // 用户导游号的信息
    const guide_info = ref({});
    // 需要查看的导游产品信息
    const viewProduct = ref({});
    // 所有的导游信息
    const allGuideInfo = ref([]);
    // 用户要查看的导游的信息
    const viewGuide = ref({});
    // 上次支付订单的id
    const lastTime_pay_order_id = ref("");
    // 本次支付订单的id
    const thisTime_pay_order_id = ref("");
    // 重新付款的订单号
    const repay_order_id = ref("");

    // 当前用户的所有订单详细
    const user_orders = ref({});
    // 用户的所有有效订单
    const user_effective_orders = ref([]);

    // 当前的陪玩消息
    const companion_info = ref({});

    // 所有的陪玩消息
    const all_companion_info = ref([]);

    // 需要添加到订单的数据
    const order_need_data = ref({});
    const setGuideInfo = (data) => {
      guide_info.value = data;
      is_guide_info_updated.value = true;
    };
    const set_need_data = (data, timeout, orderPath) => {
      const { guideAvatar, _id, guideName } = data;
      order_need_data.value = {
        guideAvatar,
        guideID: _id,
        guideName,
        timeout,
        orderPath,
      };
    };

    return {
      login_user_info,
      user_friends,
      viewUser,
      examine_result,
      is_guide_info_updated,
      guide_info,
      viewProduct,
      viewGuide,
      lastTime_pay_order_id,
      thisTime_pay_order_id,
      order_need_data,
      user_effective_orders,
      repay_order_id,
      user_orders,
      allGuideInfo,
      companion_info,
      all_companion_info,
      set_need_data,
      setGuideInfo,
    };
  },
  // 开启持久化存储
  {
    persist: {
      enabled: true,
    },
  }
);
export default useLoginUserInfoStore;
