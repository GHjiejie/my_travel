<template>
  <div class="user">
    <div class="user_aside">

      <!-- 用户个人信息 -->
      <router-link :to="`/user/info/${current_user_id}`"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gerenxinxi
"></use>
        </svg>个人信息</router-link>
      <!-- 用户个人动态 -->
      <router-link :to="`/user/trend/${current_user_id}`"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-gerendongtai"></use>
        </svg>个人动态</router-link>
      <!-- 用户好友 -->
      <router-link :to="`/user/friends/${current_user_id}`"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-daoyou1"></use>
        </svg>好友</router-link>
      <!-- 用户收藏 -->
      <!-- <router-link :to="`/user/collects/${current_user_id}`">收藏</router-link> -->
      <!-- 用户订单 -->
      <router-link :to="`/user/order/${current_user_id}/allOrders`"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-dingdan2
"></use>
        </svg>订单</router-link>
      <!-- 成为导游 -->
      <router-link :to="`/user/beguide/${current_user_id}`"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-daoyou"></use>
        </svg> 成为导游</router-link>
      <!-- 成为陪玩 -->
      <router-link :to="`/user/becompanion/${current_user_id}`"><svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-xingquaihao1"></use>
        </svg>成为陪玩</router-link>
    </div>
    <!-- 用户主体内容 -->
    <div class="user_main">
      <router-view v-slot="{ Component }">
        <!-- 下面代码是为了增加用户体验，否则切换路由时没有组件渲染，影响用户体验 -->
        <Transition :name="routeDirectionStore.transition_direction">
          <!-- <KeepAlive> -->
          <component :is="Component" />
          <!-- </KeepAlive> -->
        </Transition>
      </router-view>

    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeMount } from 'vue';
import useUserLoginStore from '../../stores/user_login_store';
import useRouteDirectionStore from '../../stores/route_direction_store/index'
const routeDirectionStore = useRouteDirectionStore();

const userLoginStore = useUserLoginStore();

const current_user_id = ref('')

onBeforeMount(() => {
  current_user_id.value = userLoginStore.login_userId;
})
</script>

<style lang="scss" scoped>
.back-leave-active {
  transition: 0.6s;
  opacity: 0;
  transform: translateY(-100%);

  position: absolute;
}

.back-enter-from {
  transform: translateY(100%);


  opacity: 0;
}

.back-enter-active {
  transition: 0.6s;
}

/* 回退 */
.forward-leave-active {
  transition: 0.6s;
  opacity: 0;
  transform: translateY(100%);
  position: absolute;
}

.forward-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.forward-enter-active {
  transition: 0.6s;
}
</style>

<style lang="scss" scoped>
.user {

  .user_aside {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    // top: 60px;
    left: 0;
    width: 15vw;
    // background-color: red;
    height: calc(100vh - 60px);
    border-right: 1px solid #ccc;

    svg {
      width: 20px;
      height: 20px;
      margin-right: 0.5rem;
    }

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
    position: relative;
    left: 15%;
    width: 85vw;
  }
}
</style>