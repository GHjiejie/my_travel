import { createRouter, createWebHistory } from "vue-router";
import user from "../components/users/users.vue";
import login from "../components/login/login.vue";
import homeRouterConfig from "./config.js";

const routes = [
  {
    path: "/",
    //  重定向
    redirect: "/login",
  },
  // 登录模块
  {
    path: "/login",
    name: "Login",
    component: login,
  },
  // 注册模块
  {
    path: "/register",
    name: "Register",
    component: () => import("../components/register/register.vue"),
  },
  // 首页
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/home/home.vue"),
  },
  // 未知页
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/404/404.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// home动态路由配置(相对于配置子路由，router-view在不同页面中互不干扰)
homeRouterConfig.forEach((item) => {
  router.addRoute("Home", item);
});

export default router;
