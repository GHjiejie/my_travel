import { defineStore } from "pinia";
import { ref } from "vue";
const useLoginAdminStore = defineStore(
  "login_admin",
  () => {
    const adminName = ref("");
    const adminPhone = ref("");
    const setAdminInfo = (name, phone) => {
      adminName.value = name;
      adminPhone.value = phone;
    };
    return {
      adminName,
      adminPhone,
      setAdminInfo,
    };
  },
  {
    persist: {
      enabled: true,
    },
  }
);
export default useLoginAdminStore;
