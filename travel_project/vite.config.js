import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueDevTools()],
  // 设置代理
  // // 配置根目录以@代表
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 9000,
    // 允许跨域
    cors: true,

    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
