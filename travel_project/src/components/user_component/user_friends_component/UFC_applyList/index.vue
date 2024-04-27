<template>
  <div class="applyList">
    <TransitionGroup name="list">
      <div class="applyItem" v-for="item in userApplyDetail" :key="item._id">
        <div class="applyItem__avatar">
          <img :src="item.avatar" alt="avatar" />
        </div>
        <div class="applyItem__info">
          <div class="applyItem__info__name">{{ item.username }}</div>
          <div class="applyItem__info__email">{{ item.email }}</div>
        </div>
        <div class="applyItem__btn">
          <el-button type="primary" @click="agreeApply(item._id, index)">同意</el-button>
          <el-button type="danger" @click="refuseApply(item._id, index)">拒绝</el-button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, defineEmits } from 'vue';
import axios from 'axios'
import { ElMessage } from 'element-plus'
// import { Elmessage } from 'element-plus'
import useLoginUserInfoStore from '../../../../stores/login_user_info_store/index'

const loginUserInfo = useLoginUserInfoStore();

const currentUserFrindendApply = ref(loginUserInfo.login_user_info.applyList);
const userId = ref(loginUserInfo.login_user_info._id);
const userApplyDetail = ref([]);
// console.log(currentUserFrindendApply.value);
const emits = defineEmits(['agreeApply', 'refuseApply'])

onBeforeMount(async () => {
  await showApplyUser();
});

// 同意好友申请
const agreeApply = async (id, index) => {
  const res = await axios({
    method: 'post',
    url: `/api/friends/agree`,
    data: {
      userId: userId.value,
      applyId: id
    }
  });
  if (res.data.code == 200) {
    ElMessage.success('已同意好友申请');
    userApplyDetail.value.splice(index, 1);
    loginUserInfo.login_user_info.applyList = loginUserInfo.login_user_info.applyList.filter(item => item != id);
    emits('agreeApply');
  }
}

// 拒绝好友申请
const refuseApply = async (id, index) => {
  ElMessage.success('已拒绝好友申请');
}

// 显示所有申请好友的信息
const showApplyUser = async () => {
  currentUserFrindendApply.value.forEach(async (element) => {
    const res = await axios({
      method: 'get',
      url: `/api/users`,
      params: {
        id: element
      }
    });
    if (res.data.code == 200) {
      userApplyDetail.value.push(res.data.data);
    }
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
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}

.applyList {
  .applyItem {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;

    .applyItem__avatar {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }

    .applyItem__info {
      margin-left: 10px;

      .applyItem__info__name {
        font-size: 16px;
        font-weight: bold;
      }

      .applyItem__info__email {
        font-size: 14px;
        color: #666;
      }
    }

    .applyItem__btn {
      margin-left: auto;

      button {
        margin-left: 10px;
      }
    }
  }
}
</style>