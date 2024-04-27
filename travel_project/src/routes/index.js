import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import home from "../views/tra_main_home/index.vue";

import userRoutesConfig from "./user_router/config.js";
import userFriendsConfig from "./find_travel_frinend_router/config.js";
import useRouteDirectionStore from "../stores/route_direction_store/index.js";
import login from "../components/login/login.vue";
import { ElMessageBox } from "element-plus";
import { ElMessage } from "element-plus";

// 设置路由实例
const router = createRouter({
  history: createWebHistory(),
  // 设置路由规则
  routes: [
    {
      path: "/",

      redirect: "/home",
      // component: () => import("../views/tra_home/index.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: home,
      meta: {
        index: 1,
      },
    },
    // 登录
    {
      path: "/login",
      name: "login",
      component: login,
    },
    // 注册
    {
      path: "/register",
      name: "register",
      component: () => import("../components/register/register.vue"),
    },
    // 找驴友
    {
      path: "/friend",
      name: "friend",
      component: () => import("../views/tra_main_findFriend/index.vue"),
      // children: [
      //   {
      //     path: "detail/:id",
      //     name: "detail",
      //     component: () =>
      //       import(
      //         "../components/user_component/user_friends_component/UFC_detail/index.vue"
      //       ),
      //   },
      // ],
      meta: {
        index: 2,
        // requireAuth: true,
      },
    },
    // 用户详情
    {
      path: "/detail/:id",
      name: "detail",
      component: () =>
        import(
          "../components/user_component/user_friends_component/UFC_detail/index.vue"
        ),
    },
    // 导游
    {
      path: "/guide",
      name: "guide",
      component: () => import("../views/tra_main_guide/index.vue"),

      meta: {
        index: 3,
        // requireAuth: true,
      },
    },
    // 导游详情
    {
      path: "/guideDetail/:id",
      name: "guide_detail",
      component: () =>
        import(
          "../components/user_component/user_guide_component/UGC_guide_detail/index.vue"
        ),
    },
    {
      path: "/playwith",
      name: "playwith",
      component: () => import("../components/play_with/index.vue"),
      meta: {
        index: 4,
      },
    },

    // 广场(暂时不用)
    // {
    //   path: "/square",
    //   name: "square",
    //   component: () => import("../views/tra_main_square/index.vue"),
    //   meta: {
    //     index: 4,
    //     // requireAuth: true,
    //   },
    // },
    // 个人主页
    {
      path: "/user",
      name: "user",
      component: () => import("../components/user_component/index.vue"),
      children: userRoutesConfig,
      meta: {
        requireAuth: true,
      },
      // 设置元属性
    },
    // 聊天
    {
      path: "/chat/:id",
      name: "chat",
      component: () => import("../components/chat/index.vue"),
      meta: {
        requireAuth: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const routeDirectionStore = useRouteDirectionStore();
  const fromIndex = from.meta.index;
  const toIndex = to.meta.index;
  //  routerDirectionStore.transition_direction=fromIndex>toIndex?"forword":"back";
  if (fromIndex < toIndex) {
    routeDirectionStore.transition_direction = "forward";
  } else {
    routeDirectionStore.transition_direction = "back";
  }

  // 先判断用户登录信息是否过期
  if (localStorage.getItem("token_two")) {
    next();
  } else {
    // 如果是登录页面，直接放行
    if (to.name === "login") {
      next();
    } else {
      // 否则，弹出提示框，提示用户登录信息已过期，需要重新登录
      ElMessageBox.confirm("您的登录信息已过期，请重新登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          next("/login");
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消登录",
          });
          next(false);
        });
    }
  }

  // 首先判断当前路由是否需要用户登录才可以访问
  // if (to.meta.requireAuth) {
  //   // console.log("当前路由需要用户登录才可以访问");
  //   // 在判断用户登录信息是否过期
  //   if (localStorage.getItem("token_two")) {
  //     // console.log("用户已经登录,并且登录信息没有过期");
  //     next();
  //   } else {
  //     ElMessageBox.confirm("您的登录信息已过期，请重新登录？", "提示", {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning",
  //     })
  //       .then(() => {
  //         next("/login");
  //       })
  //       .catch(() => {
  //         ElMessage({
  //           type: "info",
  //           message: "已取消登录",
  //         });
  //         next(false);
  //       });
  //   }
  // } else {
  //   next();
  // }
});

export default router;
