<template>
  <div class="user">
    <div class="user_aside" @click="getcurrentIndex">
      <!-- 用户个人动态 -->
      <a href="#trend" :data-index="0">个人动态</a>
      <!-- 用户个人信息 -->
      <a href="#info" :data-index="1">个人信息</a>
      <!-- 用户订单 -->
      <a href="#order" :data-index="2">订单</a>
      <!-- 用户收藏 -->
      <a href="#collects" :data-index="3">收藏</a>
      <!-- 用户好友 -->
      <a href="#friends" :data-index="4"> 好友</a>
      <!-- 成为导游 -->
      <a href="#guide" :data-index="5">成为导游</a>
    </div>
    <!-- 用户主体内容 -->
    <div class="user_main">
      <div id="trend">
        <user_trend></user_trend>
      </div>
      <div id="info">
        <user_info></user_info>
      </div>
      <div id="order">
        <user_order></user_order>
      </div>
      <div id="collects">
        <user_collects></user_collects>
      </div>
      <div id="friends">
        <user_friends></user_friends>
      </div>
      <div id="guide">
        <user_guide></user_guide>
      </div>
    </div>


  </div>
</template>

<script setup>
  import user_trend from './user_trend.vue';
  import user_info from './user_info.vue';
  import user_order from './user_order.vue';
  import user_collects from './user_collects.vue';
  import user_friends from './user_friends.vue';
  import user_guide from './user_be_guide.vue';

</script>

<style lang="scss" scoped>
  .forward-leave-active {
    transition: 0.6s;
    opacity: 0;
    transform: translateY(-100%);

    position: absolute;
  }

  .forward-enter-from {
    transform: translateY(100%);


    opacity: 0;
  }

  .forward-enter-active {
    transition: 0.6s;
  }

  /* 回退 */
  .back-leave-active {
    transition: 0.6s;
    opacity: 0;
    transform: translateY(100%);
    position: absolute;
  }

  .back-enter-from {
    transform: translateY(-100%);
    opacity: 0;
  }

  .back-enter-active {
    transition: 0.6s;
  }

  .user {
    .user_aside {

      position: fixed;
      left: 0;
      top: 0;
      width: 15%;
      height: calc(100vh - 60px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      a {
        padding: 2rem;
        color: black;
        font-weight: bold;
        transition: all 0.3s ease-in-out;

        &:hover {
          color: red;
        }
      }
    }

    .user_main {
      position: absolute;
      left: 15%;
      width: 85%;
      background-color: #790e0e;


    }
  }
</style>