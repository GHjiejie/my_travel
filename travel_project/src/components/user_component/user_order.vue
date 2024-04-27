<template>
  <div class="order">
    <div class="left">
      <router-view v-slot="{ Component }">
        <transition name="list">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <div class="right">
      <router-link :to="`/user/order/${currentUserId}/allOrders`">全部订单</router-link>
      <router-link :to="`/user/order/${currentUserId}/unpaidOrders`">待付款</router-link>
      <a @click="backSale">退款/售后</a>
      <!-- <router-link :to="`/user/order/${currentUserId}/refund`">退款/售后</router-link> -->
      <!-- <router-link :to="`/user/order/${currentUserId}/uncommentedOrders`">待评价</router-link> -->
      <a @click="comment_order">待评价</a>
    </div>
  </div>

</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import useLoginUserInfoStore from '../../stores/login_user_info_store';
import { ElMessage } from 'element-plus';
const route = useRoute();
const loginUserInfoStore = useLoginUserInfoStore();
const currentUserId = ref('');
onBeforeMount(() => {
  currentUserId.value = loginUserInfoStore.login_user_info._id;
});

const comment_order = () => {
  ElMessage({
    message: '请用户自行前往导游详情页进行评价！',
    type: 'info'
  });
}

const backSale = () => {
  ElMessage({
    message: '暂未开放',
    type: 'warning'
  });
}
</script>

<style lang="scss" scoped>
.list-move,
/* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}

.order {
  display: flex;
  position: relative;

  .left {
    width: 80%;
    // background-color: green;
    border-right: 1px solid rgb(229, 223, 223);
    height: calc(100vh - 60px);
    overflow: auto;
  }

  .right {

    width: 20%;
    height: 50vh;

    // background-color: red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;


    a {
      color: rgb(0, 0, 0);
      font-size: 1rem;
      font-weight: bold;
      text-decoration: none;

      &:hover {
        color: rgb(255, 0, 0);
      }
    }

  }


}
</style>