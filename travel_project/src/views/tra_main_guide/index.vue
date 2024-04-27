<template>
  <div class="guide">
    <div class="guide_searchBox">
      <el-input v-model="searchText" style="max-width: 600px" placeholder="请输入关键字" class="input-with-select">
        <template #prepend>
          <el-select v-model="defaultSelect" placeholder="类型选择" style="width: 115px">
            <el-option label="导游ID" value="1" />
            <el-option label="导游姓名" value="2" />
            <el-option label="导游联系方式" value="3" />
            <el-option label="城市" value="4" />
            <el-option label="语言" value="5" />

          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>
    </div>

    <!-- 寻找的导游列表 -->
    <div class="guideList">
      <TransitionGroup name="moveTop">
        <template v-if="filter_guideCollection.length == 0">
          <el-empty :image-size="200" />
        </template>
        <div class="guideItem" v-for="(item, index) in filter_guideCollection" :key="item._id">
          <div class="guideItem_info" @click="goGuideDetail(item, index)">
            <div class="bgc_img">
              <img :src="item.guideAvatar" alt="">
            </div>
            <div class="language">
              <el-button type="danger" size="small">{{ item.guideLanguage[0] }}</el-button>
            </div>
            <div class="info">
              <div class="info_top">
                <span style=" font-weight: bold; margin-right: 1rem;">{{ item.guideName }}</span>
                <span style="margin-right: 0.5rem;">导付费:</span><span
                  style="color: red;font-size: 1rem;font-weight: bold;">￥{{
                    item.servicePrice
                  }}/天</span>
              </div>
              <div class="info_bottom">
                <span style="">星级：</span><span style="color: red;margin-right: 1rem;">{{ item.starLevel }}星</span>
                <span>城市：{{ item.guideServiceArea }}</span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <el-dialog v-model="view_guide_state" :show-close="false">
      <guideDetail></guideDetail>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed, watch } from 'vue'
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import useLoginUserInfoStore from '@/stores/login_user_info_store/index.js';
import guideDetail from '@/components/user_component/user_guide_component/UGC_guide_detail/index.vue'
const loginUserInfo = useLoginUserInfoStore();

// const router = useRouter();
const pageSize = 12;
const currentPage = 1;
const guideCollection = ref([]);
const view_guide_state = ref(false);

const searchText = ref('');
const defaultSelect = ref('2');
const view_guide_info_index = ref('');
// const need_view_guide_id = ref('');

// 下面代码有一个问题，就是有新的导游注册后，需要重新获取所有导游信息，但是这个页面没有监听新导游注册的事件，所以需要在导游注册成功后，手动刷新一下这个页面
onBeforeMount(async () => {
  if (!loginUserInfo.allGuideInfo) {
    // console.log('没有缓存所有导游数据');
    await getAllUGuides();
  } else {
    // console.log('有缓存所有导游数据');
    guideCollection.value = loginUserInfo.allGuideInfo;
  }
});

// 跳转到用户详情页
const goGuideDetail = async (item, index) => {
  // console.log('index', index);
  view_guide_info_index.value = index;
  loginUserInfo.viewGuide = item;
  // need_view_guide_id.value = id;
  view_guide_state.value = true;
}

// 监听查看的导游信息
watch(() => loginUserInfo.viewGuide, async (newVal, oldVal) => {
  // console.log('发现viewGuide发生变化', newVal);
  loginUserInfo.viewGuide = newVal;
  loginUserInfo.allGuideInfo[view_guide_info_index.value] = newVal;
}, { deep: true });

// 监听导游的所有信息
watch(() => loginUserInfo.allGuideInfo, (newVal, oldVal) => {
  // console.log('allGuideInfo发生变化', newVal);
  guideCollection.value = newVal;
}, { deep: true })


// 筛选导游
const filter_guideCollection = computed(() => {
  if (searchText.value) {
    return guideCollection.value.filter((item) => {
      if (defaultSelect.value == '1') {
        return item._id.includes(searchText.value);
      } else if (defaultSelect.value == '2') {
        return item.guideName.includes(searchText.value);
      } else if (defaultSelect.value == '3') {
        return item.guidePhone.includes(searchText.value);
      } else if (defaultSelect.value == '4') {
        return item.guideServiceArea.includes(searchText.value);
      } else if (defaultSelect.value == '5') {
        return item.guideLanguage.includes(searchText.value);
      }
    });
  } else {
    return guideCollection.value;
  }
})

// 获取所有的用户数据
const getAllUGuides = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/guide/allGuide',
    params: {
      pageSize,
      currentPage
    }
  });
  if (res.data.code == 200) {
    loginUserInfo.allGuideInfo = res.data.data;
    // guideCollection.value = res.data.data;
    // loginUserInfo.allGuideInfo = res.data.data;
    // console.log(loginUserInfo.allGuideInfo);
  }
};

</script>

<style lang="scss" scoped>
.moveTop-enter-active,
.moveTop-leave-active {
  transition: all 0.3s;
}

.moveTop-enter,
.moveTop-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.moveTop-leave-active {
  position: absolute;
}

.moveTop-move {
  transition: all 0.3s;

}



:deep(.el-dialog) {
  background-color: rgb(255, 255, 255);
  box-shadow: none;
  border-radius: 10px;
}

.guide {
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-image: url('http://localhost:3000/svg/pexels-photo-635279.jpeg');
  background-size: cover;
  height: calc(100vh - 60px);

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

  .guide_searchBox {
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

  .guideList {
    position: relative;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    height: calc(100vh - 200px);
    overflow: auto;
    gap: 1rem;
    width: 60%;
    margin: 0 auto;
    // border: 1px solid #000000;

    .guideItem {
      display: flex;



      .guideItem_info {
        width: 12rem;
        height: 15rem;
        position: relative;



        .bgc_img {
          img {
            width: 12rem;
            height: 15rem;
            border-radius: 1rem 0 1rem 0;
            object-fit: cover;
          }
        }

        .language {
          position: absolute;
          top: 0;
          right: 0;
        }

        .info {
          position: absolute;
          bottom: 0;
          width: 12rem;
          background-color: #0000008f;
          color: white;
          transition: all 0.3s;
          border-radius: 0 0 1rem 0;

          .info_top {
            display: flex;
            justify-content: flex-start;
            padding: 0.5rem;
            font-size: 0.8rem;
            align-items: center;
          }

          .info_bottom {
            display: flex;
            justify-content: flex-start;
            padding: 0 0.5rem;
            padding-bottom: 0.5rem;
            font-size: 0.8rem;
            align-items: center;

          }


        }
      }

      &:hover {
        cursor: pointer;

        // .guideItem_info {
        //   .info {
        //     opacity: 0.2;
        //   }
        // }
      }
    }
  }
}
</style>
