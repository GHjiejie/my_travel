<template>
  <div class="user_info">
    <div class="info_content_box">
      <!-- 头部标题 -->
      <div class="info_top_title" id="user_main_info">
        <p class="title">主要信息</p>
        <!-- <p class="subtitle">我是次要标题，用于提醒用户相关信息</p> -->
      </div>
      <!-- 头部用户头像 -->
      <div class="info_user_avatar">
        <div class="header_img">
          <img :src="`${current_user_info.avatar}`" alt="">
        </div>
        <div class="introduction">
          <!-- 用户个性签名 -->
          <div class="user_signature">{{ current_user_info.signature }}</div>
          <!-- 用户简介 -->
          <div class="user_introduction">{{ current_user_info.introduction }}</div>
        </div>
      </div>
      <!-- 用户ID -->
      <!-- <div class="user_info_id">
        <span class="user_id">用户ID : {{ current_user_info._id }}</span>
      </div> -->
      <!-- 分割线 -->
      <div class="divider"></div>

      <div class="detail_info">
        <!-- 用户基本信息 -->
        <div class="info_row" ref="info_row_username">
          <div class="left_icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yonghunicheng_ic
"></use>
            </svg>
          </div>
          <div class="center_content">
            <div class="top">用户昵称</div>
            <div class="bottom">{{ current_user_info.username }}</div>
          </div>
        </div>
        <div class="info_row" ref="info_row_username">
          <div class="left_icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-yonghuID
"></use>
            </svg>
          </div>
          <div class="center_content">
            <div class="top">用户ID</div>
            <div class=" bottom">{{ current_user_info._id }}</div>
          </div>
        </div>
        <div class="info_row" ref="info_row_username">
          <div class="left_icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xingbie1"></use>
            </svg>
          </div>
          <div class="center_content">
            <div class="top">性别</div>
            <div class="bottom">{{ current_user_info.sex }}</div>
          </div>
        </div>

        <div class="info_row" ref="info_row_username">
          <div class="left_icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shengri-xuanzhong"></use>
            </svg>
          </div>
          <div class="center_content">
            <div class="top">用户生日</div>
            <div class="bottom">{{ current_user_info.birthday }}</div>
          </div>
        </div>
        <div class="info_row" ref="info_row_username">
          <div class="left_icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xingquaihao--"></use>
            </svg>
          </div>
          <div class="center_content">
            <div class="top">兴趣爱好</div>
            <div class="bottom">
              <span v-for="item in current_user_info.hobbies" :key="item">{{ item }} </span>
            </div>

          </div>
        </div>
        <div class="info_row" ref="info_row_username">
          <div class="left_icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiaoer"></use>
            </svg>
          </div>
          <div class="center_content">
            <div class="top">身份</div>
            <div class="bottom">{{ current_user_info.role }}</div>
          </div>
        </div>

        <!-- 用户家庭住址 -->
        <div class="info_title" id="user_address">用户家庭住址</div>
        <div class="info_row" ref="info_row_username">
          <div class="left_icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-weizhi1"></use>
            </svg>
          </div>
          <div class="center_content">
            <div class="top">当前所处城市</div>
            <div class="bottom">{{ current_user_info.currentCity }}</div>
          </div>
        </div>

        <div class="info_row" ref="info_row_username">
          <div class="left_icon">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-Supervision-05"></use>
            </svg>
          </div>
          <div class="center_content">
            <div class="top">居住地</div>
            <div class="bottom">{{ current_user_info.address }}</div>
          </div>
        </div>
      </div>

      <!-- 用户社交媒体 -->
      <div class="info_title" id="user_media">用户社交媒体</div>
      <div class="info_row" ref="info_row_username">
        <div class="left_icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-weixin1"></use>
          </svg>
        </div>
        <div class="center_content">
          <div class="top">微信</div>
          <div class="bottom">{{ current_user_info.wechat }}</div>
        </div>
      </div>
      <div class="info_row" ref="info_row_username">
        <div class="left_icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-QQ"></use>
          </svg>
        </div>
        <div class="center_content">
          <div class="top">qq</div>
          <div class="bottom">{{ current_user_info.qq }}</div>
        </div>
      </div>

      <div class="info_row" ref="info_row_username">
        <div class="left_icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dianhua"></use>
          </svg>
        </div>
        <div class="center_content">
          <div class="top">手机号</div>
          <div class="bottom">{{ current_user_info.phone }}</div>
        </div>
      </div>

      <!-- 我的旅游计划 -->
      <div class="info_title" id="user_travel_plan">用户旅游计划</div>

      <template v-if="!computed_travelPlan">
        <userTravelPlan :userId="current_user_id"></userTravelPlan>
      </template>
      <template v-else>
        <h5>用户暂时没有计划哦</h5>
      </template>

      <!-- 个人相册 -->
      <div class="info_title" id="user_private_photos">我的相册</div>
      <KeepAlive>
        <userAlbum></userAlbum>
      </KeepAlive>
    </div>

    <!-- 右侧操作栏 -->
    <div class="info_operation">
      <div class="info_operation_list">
        <span class="info_page_nav">本页目录</span>
        <div class="convenient_nav">
          <a href="#user_main_info">主要信息</a>
          <a href="#user_address">家庭住址</a>
          <a href="#user_media">社交媒体</a>
          <a href="#user_travel_plan">旅游计划</a>
          <a href="#user_private_photos">个人相册</a>
        </div>
        <span class="operation_title">操作</span>
        <div class="operation_item">
          <!-- <button type="primary" @click="create_user_card">生成个人名片</button> -->
          <!-- <router-link :to="`/user/createUserCard/` + `${route.params.id}`">生成个人名片</router-link> -->
          <!-- <a href="">生成个人名片</a> -->
          <router-link :to="`/user/update/` + `${route.params.id}`">修改用户信息</router-link>
          <!-- <button type="info" @click="update_user_info">修改用户信息</button> -->
          <!-- <button @click="publish_travel_plans">发布旅游计划</button> -->
          <router-link :to="`/user/createTravelPlan/` + `${route.params.id}`">发布旅游计划</router-link>
          <a @click="publishTrend">发布动态</a>
          <el-badge :value="friendApplyNumber" class="item" :max="9" :show-zero="false" style="margin-top:0.5rem;">
            <a @click="showFrinedApplication">好友申请列表</a>
          </el-badge>

          <!-- <button @click="update_user_photos">更新个人相册</button> -->

          <!-- <router-link :to="`/user/updateAlbum/` + `${route.params.id}`">更新个人相册</router-link> -->
        </div>
      </div>
    </div>
    <!-- 个人动态发布 -->
    <el-dialog v-model="publishDialogState" title="发布个人动态" width="800">
      <publishUpdates @publish_success="publishSuccess"></publishUpdates>
    </el-dialog>
    <!-- 好友申请处理 -->
    <el-dialog v-model="showFrinedApplicationState" title="好友申请处理" width="800">
      <friendsApply @agreeApply="agreeApply"></friendsApply>
    </el-dialog>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onBeforeMount, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import userTravelPlan from './user_info_component/UIC_create_travel_plan/index.vue'
import userAlbum from './user_info_component/UIC_photos/index.vue'
import publishUpdates from './user_trend_component/UTC_publish_updates/index.vue'
import useLoginUserInfoStore from '../../stores/login_user_info_store/index'
import friendsApply from './user_friends_component/UFC_applyList/index.vue'
const loginUserInfoStore = useLoginUserInfoStore();



// 获取当前路由实例
const route = useRoute();

const current_user_id = ref('');

// 获取当前用户信息
const current_user_info = ref({});

// 创建用户旅游计划对象变量
const current_user_travel_plan = ref([]);

// 创建用户相册对象变量
// const current_user_album = ref([]);

// 发布动态对话框状态
const publishDialogState = ref(false);

// 好友申请列表
const showFrinedApplicationState = ref(false);

const showFrinedApplication = () => {
  // console.log('查看好友申请列表');
  showFrinedApplicationState.value = true;
}

const friendApplyNumber = ref(0);

// 用户个人相册状态
const user_photos_state = ref(false);

const agreeApply = async () => {
  showFrinedApplicationState.value = false;
  // 重新获取用户信息
  await getUserInfo(current_user_id.value);
}


// 判断用户是否有旅游计划
const computed_travelPlan = computed(() => {

  if (current_user_travel_plan.value.length == 0) {
    return true;
  } else {
    return false;
  }
})

// 挂载之前获取用户ID
onBeforeMount(async () => {
  current_user_id.value = route.params.id;
  await getUserInfo(current_user_id.value);
});

// 挂载之后
onMounted(() => {
  // 获取所有带有锚点链接的元素
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  // 监听点击事件(实现锚点的平滑滚动效果)
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // 浏览器默认行为，过渡效果是瞬间的，我们要阻止默认行为，使用js实现过渡效果
      e.preventDefault();

      // 获取锚点的id，同时去掉#号
      const targetId = this.getAttribute('href').substring(1);

      // 获取目标元素
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

})

// 发布动态
const publishTrend = () => {
  // console.log('发布动态');
  publishDialogState.value = true;
}
// 接受子组件传递的数据，表示用户发布动态成功
const publishSuccess = () => {
  publishDialogState.value = false;
}

// 根据用户id获取用户信息
const getUserInfo = async (id) => {
  const res = await axios({
    method: 'get',
    url: `/api/users`,
    params: {
      id: id
    }
  });
  current_user_info.value = res.data.data;
  current_user_travel_plan.value = res.data.data.travelPlan;
  loginUserInfoStore.login_user_info = res.data.data;
  friendApplyNumber.value = res.data.data.applyList.length;
}

// 监听好友申请列表的变化
watch(() => loginUserInfoStore.login_user_info, (newVal, oldVal) => {
  friendApplyNumber.value = newVal.applyList.length;
}, { deep: true });
</script>



<style lang="scss" scoped>
.forward-leave-active {
  transition: 0.6s;
  opacity: 0;
  transform: translateX(-100%);
  // transform: translate(-100%, -100%);
  position: absolute;
}

.forward-enter-from {
  transform: translateX(100%);
  // transform: translate(100%, 100%);
  opacity: 0;
}

.forward-enter-active {
  transition: 0.6s;
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



.divider {
  width: 100%;
  height: 1px;
  background-color: #cccccc9b;
  margin-top: 1rem;
}

.info_title {
  font-size: 1rem;
  font-weight: bold;
  margin: 2rem 0;
}

.info_row {
  // background-color: red;
  display: flex;
  align-items: center;
  transition: all 0.3s ease-in-out;
  border-bottom: 1px solid #cccccc8b;
  padding: 1rem 0;




  .left_icon {

    font-size: 1.5rem;
    color: #ccc;
    margin-right: 2rem;
  }

  .center_content {
    // position: absolute;
    // left: 5%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    // padding: 0 1rem;

    .top {
      color: #ccc;
      font-size: 0.9rem;
    }

    .bottom {
      font-size: 1rem;
      color: rgb(0, 0, 0);
      font-weight: bold;

      span {
        padding: 0 0.5rem;
      }
    }
  }

}

.user_info {
  position: absolute;
  width: 100%;
  // background-color: red;
  display: flex;
  // justify-content: center;

  // padding: 0 3rem;
  // border-left: 1px solid #ccc;
  // border-right: 1px solid #ccc;
  z-index: -999;



  .info_content_box {
    // position: relative;
    // position: absolute;
    width: 80%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #ccc;
    // background-color: green;
    padding: 0 2.5rem;

    // overflow: hidden;
    // box-sizing: border-box;

    .info_top_title {
      padding: 1rem 0;

      .title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 0.8rem;

      }

      .subtitle {
        font-size: 0.8rem;
        // color: #666;
        color: #ccc;

      }
    }

    .info_user_avatar {
      display: flex;
      justify-content: flex-start;

      img {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        object-fit: cover;
      }

      .introduction {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        gap: 0.5rem;
        margin-left: 1rem;

        .user_signature {
          font-size: 0.8rem;
          font-weight: bold;
          color: #ccc;
        }

        .user_introduction {
          font-size: 0.8rem;
          color: rgb(58, 55, 55);
        }
      }
    }




  }

  .info_operation {
    width: 20%;
    display: flex;
    flex-direction: column;

    align-items: center;
    // margin: 0 auto;

    .info_page_nav {
      font-size: 1rem;
      font-weight: bold;
      color: black;
      margin-top: 1rem;
      display: block;
    }

    .operation_title {
      display: block;
      font-size: 1rem;
      font-weight: bold;
      color: black;
      font-weight: bold;
      margin-top: 2rem;
    }

    .info_operation_list {

      position: fixed;

      // background-color: red;


      .convenient_nav {
        // width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 1rem;
        // background-color: red;

        a {
          padding: 0.5rem;
          font-size: 1rem;
          color: #ccc;
          transition: all 0.3s ease-in-out;
          cursor: pointer;

          &:hover {
            color: #000;
          }

        }
      }

      .operation_item {
        // background-color: red;
        display: flex;
        flex-direction: column;

        a {
          padding: 0.5rem;
          font-size: 1rem;
          color: #ccc;
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          // background-color: red;

          &:hover {
            color: #000;
          }
        }
      }

    }
  }
}
</style>
