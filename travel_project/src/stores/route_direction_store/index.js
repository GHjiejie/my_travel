import { defineStore } from "pinia";
import { ref } from "vue";
const useRouteDirectionStore = defineStore("current_direction_state", () => {
  const transition_direction = ref("forward");
  return {
    transition_direction,
  };
});
export default useRouteDirectionStore;
