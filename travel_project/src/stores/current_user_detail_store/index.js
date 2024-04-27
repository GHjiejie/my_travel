import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
const useCurrentUserDetailStore = defineStore(
  "current_user_detail",
  () => {
    const currentUserDetail = ref({});
    const currentuserTravel = ref({});
    const currentUserDynamic = ref({});
    // const currentUserFriends = ref([]);
    // 设置当前用户详情
    const setCurrentUserDetail = async (id) => {
      const res = await axios({
        method: "get",
        url: "/api/users",
        params: {
          id: id,
        },
      });
      if (res.data.code == 200) {
        currentUserDetail.value = res.data.data;
        // currentUserFriends.value = res.data.data.friends;
        await setCurrentUserTravel(id);
        await setCurrentUserDynamic(id);
      }
    };
    // 设置当前用户旅行计划
    const setCurrentUserTravel = async (id) => {
      const res = await axios({
        method: "get",
        url: "/api/travelplan",
        params: {
          userId: id,
          pageSize: 5,
          currentPage: 1,
        },
      });
      currentuserTravel.value = res.data.data;
    };
    // 设置当前的用户动态
    const setCurrentUserDynamic = async (id) => {
      const res = await axios({
        method: "get",
        url: "/api/dynamic/public",
        params: {
          id: id,
        },
      });
      if (res.data.code == 200) {
        currentUserDynamic.value = res.data.data;
        // console.log(currentUserDynamic.value);
      }
    };
    return {
      currentUserDetail,
      currentuserTravel,
      // currentUserFriends,
      setCurrentUserDetail,
      setCurrentUserTravel,
      setCurrentUserDynamic,
    };
  },
  {
    // 开启持久化存储
    persist: true,
  }
);
export default useCurrentUserDetailStore;
