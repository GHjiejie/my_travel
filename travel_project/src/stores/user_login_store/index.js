import { defineStore } from "pinia";
import { ref } from "vue";

const useUserLoginStore = defineStore(
  // 状态管理模块的名称,
  "user_login_state",
  () => {
    const isLogin = ref(false);
    const login_userName = ref("");
    const login_userId = ref("");
    const login_out = () => {
      isLogin.value = false;
      login_userName.value = "";
    };
    return {
      isLogin,
      login_userName,
      login_out,
      login_userId,
    };
  },

  // 开启持久化存储
  {
    persist: {
      enabled: true,
    },
  }
);
export default useUserLoginStore;
