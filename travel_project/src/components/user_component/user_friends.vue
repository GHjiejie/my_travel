<template>
  <div class="friendList">
    <template v-if="friendList.length == 0">
      <div class="nodata">
        <el-empty :image-size="300" image="http://127.0.0.1:3000/svg/sad.gif" description="好可怜，连好友都没有">
        </el-empty>
      </div>
    </template>
    <TransitionGroup name="list">
      <div class="friendItem" v-for="(item, index) in friendList" :key="item._id">
        <div class="friendItem_info">
          <div class="left">
            <div class="avatar">
              <img :src="item.avatar" alt="">
            </div>
            <div class="user_info">
              <span class="username">{{ item.username }}</span>
              <span class="age">{{ item.age }} 岁</span>
            </div>

          </div>
          <div class="right">
            <el-button type="danger" @click="delFriends(item._id, index)">删除好友</el-button>
            <el-button type="primary" @click="goUserDetail(item)">查看详情</el-button>
            <el-button type="info" @click="chatWithUser(item._id)">与他聊天</el-button>
          </div>
        </div>
      </div>
    </TransitionGroup>
    <el-dialog v-model="view_user_detail_state">
      <userDetail></userDetail>
    </el-dialog>
  </div>
</template>

<script setup>

import { ref, onBeforeMount, watch } from 'vue'
import useLoginUserInfoStore from '../../stores/login_user_info_store';
import useCurrentUserDetailStore from '../../stores/current_user_detail_store';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import userDetail from './user_friends_component/UFC_detail/isFriend.vue';
const router = useRouter();
const loginUserInfo = useLoginUserInfoStore();
const currentUserDetailInfo = useCurrentUserDetailStore();
const currentUser_friends_id = ref([]);
const friendList = ref([]);

const view_user_detail_state = ref(false);

onBeforeMount(async () => {
  currentUser_friends_id.value = loginUserInfo.login_user_info.friends;
  // console.log(' 查看当前用户的所有好友id', currentUser_friends_id.value);
  await getFriendsInfo();
});

// 跳转到用户详情页
const goUserDetail = async (item) => {
  view_user_detail_state.value = true;
  currentUserDetailInfo.currentUserDetail = item;
  // console.log('输出当前用户详细信息', currentUserDetailInfo.currentUserDetail);
  // router.push({ path: `/detail/${id}` });
}

// watch(() => currentUserDetailInfo.currentUserDetail, (newVal, oldVal) => {

// });


// 执行输出操作
const delFriendsRequest = async (id, index) => {
  const res = await axios({
    method: 'delete',
    url: '/api/friends',
    data: {
      userId: loginUserInfo.login_user_info._id,
      friendId: id
    }
  });
  if (res.data.code == 200) {
    ElMessage.success('已删除好友');
    // 重新获取当前用户详情
    await getUserInfo(loginUserInfo.login_user_info._id);
    // friendList.value.splice(id, 1);
    // loginUserInfo.user_friends.splice(index, 1);
  }
}
// 重新获取用户个人信息
const getUserInfo = async (id) => {
  const res = await axios({
    method: 'get',
    url: `/api/users`,
    params: {
      id: id
    }
  });
  if (res.data.code == 200) {
    loginUserInfo.login_user_info = res.data.data;
  }
}
// 监听当前用户的好友信息
watch(() => loginUserInfo.login_user_info, (newVal, oldVal) => {
  currentUser_friends_id.value = loginUserInfo.login_user_info.friends;
  friendList.value = [];
  getFriendsInfo();
}, { deep: true })

// 删除好友
const delFriends = async (id, index) => {
  ElMessageBox.confirm('确定删除好友吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await delFriendsRequest(id, index);
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}



// 与用户聊天
const chatWithUser = async (id) => {
  // router.push({ path: `/chat` });
  // 跳转到聊天页面
  router.push({ path: `/chat/${id}` })
}

// 根据用户的id获取用户的好友信息
const getFriendsInfo = async () => {
  for (let i = 0; i < currentUser_friends_id.value.length; i++) {
    const res = await axios({
      method: 'get',
      url: '/api/users',
      params: {
        id: currentUser_friends_id.value[i]
      }
    });
    friendList.value.push(res.data.data);
    // console.log(friendList.value);
  }
  loginUserInfo.user_friends = friendList.value;
  // console.log('user_friends:', loginUserInfo.user_friends);
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
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}

.nodata {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);

}

.friendList {
  display: flex;
  flex-direction: column;

  .friendItem_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #ccc;

    .left {
      display: flex;
      align-items: center;

      .avatar {
        img {
          width: 5rem;
          height: 5rem;
          border-radius: 50%;
          object-fit: cover;
        }
      }


      .user_info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: 1rem;

        .username {
          font-size: 1rem;
          font-weight: bold;
        }

        .age {
          font-size: 0.75rem;
          color: #ccc;

        }

      }


    }

    .right {
      display: flex;
      align-items: center;

      button {
        margin-left: 1rem;
      }
    }

  }


}
</style>