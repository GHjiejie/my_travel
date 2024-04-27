import { createApp } from "vue";
import router from "./routes/index";
import ElementPlus from "element-plus";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createPinia } from "pinia";
import "element-plus/dist/index.css";
import "./utils/axios_interceptor";
import App from "./App.vue";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.use(pinia);

app.mount("#app");
