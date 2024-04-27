<template>
  <div class="trendModule">
    <template v-if="!hasUpdates">
      <div class="emptyData">
        <el-empty image="http://127.0.0.1:3000/svg/xiaosi.gif" description="小丑，快点下面按钮发布动态">
          <el-button type="primary" @click="publish">发布动态</el-button>
        </el-empty>
        <!-- <button class="publishBtn" @click="publish">发布动态</button> -->
      </div>
    </template>

    <template v-else>
      <div v-for="(trend, index) in trendList" :key="trend._id" class="userTrendList">
        <div class="userTrendItem">
          <!-- 评论头部 -->
          <div class="userTrendItemHeader">
            <div class="left">
              <div class="userAvatar">
                <img :src="trend.currentUserAvatar" alt="用户头像">
              </div>
              <div class="basicInfo">
                <div class="userName"><span>Jie</span></div>
                <div class="createTime"><span>{{ trend.createTime }}</span></div>
              </div>
            </div>
            <div class="right">
              <el-dropdown>
                <svg class="icon" aria-hidden="true" @click="operation">
                  <use xlink:href="#icon-caidan "></use>
                </svg>
                <template #dropdown>

                  <el-dropdown-menu>
                    <div class="operationItem">
                      <!-- <el-dropdown-item><svg class="icon" aria-hidden="true" @click="operation">
                          <use xlink:href="#icon-yijianfankui"></use>
                        </svg><span style="margin-left: 0.5rem;" @click="editTrend(trend._id)">
                          编辑</span></el-dropdown-item> -->
                      <el-dropdown-item>
                        <svg class="icon" aria-hidden="true" @click="operation">
                          <use xlink:href="#icon-shanchu "></use>
                        </svg><span style="margin-left: 0.5rem;" @click="delTrend(index, trend._id)">
                          删除</span></el-dropdown-item>
                      <el-dropdown-item><svg class="icon" aria-hidden="true" @click="operation">
                          <use xlink:href="#icon-xiaoer "></use>
                        </svg><span style="margin:0 0.5rem;">
                          公开</span>
                        <el-switch v-model="trend.isPublic"
                          @change="purview(trend._id, trend.isPublic)" /></el-dropdown-item>
                    </div>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <!-- <svg class="icon" aria-hidden="true" @click="operation">
                <use xlink:href="#icon-caidan "></use>
              </svg> -->
            </div>
          </div>
          <!-- 评论中间内容 -->
          <div class="userTrendItemContent">
            <div class="content">{{ trend.content }}</div>
            <div class="photo">
              <img v-for="photo in trend.photos" :src="photo.path" alt="photo">
            </div>
          </div>
          <!-- 评论尾部 -->
          <div class="userTrendItemBottom">
            <div class="left">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tubiaozhizuomoban"></use>
              </svg>
              <span>{{ trend.view }}</span>
            </div>
            <div class="right">
              <span> <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-dianzan1"></use>
                </svg>{{ trend.like }}</span>
              <span> <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-pinglun2"></use>
                </svg>❤</span>
              <span> <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhuanfa"></use>
                </svg>{{ trend.forward }}</span>
            </div>
          </div>

        </div>
      </div>
    </template>

    <el-dialog v-model="publishDialogState" title="发布个人动态" width="800">
      <publishUpdates @success_publish="successPublish"></publishUpdates>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onBeforeMount, reactive, computed, watch, watchEffect } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import publishUpdates from './user_trend_component/UTC_publish_updates/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import useUserDynamicStore from '../../stores/user_dynamic_store/index'


const useUserDynamic = useUserDynamicStore();

const hasUpdates = ref(useUserDynamic.hasUserDynamic)


// 存储用户动态的数组
const trendList = ref([]);
// 获得当前路由实例
const route = useRoute();
const userId = ref(route.params.id);

const publishDialogState = ref(false);

onBeforeMount(async () => {
  await getTrendList()
});

const successPublish = async () => {
  publishDialogState.value = false;
  await getTrendList();
}

//  编辑动态
// const editTrend = (id) => {
//   console.log('editTrend', id);
// }

// 删除动态
const delTrend = (index, id) => {
  // 弹窗提示是否删除
  ElMessageBox.confirm('此操作将永久删除该动态, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteTrend(index, id);
  }).catch(() => {
    ElMessage.info('已取消删除');
  });

}

// 删除动态
const deleteTrend = async (index, id) => {
  // 注意delete与put请求的参数通常是放在url上的，而post请求的参数通常是放在请求体中的
  const result = await axios({
    method: 'delete',
    url: `/api/dynamic/${id}`
  });
  if (result.data.code == 200) {
    ElMessage.success('删除成功');
    trendList.value.splice(index, 1);
  } else {
    ElMessage.error('删除失败');
  }
}

// 设置权限
const purview = async (id, isPublicState) => {
  const result = await axios({
    method: 'put',
    url: `/api/dynamic/${id}`,
    data: {
      isPublic: isPublicState
    }
  });
  if (result.data.code == 200) {
    ElMessage.success('权限修改成功！');
  } else {
    ElMessage.error('修改失败');
  }
}


// 点击发布按钮
const publish = () => {
  publishDialogState.value = true;
}
// 获取用户动态
const getTrendList = async () => {
  const result = await axios({
    method: 'get',
    url: '/api/dynamic',
    params: {
      userId: userId.value
    }
  });
  // trendList.value = result.data;
  if (result.data.code == 200) {
    trendList.value = result.data.data;
  } else {
    ElMessage.error('获取动态失败');
  }
}
watch(trendList, (newVal, oldVal) => {
  // console.log('trendList', trendList.value.length);
  if (trendList.value.length == 0) {
    useUserDynamic.hasUserDynamic = false;
    hasUpdates.value = false;
  } else {
    useUserDynamic.hasUserDynamic = true;
    hasUpdates.value = true;
  }
}, { immediate: true })

// 右侧操作按钮
const operation = () => {
  console.log('operation');
}
</script>

<style lang="scss" scoped>
svg {
  &:hover {
    cursor: pointer;
  }
}

.trendModule {
  width: 100%;
  // background-color: red;

  .emptyData {
    position: absolute;
    width: 100%;
    // left: calc(50% - 150px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 200px);

    h1 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .publishBtn {
      padding: 0.5rem 2rem;
      background-color: #409eff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      &:hover {
        background-color: #000000;
        color: white;
      }
    }
  }
}

.userTrendList {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2rem;
  border-bottom: 1px solid #ccc;


  .userTrendItem {
    display: flex;
    flex-direction: column;

    .userTrendItemHeader {
      display: flex;
      // align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;

      .left {
        display: flex;

        .userAvatar {
          img {
            height: 3rem;
            width: 3rem;
            object-fit: cover;
            border-radius: 50%;
            border: 2px solid #000000;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.314);
          }
        }

        .basicInfo {
          margin-left: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .userName {
            font-size: 1.2rem;
            color: #333;
            font-weight: bold;
          }

          .createTime {
            font-size: 0.8rem;
            color: #666;
          }
        }
      }

      .right {
        svg {
          font-size: 1.5rem;
          color: #666;
          transition: all 0.3s;
          margin-right: 0.5rem;

          &:hover {
            cursor: pointer;
            color: #409eff;
          }
        }
      }




    }

    .userTrendItemContent {
      .content {

        font-size: 1rem;
        color: #333;
        margin-bottom: 1rem;
        line-height: 1.5rem;
      }

      .photo {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 1rem;

        img {
          width: 6rem;
          height: 6rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.245);
          object-fit: cover;
        }

        .addPhoto {
          width: 6rem;
          height: 6rem;
          // background-color: #ffffff;
          border: 1px dashed #000000;
          transition: all 0.3s;
          border-radius: 0.5rem;

          .icon {
            width: 3rem;
            height: 3rem;
            margin: 1.5rem;
            transition: all 0.3s;

            &:hover {
              cursor: pointer;
              transform: scale(1.2);
            }
          }

          &:hover {
            border: 1px dashed #409eff;
          }
        }
      }
    }

    .userTrendItemBottom {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;

      .left {
        font-size: 0.8rem;
        color: #666;
      }

      .right {
        font-size: 0.8rem;
      }

      svg {
        font-size: 1rem;
        margin-right: 0.2rem;
        color: #ccc;
      }

      span {
        margin-right: 1rem;
      }
    }
  }
}
</style>
