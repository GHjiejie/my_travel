import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

// 导入pinia持久化插件
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

// 导入路由模块
import router from "./routes/index";

// 导入element plus库
import ElementPlus from "element-plus";

// 导入element plus库样式
import "element-plus/dist/index.css";

// 导入axios拦截器全局配置
import "./utils/axios_overall";

import "./assets/iconfonts/iconfont";

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

// 将路由实例挂载到全局
app.use(router);

app.use(pinia);

// 将element plus 组件库样式挂载到根节点
app.use(ElementPlus);

// 挂载根节点
app.mount("#app");
