<template>
  <div class="detail">
    <!-- 用户详细头部 -->
    <div class="detail_left">
      <template v-if="currentUserFriends.includes(currentUserInfo._id)">
        <div class="yourFriend"><span>你的好友</span></div>
      </template>
      <template v-else>
        <!-- <div class="beFriendBtn" @click="addFriend(currentUserInfo._id)"><span>加为好友</span></div> -->
        <div class="beFriendBtn" @click="apply(currentUserInfo._id)"><span>申请成为好友</span></div>

      </template>
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
        <span v-for="(item, index) in currentUserInfo.tags" :key="index">{{ item }}</span>
      </div>
    </div>



    <!-- 用户详细底部 -->
    <div class="detail_right">
      <div class="DR_top">
        <p class="intro">{{ currentUserInfo.introduction }}</p>
      </div>
      <div class="DR_center">
        <div class="DRC_left">
          <div class="DRC_album">
            <span>用户相册</span>
            <template v-if="currentUserInfo.privateAlbum.length !== 0">
              <div class="photosList">
                <img :src="item.path" alt="" v-for="(item, index) in currentUserInfo.privateAlbum">
              </div>
            </template>
            <template v-else>
              <div>该用户暂时还没有添加照片哦</div>
            </template>

          </div>


          <div class="DRC_travel_plan">
            <span>用户旅游计划</span>
            <template v-if="currentUserTravelPlan.length !== 0">
              <div class="planList">
                <div class="planItem" v-for="(item, index) in currentUserTravelPlan ">
                  <div class="planItem_left">
                    <div class="plan_title">{{ item.travelTitle }}</div>
                    <div class="plan_return_time">{{ item.returnTime }}</div>
                    <template v-if="item.isAchieved">
                      <div class="isAchieved">计划是否已经实现:是</div>
                    </template>
                    <template v-else>
                      <div class="isAchieved">计划是否已经实现:否</div>
                    </template>
                  </div>
                  <div class="planItem_right">
                    <button>与他联系</button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div>该用户暂时还没有添加旅游计划哦</div>
            </template>
          </div>
          <!-- <div class="DRC_dynamic">
            <span>用户动态</span>
            <div class="user_dynamic_list">
              <div class="dynamic_item" v-for="(item, index) in currentuserDynamic">

              </div>
            </div>
          </div> -->
        </div>
        <div class="DRC_right">
          <div class="DRC_hobbies">
            <span class="hobbies_title">兴趣爱好</span>
            <ul>
              <li v-for="(item, index) in currentUserInfo.hobbies" :key="index">{{ item }}</li>
            </ul>
          </div>
          <div class="divider"></div>
          <div class="DRC_media">
            <span class="media_title">社交媒体</span>
            <div class="qq">qq :{{ currentUserInfo.qq }}</div>
            <div class="wechat">微信:{{ currentUserInfo.wechat }}</div>
            <div class="phone">手机号:{{ currentUserInfo.phone }}</div>
            <div class="email">邮箱:{{ currentUserInfo.email }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import useCurrentUserDetailStore from '../../../../stores/current_user_detail_store';
import useUserLoginStore from '../../../../stores/user_login_store';
import useLoginUserInfoStore from '../../../../stores/login_user_info_store';
import { ElMessage } from 'element-plus';
import axios from 'axios';
const currentUserDetailStore = useCurrentUserDetailStore();
const userLoginStore = useUserLoginStore();
const loginUserInfoStore = useLoginUserInfoStore();

const login_user_id = ref(userLoginStore.login_userId)
const currentUserInfo = ref({});
const currentUserTravelPlan = ref({});
const currentUserFriends = ref([]);
// const applyState = ref('申请添加好友')

onBeforeMount(() => {
  currentUserInfo.value = currentUserDetailStore.currentUserDetail;
  // console.log(currentUserInfo.value);
  currentUserTravelPlan.value = currentUserDetailStore.currentuserTravel;
  currentUserFriends.value = loginUserInfoStore.login_user_info.friends;
  // console.log(currentUserFriends.value);
});

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
.detail {
  display: flex;
  width: 80%;
  margin: 0 auto;
  // background-color: red;

  .detail_left {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 30%;
    // height: 100%;
    background-color: #f8ede4;
    // background-color: red;
    border-radius: 0.5rem;
    padding: 2rem;

    .yourFriend {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      background-color: #ccc;
      display: flex;
      align-items: center;
      transition: all 0.3s;
      border-radius: 0.5rem;

      &:hover {
        cursor: pointer;
        background-color: rgb(47, 206, 255);
      }

      span {
        font-size: 0.8rem;
        font-weight: bold;
        padding: 0.1rem 0.5rem;
        color: rgb(0, 0, 0);
      }
    }

    .beFriendBtn {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9;
      background-color: #cd9954;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      transition: all 0.3s;

      &:hover {
        cursor: pointer;
        background-color: greenyellow;
      }

      span {
        font-size: 0.8rem;
        font-weight: bold;
        padding: 0.1rem 0.5rem;
        color: rgb(0, 0, 0);
      }
    }

    .top {


      img {
        width: 8rem;
        height: 8rem;
        border-radius: 50%;
      }

    }

    .center {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .center_top {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 1rem;

        .userName {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .user_id {
          padding-top: 0.5rem;
          font-size: 0.8rem;
          color: #ccc;
        }
      }

      .center_center {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 1rem;

        span {
          font-size: 0.8rem;
          margin: 0.5rem;
          font-weight: bold;
        }

        .CC_left {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          // background-color: red;
          border-right: 1px solid #d3cfcf99;
          padding-right: 1rem;



        }

        .CC_right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding-left: 1rem;


        }

      }

    }

    .bottom {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1rem;

      span {
        font-size: 0.8rem;
        display: inline-block;
        padding: 0.1rem 0.5rem;
        margin: 0.5rem;
        background-color: #cd9954;
        border-radius: 2rem;
      }
    }



  }

  .detail_right {
    width: 70%;
    // height: 100%;
    // background-color: #f8ede4;
    background-color: white;
    margin-left: 1rem;

    .DR_top {
      padding: 1rem;
      background-color: #f8ede4;
      border-radius: 0.5rem;



      .intro {
        text-indent: 2em;
        font-size: 0.8rem;
        font-style: italic;
        color: black;
      }
    }

    .DR_center {
      margin-top: 1rem;
      display: flex;
      width: 100%;

      .DRC_left {
        width: 70%;
        background-color: #f8ede4;
        margin-right: 1rem;
        border-radius: 0.5rem;

        .DRC_album {
          padding: 1rem;
          background-color: #f8ede4;
          border-radius: 0.5rem;

          span {
            display: block;
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }

          .photosList {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            // background-color: red;
            height: 30vh;
            overflow: auto;
            border-left: 3px solid #d3cfcf99;
            border-right: 3px solid #d3cfcf99;

            img {
              width: 5rem;
              height: 5rem;
              border-radius: 0.5rem;
              margin: 0.5rem;
              object-fit: cover;
            }
          }
        }



        .DRC_travel_plan {
          // margin-top: 1rem;
          padding: 1rem;
          background-color: #f8ede4;
          border-radius: 0.5rem;

          span {
            display: block;
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }

          .planList {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            height: 30vh;
            overflow: auto;
            // background-color: red;

            .planItem {
              width: 100%;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #d3cfcf99;
              padding: 0 0.5rem;
              padding-bottom: 0.5rem;

              .planItem_left {
                .plan_title {
                  font-size: 0.8rem;
                  // font-weight: bold;
                }

                .plan_return_time {
                  font-size: 0.7rem;
                  color: #b4a8a8;
                  padding: 0.5rem 0;
                }

                .isAchieved {
                  font-size: 0.7rem;
                  color: #b4a8a8;
                  // margin-bottom: 0.5rem;
                }

              }

              .planItem_right {
                display: flex;
                justify-content: center;
                align-items: center;

                button {
                  border: none;
                  background: none;
                  color: blue;
                  // background-color: black;
                }
              }



            }
          }
        }

      }

      .DRC_right {

        padding: 1rem;
        width: 30%;
        background-color: #f8ede4;
        border-radius: 0.5rem;





        .DRC_hobbies {
          display: flex;
          flex-direction: column;
          // align-items: flex-start;
          justify-content: center;

          .hobbies_title {
            display: block;
            font-size: 1rem;
            font-weight: bold;
            // margin: 1rem;
          }


          ul {
            // list-style: none;
            padding-left: 2rem;
            margin-top: 1rem;

            li {
              padding: 0.2rem;
            }

          }
        }

        .divider {


          border-bottom: 3px solid #d3cfcf99;
          margin: 1rem 0;
        }

        .DRC_media {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;


          .media_title {
            display: block;
            font-size: 1rem;
            font-weight: bold;
            margin: 1rem 0;
          }

          div {
            font-size: 0.8rem;
            // font-weight: bold;

            padding: 0.2rem;
            margin: 0.6rem;
            border-radius: 1rem;
            // background-color: #cd9954;
          }
        }


      }
    }

  }
}
</style>