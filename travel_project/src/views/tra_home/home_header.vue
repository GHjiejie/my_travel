<template>
  <div>
    <!-- 导航栏 -->
    <div class="header">
      <div class="header-left">
        <!-- <div class="logo">logo</div> -->
        <img src="../../assets/images/logo.jpg" alt="">
      </div>

      <div class="header-center">
        <router-link to="/home">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shouye-xuanzhong1x"></use>
          </svg>
          首页
        </router-link>
        <router-link to="/friend">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhaopengyouff"></use>
          </svg>
          找驴友</router-link>
        <router-link to="/guide">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-daoyou1"></use>
          </svg>
          导游</router-link>
        <router-link to="/playwith">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xingquaihao1"></use>
          </svg>
          陪玩</router-link>
        <!-- <router-link to="/square">广场</router-link> -->
      </div>

      <div class="header-right">
        <template v-if="userLoginStore.isLogin">
          <span>
            <svg class="icon" aria-hidden="true" style="margin-right:0.5rem;font-size:1.2rem;">
              <use xlink:href="#icon-welcome"></use>
            </svg>{{ userLoginStore.login_userName }}</span>
        </template>
        <router-link :to="target_url">{{ show_state }}</router-link>
        <template v-if="userLoginStore.isLogin">
          <a class="loginOut" @click="login_out">退出</a>
        </template>

      </div>

    </div>
    <div class="clearfix"></div>
  </div>
  <!-- 主体内容 -->
  <div class="content">
    <router-view v-slot="{ Component }">

      <Transition :name="routeDirectionStore.transition_direction">
        <!-- <KeepAlive> -->
        <component :is="Component" />
        <!-- </KeepAlive> -->
      </Transition>

    </router-view>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeMount, onMounted, watch } from 'vue'
// 获取当前的路由实例
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'

// import loginPanel from '../../components/login/login.vue'

import useUserLoginStore from '../../stores/user_login_store/index'

import useRouteDirectionStore from '../../stores/route_direction_store/index'


const userLoginStore = useUserLoginStore();

const routeDirectionStore = useRouteDirectionStore();

const selectedIndex = ref(0);


const login_user_name = ref('用户');
// login_userName

const show_state = computed(() => {
  return userLoginStore.isLogin ? '用户中心' : '登录';
});

const target_url = computed(() => {
  return userLoginStore.isLogin ? `/user/info/${userLoginStore.login_userId}` : '/login';
});



// 设置用户登录状态
const loginState = ref('');


const route = useRoute();
const router = useRouter();


const login_out = () => {
  userLoginStore.login_out();
  loginState.value = userLoginStore.isLogin;
  router.push('/home');
}

onMounted(() => {
  // console.log('loginState', loginState.value);
  loginState.value = userLoginStore.isLogin;
  login_user_name.value = userLoginStore.login_userName;
});

// watch(() => loginState.value, (newVal, oldVal) => {
//   console.log('loginState', newVal);
// });

</script>

<style scoped>
.forward-leave-active {
  transition: 0.6s;
  opacity: 0;
  transform: translateX(-100%);
  position: absolute;
}

.forward-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.forward-enter-active {
  transition: 0.6s;
}

.active {
  color: red;
}

/* 左滑动 */

.back-leave-active {
  transition: 0.6s;
  opacity: 0;
  transform: translateX(100%);
  position: absolute;
}

.back-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.back-enter-active {
  transition: 0.6s;
}
</style>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);

  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;

  .header-left {
    height: 60px;
    overflow: hidden;

    img {
      width: 4rem;
      height: 4rem;
      object-fit: cover;

    }

    // .logo {
    //   font-size: 1.5rem;
    //   font-weight: bold;
    // }
  }

  .header-center {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 2rem;

    svg {
      font-size: 1rem;
      margin-right: 0.5rem;
    }

    a {
      margin: 0 1rem;
      color: #333;
      font-size: 1rem;
    }
  }

  .header-right {
    a {
      margin: 0 1rem;
      color: #333;
      font-size: 1rem;
      transition: all 0.3;

      &:hover {
        color: #f00;
      }
    }
  }


}

.content {
  // width: 80%;


  width: 100%;
  // margin: 0 auto;
  // height: calc(100vh - 60px);
  margin-top: 60px;
  // background-color: rgb(238, 236, 236);

  // background-color: red;
}
</style>../../stores/route_direction_store/index