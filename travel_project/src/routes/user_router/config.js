const routes = [
  // 用户主页
  {
    path: "info/:id",
    name: "info",
    component: () => import("../../components/user_component/user_info.vue"),

    meta: {
      index: 1,
    },
  },
  // 用户动态
  {
    path: "trend/:id",
    name: "trend",
    component: () => import("../../components/user_component/user_trend.vue"),
    meta: {
      index: 2,
    },
  },
  // 用户好友
  {
    path: "friends/:id",
    name: "friends",
    component: () => import("../../components/user_component/user_friends.vue"),

    meta: {
      index: 3,
    },
  },
  {
    path: "chat/:id",
    name: "chat",
    component: () => import("../../components/chat/index.vue"),
  },
  // 用户收藏
  {
    path: "collects/:id",
    name: "collects",
    component: () =>
      import("../../components/user_component/user_collects.vue"),
    meta: {
      index: 4,
    },
  },
  // 用户订单
  {
    path: "order/:id",
    name: "order",
    component: () => import("../../components/user_component/user_order.vue"),
    children: [
      // 全部订单
      {
        path: "allOrders",
        name: "allOrders",
        component: () =>
          import(
            "../../components/user_component/user_order_component/UOC_all_orders/index.vue"
          ),
      },
      // 待支付订单
      {
        path: "unpaidOrders",
        name: "unpaidOrders",
        component: () =>
          import(
            "../../components/user_component/user_order_component/UOC_obligation/index.vue"
          ),
      },
      //退款与售后
      {
        path: "refund",
        name: "refund",
        component: () =>
          import(
            "../../components/user_component/user_order_component/UOC_refund/index.vue"
          ),
      },
      // 待评价
      {
        path: "uncommentedOrders",
        name: "uncommentedOrders",
        component: () =>
          import(
            "../../components/user_component/user_order_component/UOC_tobeEvaluated/index.vue"
          ),
      },
    ],
    meta: {
      index: 5,
    },
  },
  // 成为导游
  {
    path: "beguide/:id",
    name: "beguide",
    component: () =>
      import("../../components/user_component/user_be_guide.vue"),
    meta: {
      index: 6,
    },
  },
  // 更新用户信息
  {
    path: "update/:id",
    name: "update",
    component: () =>
      import(
        "../../components/user_component/user_info_component/UIC_update_user_info/user_info_update.vue"
      ),
  },

  // 创建新的旅行计划/user/createTravelPlan/
  {
    path: "createTravelPlan/:id",
    name: "createTravelPlan",
    component: () =>
      import(
        "../../components/user_component/user_info_component/UIC_create_travel_plan/create_travel_plan.vue"
      ),
  },
  // 更新用户的旅行计划
  {
    path: "updateTravelPlan/:id",
    name: "travelPlan",
    component: () =>
      import(
        "../../components/user_component/user_info_component/UIC_update_travel_plan/index.vue"
      ),
  },
  {
    path: "becompanion/:id",
    name: "becompanion",
    component: () => import("../../components/play_with/beCompanion.vue"),
    meta: {
      index: 7,
    },
  },
];

export default routes;
