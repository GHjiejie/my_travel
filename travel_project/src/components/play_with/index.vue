<template>
  <div class="companion">
    <div class="companion_searchBox">
      <el-input v-model="searchText" style="max-width: 600px" placeholder="请输入关键字" class="input-with-select">
        <template #prepend>
          <el-select v-model="defaultSelect" placeholder="类型选择" style="width: 115px">
            <el-option label="陪玩ID" value="1" />
            <el-option label="姓名" value="2" />
            <el-option label="联系方式" value="3" />
            <el-option label="城市" value="4" />

          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>
    </div>
    <div class="companionList">
      <TransitionGroup name="moveTop">
        <template v-if="filter_allcompanions.length === 0">
          <el-empty :image-size="200" />
        </template>
        <div class="companionItem" v-for="(item, index) in filter_allcompanions" :key="item._id">
          <div class="companionItem_info" @click="goCompanionDetail(item, index)">
            <div class="bgc_img">
              <img :src="item.avatar" alt="">
            </div>
            <div class="language">
              <el-button type="danger" size="small">{{ item.language[0] }}</el-button>
            </div>
            <div class="info">
              <div class="info_top">
                <span style=" font-weight: bold; margin-right: 1rem;">{{ item.username }}</span>
                <span>城市：{{ item.address }}</span>

              </div>
              <div class="info_bottom">
                <!-- <span style="">星级：</span><span style="color: red;margin-right: 1rem;">{{ item.starLevel }}星</span> -->
                <span style="margin-right: 0.5rem;">陪玩费:</span><span
                  style="color: red;font-size: 1rem;font-weight: bold;">￥{{
                    item.price
                  }}/天</span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount, watch, computed } from 'vue'
import useLoginUserInfoStore from '../../stores/login_user_info_store';
import axios from 'axios'
import { Search } from '@element-plus/icons-vue'
const loginUserInfo = useLoginUserInfoStore();
const all_companions = ref([]);
const searchText = ref('');
const defaultSelect = ref('2');


const filter_allcompanions = computed(() => {
  return all_companions.value.filter(item => {
    if (defaultSelect.value === '1') {
      return item._id.includes(searchText.value);
    } else if (defaultSelect.value === '2') {
      return item.username.includes(searchText.value);
    } else if (defaultSelect.value === '3') {
      return item.phone.includes(searchText.value);
    } else if (defaultSelect.value === '4') {
      return item.address.includes(searchText.value);
    }
  });
});
const goCompanionDetail = () => {
  console.log('goCompanionDetail');

}

onBeforeMount(async () => {
  await getGetAllCompanion();
});

const getGetAllCompanion = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/companion/getAllCompanion'
  });
  if (res.data.code === 200) {
    loginUserInfo.all_companion_info = res.data.data;
  }
}
// 监听里面的数据
watch(() => loginUserInfo.all_companion_info, (newVal, oldVal) => {
  all_companions.value = newVal;
  console.log('all_companions', all_companions.value);
}, { deep: true });

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

.companion {
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  background-image: url('http://localhost:3000/svg/pexels-pok-rie-33563-139975.jpg');
  background-size: cover;


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

  .companion_searchBox {
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

  .companionList {
    position: relative;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    width: 60%;
    margin: 0 auto;
    height: calc(100vh - 60px);
    overflow: auto;
    // border: 1px solid #000000;

    .companionItem {
      display: flex;

      .companionItem_info {
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