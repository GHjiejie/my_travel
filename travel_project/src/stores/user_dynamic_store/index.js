import { defineStore } from "pinia";
import { ref } from "vue";
const useUserDynamicStore = defineStore(
  "user_dynamic_state",
  () => {
    // 显示是否有用户动态
    const hasUserDynamic = ref(false);

    return {
      hasUserDynamic,
    };
  },
  // 开启持久化
  {
    persist: {
      enabled: true,
    },
  }
);
export default useUserDynamicStore;
