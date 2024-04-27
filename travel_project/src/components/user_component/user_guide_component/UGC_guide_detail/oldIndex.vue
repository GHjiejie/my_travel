<template>
  <div class="guideDetail">
    导游详情
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { ElMessage } from 'element-plus'
import useLoginUserInfoStore from '@/stores/login_user_info_store/index.js';
const loginUserInfo = useLoginUserInfoStore();
const currentGuideInfo = ref({});

onBeforeMount(() => {
  currentGuideInfo.value = loginUserInfo.viewGuide;
});
watch(() => loginUserInfo.viewGuide, (newVal, oldVal) => {
  currentGuideInfo.value = newVal;
});
</script>

<style lang="scss" scoped>
.guideDetail {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
  color: #333;
  background-color: red;
}
</style>