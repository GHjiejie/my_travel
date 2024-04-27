<template>
  <div class="detail">

    <!-- 用户详细底部 -->
    <div class="detail_left">
      <div class="DL_person_intro">
        <span class="intro_title">个人简介</span>
        <p class="intro">{{ currentUserInfo.introduction }}</p>
      </div>
      <!-- 用户相册部分 -->
      <div class="DL_person_album">
        <template v-if="currentUserInfo.privateAlbum.length !== 0">
          <span class="album_title">用户相册</span>
          <div class="photosList">
            <div class="photoItem">
              <img :src="item.path" alt="" v-for="(item, index) in currentUserInfo.privateAlbum"
                @click="viewImg(item.path)">
            </div>
          </div>
        </template>
      </div>

      <template v-if="currentUserTravelPlan.length !== 0">
        <div class="DL_person_plan">
          <span class="DL_person_plan_title">用户旅游计划</span>
          <div class="planList">
            <div class="planItem" v-for="(item, index) in currentUserTravelPlan ">
              <div class="planItem_top">
                <div class="planItem_top_left">
                  <div class="plan_title">{{ item.travelTitle }}</div>
                  <!-- <div class="plan_return_time">返回时间:{{ item.returnTime }}</div> -->
                </div>
                <div class="planItem_top_right">
                  <el-button link type="primary" @click="contact(currentUserInfo._id)">与他联系</el-button>
                </div>
              </div>
              <div class="divider"></div>
              <div class="planItem_center">
                <div class="plan_main_info">
                  <span class="create_time"><span class="title">计划创建时间</span>：{{ item.createTime }}</span>
                  <span class="return_time"><span class="title">计划返回时间</span>：{{ item.returnTime }}</span>
                  <span class="current_city"><span class="title">当前城市：</span>{{ item.currentCity }}</span>
                  <span class="target_city"><span class="title">目的城市：</span>{{ item.destinationCity }}</span>
                  <span class="departureTime"><span class="title">出发时间：</span>{{ item.departureTime }}</span>
                  <span class="returnTime"><span class="title">返回时间：</span>{{ item.returnTime }}</span>
                </div>
              </div>
              <div class="planItem_bottom">
                <template v-if="item.isAchieved">
                  <el-tag type="success">计划是否已经实现:是</el-tag>
                </template>
                <template v-else>
                  <el-tag type="danger">计划是否已经实现:否</el-tag>
                </template>
              </div>

            </div>
          </div>
        </div>
      </template>

      <div class="DL_person_other">
        <div class="DL_hobbies">
          <span class="hobbies_title">兴趣爱好</span>
          <div class="hobbies_list">
            <el-tag type="warning" v-for="(item, index) in currentUserInfo.hobbies" :key="index">{{ item }}</el-tag>
          </div>
        </div>

        <div class="DL_media">
          <span class="media_title">社交媒体</span>
          <div class="qq"><span class="title">qq :</span>{{ currentUserInfo.qq }}</div>
          <div class="wechat"><span class="title">微信:</span>{{ currentUserInfo.wechat }}</div>
          <div class="phone"><span class="title">手机号:</span>{{ currentUserInfo.phone }}</div>
          <div class="email"><span class="title">邮箱:</span>{{ currentUserInfo.email }}</div>
        </div>
      </div>
    </div>


    <!-- 用户详细头部 -->
    <div class="detail_right">
      <div class="frend_judg">
        <template v-if="currentUserFriends.includes(currentUserInfo._id)">
          <div class="yourFriend"><el-tag type="success" size="small">你的好友</el-tag></div>
        </template>
        <template v-else>
          <!-- <div class="beFriendBtn" @click="addFriend(currentUserInfo._id)"><span>加为好友</span></div> -->
          <div class="beFriendBtn" @click="apply(currentUserInfo._id)"><el-tag type="primary"
              size="small">申请成为好友</el-tag>
          </div>
        </template>
      </div>

      <!-- <div class="beFriendBtn" @click="addFriend(currentUserInfo._id)"><span>加为好友</span></div> -->
      <div class="top">
        <img :src="currentUserInfo.avatar" alt="">
      </div>
      <div class="center">
        <div class="center_top">
          <span class="userName">{{ currentUserInfo.username }}</span>
          <span class="user_id">{{ currentUserInfo._id }}</span>
        </div>

        <div class="center_center">
          <div class="CC_left">
            <span>年龄</span>
            <span>性别</span>
            <span>状态</span>
            <span>受教育程度</span>
            <span>所在城市</span>
          </div>
          <div class="CC_right">
            <span>{{ currentUserInfo.age }}</span>
            <span>{{ currentUserInfo.sex }}</span>
            <!-- <span>{{ currentUserInfo.status }}</span> -->
            <span>正常</span>
            <!-- <span>{{ currentUserInfo.education }}</span> -->
            <span>研究生</span>
            <span>{{ currentUserInfo.currentCity }}</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <el-tag type="danger" v-for="(item, index) in currentUserInfo.tags" :key="index">{{ item }}</el-tag>
      </div>
    </div>
    <el-dialog v-model="viewUserImgState">
      <img :src="viewImgPath" alt="">
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import useCurrentUserDetailStore from '../../../../stores/current_user_detail_store';
import useUserLoginStore from '../../../../stores/user_login_store';
import useLoginUserInfoStore from '../../../../stores/login_user_info_store';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router'
const currentUserDetailStore = useCurrentUserDetailStore();
const userLoginStore = useUserLoginStore();
const loginUserInfoStore = useLoginUserInfoStore();

const login_user_id = ref(userLoginStore.login_userId)
const currentUserInfo = ref({});
const currentUserTravelPlan = ref({});
const currentUserFriends = ref([]);

const viewUserImgState = ref(false);
const viewImgPath = ref('');

const router = useRouter();

onBeforeMount(() => {
  currentUserInfo.value = currentUserDetailStore.currentUserDetail;
  // console.log(currentUserInfo.value);
  currentUserTravelPlan.value = currentUserDetailStore.currentuserTravel;
  currentUserFriends.value = loginUserInfoStore.login_user_info.friends;

});

// 预览图片
const viewImg = (path) => {
  viewUserImgState.value = true;
  viewImgPath.value = path;
}

// 联系好友
const contact = (id) => {
  // console.log(id);
  if (!currentUserFriends.value.includes(id)) {
    ElMessage.error('请先添加好友为好友！！！');
  }
  else {
    router.push({
      path: `/chat/${id}`
    });
  }
}

// 监听当前用户信息的变化
watch(() => currentUserDetailStore.currentUserDetail, (newVal, oldVal) => {
  currentUserInfo.value = newVal;
  currentUserTravelPlan.value = currentUserDetailStore.currentuserTravel;
  currentUserFriends.value = loginUserInfoStore.login_user_info.friends;
  // console.log(currentUserInfo.value);
});

// 申请添加好友
const apply = async (id) => {
  const res = await axios({
    method: 'post',
    url: '/api/friends/apply',
    data: {
      userId: login_user_id.value,
      friendId: id
    }
  });
  if (res.data.code === 200) {
    ElMessage.success('申请添加好友成功，等待对方同意');
    // applyState.value = '等待对方同意';
  } else {
    ElMessage.error(`${res.data.msg}`);
  }
}

// 添加用户好友
const addFriend = async (id) => {
  const res = await axios({
    method: 'post',
    url: '/api/friends',
    params: {
      userId: login_user_id.value,
      friendId: id
    }
  });
  if (res.data.code === 200) {
    ElMessage.success('添加好友成功');
  } else {
    ElMessage.error(`${res.data.msg}`);
  }
}


</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  box-shadow: none;
  background-color: #00000000;

}

.detail {
  display: flex;

  .detail_right {
    width: 30%;
    // background-color: red;
    display: flex;
    flex-direction: column;

    .frend_judg {
      display: flex;

      justify-content: flex-end;

      .beFriendBtn {
        .el-tag {
          transition: all 0.3s ease-in-out;

          &:hover {
            cursor: pointer;
            background-color: rgb(0, 0, 0);
            color: white;
          }
        }
      }
    }

    .top {
      margin: 1rem auto;

      img {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .center {
      display: flex;
      flex-direction: column;

      .center_top {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .userName {
          font-size: 1.2rem;
          font-weight: bold;
          color: black;
          text-align: center;
        }

        .user_id {
          font-size: 0.8rem;
          color: #ccc;
          text-align: center;
          margin-top: 0.5rem;
        }
      }

      .center_center {
        display: flex;
        // justify-content: space-around;
        margin: 1rem 0;

        .CC_left {
          width: 50%;
          // background-color: red;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          padding-right: 1rem;
          border-right: 1px solid #cccccc4d;

          span {
            color: #000000;
            font-weight: bold;
          }
        }

        .CC_right {
          width: 50%;
          // background-color: blue;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
          padding-left: 1rem;

          span {
            color: #000000;
            font-weight: bold;
          }
        }
      }


    }

    .bottom {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      // margin-top: 1rem;
      margin-right: 1rem;
    }

  }

  .detail_left {
    width: 70%;
    border-right: 1px solid #cccccc4d;

    // background-color: blue;
    .DL_person_intro {
      .intro_title {
        font-size: 0.8rem;
        font-weight: bold;
        color: black;
      }

      .intro {
        padding: 1rem;
        font-size: 0.8rem;
        color: #000000;
      }
    }

    .DL_person_album {

      .album_title {
        font-size: 0.8rem;
        font-weight: bold;
        color: black;

      }

      .photosList {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1rem;


        .photoItem {

          overflow: hidden;

          img {
            width: 5rem;
            height: 5rem;
            object-fit: cover;
            margin-right: 1rem;
            transition: all 0.3s ease-in-out;
            overflow: hidden;
            border-radius: 0.5rem 0 0.5rem 0;
            // border: 1px solid blue;

            &:hover {
              cursor: pointer;
              transform: scale(1.1);
              border-radius: 0 0.5rem 0 0.5rem;
              // border: 1px solid blue;
            }
          }

        }
      }
    }

    .DL_person_plan {
      display: flex;
      flex-direction: column;
      margin: 2rem 0;
      width: 80%;




      .DL_person_plan_title {
        font-size: 0.8rem;
        font-weight: bold;
        color: black;
      }

      .planList {
        display: flex;
        flex-direction: column;
        height: 50vh;
        overflow: auto;

        .planItem {
          padding: 1rem;
          margin: 1rem;
          box-shadow: 0 0 5px #ccc;


          .planItem_top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            align-items: center;

            .planItem_top_left {
              display: flex;
              flex-direction: column;

              .plan_title {
                font-size: 1rem;
                font-weight: bold;
                color: #000000;
              }

              // .plan_return_time {
              //   color: red;
              //   font-size: 0.8rem;
              // }
            }
          }

          .divider {
            width: 100%;
            height: 2px;
            background-color: rgba(255, 166, 0, 0.687);
            margin-bottom: 0.5rem;
          }

          .planItem_center {
            display: flex;
            flex-direction: column;

            .plan_main_info {
              display: flex;
              flex-direction: column;
              gap: 1rem;

              .return_time {
                color: red;
              }

              .title {
                color: #000000;
                font-weight: bold;
              }
            }
          }

          .planItem_bottom {
            margin-top: 1rem;
          }
        }
      }
    }

    .DL_person_other {
      .DL_hobbies {
        display: flex;
        flex-direction: column;

        .hobbies_title {
          font-size: 0.8rem;
          font-weight: bold;
          color: black;
        }

        .hobbies_list {
          margin: 0.5rem 0;
          width: 50%;
          display: flex;
          justify-content: space-around;
        }
      }

      .DL_media {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;

        .media_title {
          font-size: 0.8rem;
          font-weight: bold;
          color: black;
        }

        .title {
          font-size: 0.8rem;
          font-weight: bold;
          color: black;
          margin-right: 1rem;
          padding-left: 1rem;

        }

        .qq {
          color: #000000;
          font-size: 0.8rem;
        }

        .wechat {
          color: #000000;
          font-size: 0.8rem;
        }

        .phone {
          color: #000000;
          font-size: 0.8rem;
        }

        .email {
          color: #000000;
          font-size: 0.8rem;
        }
      }

    }

  }

}
</style>