<template>
  <div class="friend">
    <div class="friend_searchBox">
      <el-input v-model="searchText" style="max-width: 600px" placeholder="请输入关键字" class="input-with-select">
        <template #prepend>
          <el-select v-model="select" placeholder="类型选择" style="width: 115px">
            <el-option label="用户ID" value="1" />
            <el-option label="用户姓名" value="5" />
            <el-option label="用户联系方式" value="2" />
            <el-option label="居住城市" value="3" />
            <el-option label="性别" value="4" />
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>
    </div>

    <el-dialog v-model="panelState" width="35%" :draggable="true">
    </el-dialog>
    <!-- <div class="left"></div> -->
    <!-- 寻找的驴友列表 -->
    <div class="friendList">
      <template v-if="filter_friendCollection.length == 0">
        <el-empty :image-size="200" />
      </template>
      <TransitionGroup name="list">
        <div class="friendItem" v-for="(item, index) in filter_friendCollection" :key="item._id">
          <div class="friendItem_info">
            <div class="info_img">
              <img :src="item.avatar" alt="" @click.prevent="goUserDetail(item._id)">
            </div>

            <div class="sex">
              <el-tag type="danger" size="small"> {{ item.currentCity }}</el-tag>
            </div>
            <div class="main_info">
              <div class="main_info_top">
                <span class="userName">{{ item.username }}</span>
                <span class="userAge">{{ item.age }} 岁</span>

              </div>
              <div class="main_info_bottom">
                <!-- 兴趣爱好 -->
                <!-- <div class="addFriend">
                  <el-button type="success" size="small" link @click="addFriends">加为好友</el-button>
                </div> -->
              </div>
            </div>
          </div>
        </div>

      </TransitionGroup>
    </div>
    <el-dialog v-model="friend_detail_state" width="80%" :show-close="false">
      <KeepAlive>
        <friendDetail></friendDetail>
      </KeepAlive>
    </el-dialog>
  </div>

</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Search } from '@element-plus/icons-vue'
// import filterComponent from '../../components/filter_component/index.vue'

import useCurrentUserDetailStore from '../../stores/current_user_detail_store/index'
import useUserLoginStore from '../../stores/user_login_store/index'
import friendDetail from '@/components/user_component/user_friends_component/UFC_detail/index.vue'

const currentUserDetailStore = useCurrentUserDetailStore();

const userLoginStore = useUserLoginStore();

const router = useRouter();
const panelState = ref(false);

const currentUserId = ref(userLoginStore.login_userId)


const friend_detail_state = ref(false);

const pageSize = 12;
const currentPage = 1;
const select = ref('5');
const searchText = ref('');


const friendCollection = ref([]);
onBeforeMount(async () => {
  // 获取所有的用户数据
  await getAllUsers();
});


const filter_friendCollection = computed(() => {
  return friendCollection.value.filter(item => {
    if (select.value == 1) {
      return item._id.includes(searchText.value);
    } else if (select.value == 2) {
      return item.phone.includes(searchText.value);
    } else if (select.value == 3) {
      return item.currentCity.includes(searchText.value);
    } else if (select.value == 4) {
      return item.sex.includes(searchText.value);
    } else if (select.value == 5) {
      return item.username.includes(searchText.value);
    }
  });
});


// 加好友
const addFriends = () => {
  console.log('加好友');

}
// 跳转到用户详情页
const goUserDetail = async (id) => {
  await currentUserDetailStore.setCurrentUserDetail(id);
  friend_detail_state.value = true;
}

// 获取所有的用户数据
const getAllUsers = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/users/all',
    params: {
      id: currentUserId.value,
      pageSize,
      currentPage
    }
  });
  // console.log(res.data);
  if (res.data.code == 200) {
    friendCollection.value = res.data.data;
    console.log('用户的数据, ', friendCollection.value);
  }
};
</script>


<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}

.list-leave-active {
  position: absolute;
}

.list-move {
  transition: all 0.3s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}



.friend {
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  background-image: url('http://localhost:3000/svg/pexels-photo-635279.jpeg');
  background-size: cover;
  height: 100vh;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.319);
    /* 黑色遮罩层，透明度为0.5 */
    z-index: 1;
    /* 将遮罩层放在背景之上 */
    pointer-events: none;
    /* 遮罩层不响应鼠标事件 */
  }


  .friend_searchBox {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 1.5rem;
    // background-color: blue;

    input {
      background: none;
      border: none;
      width: 50%;
      // background-color: red;
      transition: all 0.3s;
      padding: 1rem;
      border-radius: 2rem;
      box-shadow: 5px 6px 10px rgba(0, 0, 0, .1);
      border: 2px solid #b4a8a8;

      &:hover {
        border: 2px solid #000000;
      }

      &::placeholder {
        color: #cac6c6;
        letter-spacing: 0.3rem;
        padding-left: 1rem;
        font-size: 0.8rem;
        font-style: italic;

      }
    }
  }

  // .left {
  //   position: absolute;
  //   left: 0;
  //   width: 20%;
  //   height: 100vh;
  //   background-color: #ff000034;
  // }

  // .right {
  //   position: absolute;
  //   right: 0;
  //   width: 20%;
  //   height: 100vh;
  //   background-color: #173cb74c;
  // }

  .friendList {
    position: relative;
    z-index: 999;
    width: 60%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1rem;
    // box-shadow: 0 0 2px #ccc;
    height: calc(100vh - 10rem);
    overflow: auto;
    // background-color: red;


    .friendItem {
      &:hover {
        cursor: pointer;
      }

      .friendItem_info {
        display: flex;
        position: relative;


        .info_img {
          img {
            width: 12rem;
            height: 15rem;
            object-fit: cover;
            border-radius: 2rem 0 2rem 0;
          }
        }

        .sex {
          position: absolute;
          top: 0;
          right: 0;
        }

        .main_info {
          padding: 0.5rem;
          position: absolute;
          bottom: 0;
          background-color: rgb(0, 0, 0);
          border-radius: 0 0 2rem 0;
          width: 12rem;


          .main_info_top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            // margin-bottom: 0.5rem;

            .userName {
              font-size: 0.8em;
              color: #fff;
            }

            .userAge {
              font-size: 0.8rem;
              color: rgb(255, 255, 255);
            }
          }

          .main_info_bottom {
            margin-top: 0.5rem;

            .addFriend {
              display: flex;
              justify-content: center;

            }
          }
        }
      }
    }
  }


}
</style>
