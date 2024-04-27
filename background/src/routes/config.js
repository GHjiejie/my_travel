import { createRouter } from "vue-router";

const homeRouterConfig = [
  // 用户管理模块

  // 用户列表
  {
    path: "/user/userList",
    name: "userList",
    component: () => import("@/components/users/userList.vue"),
  },
  // 用户权限管理
  {
    path: "/user/userRole",
    name: "userRole",
    component: () => import("@/components/users/userRole.vue"),
  },

  // 导游管理模块

  // 导游列表
  // {
  //   path: "/guide/guideList",
  //   name: "guideList",
  //   component: () => import("@/components/guides/guideList.vue"),
  // },
  // 导游资格审核
  {
    path: "/guide/guideCheck",
    name: "guideCheck",
    component: () => import("@/components/guides/guideCheck.vue"),
  },

  // 陪玩模块

  // 陪玩资格审查
  {
    path: "/companion/companionCheck",
    name: "companionCheck",
    component: () => import("@/components/companions/companionCheck.vue"),
  },

  // 订单管理模块

  // 订单列表
  {
    path: "/order/orderList",
    name: "orderList",
    component: () => import("@/components/orders/orderList.vue"),
  },
  // 订单查询
  {
    path: "/order/orderSearch",
    name: "orderSearch",
    component: () => import("@/components/orders/orderSearch.vue"),
  },
  // 订单详情
  {
    path: "/order/orderDetail",
    name: "orderDetail",
    component: () => import("@/components/orders/orderDetail.vue"),
  },
  // 订单审核
  {
    path: "/order/orderCheck",
    name: "orderCheck",
    component: () => import("@/components/orders/orderCheck.vue"),
  },
  // 订单统计
  {
    path: "/order/orderStatistics",
    name: "orderStatistics",
    component: () => import("@/components/orders/orderStatistics.vue"),
  },
  // 订单评价
  // {
  //   path: "/order/orderComment",
  //   name: "orderComment",
  //   component: () => import("@/components/orders/orderComment.vue"),
  // },
  // 订单退款
  {
    path: "/order/orderRefund",
    name: "orderRefund",
    component: () => import("@/components/orders/orderRefund.vue"),
  },
  // 订单退款审核
  {
    path: "/order/orderRefundCheck",
    name: "orderRefundCheck",
    component: () => import("@/components/orders/orderRefundCheck.vue"),
  },
  // 订单退款统计
  {
    path: "/order/orderRefundStatistics",
    name: "orderRefundStatistics",
    component: () => import("@/components/orders/orderRefundStatistics.vue"),
  },

  // 系统管理模块
];

export default homeRouterConfig;
