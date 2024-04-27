<template>
  <div class="user_travel">
    <div class="travel_plan" v-for="(item, index) in userTravelPlans" :key="item._id">
      <div class="TP_top_box">
        <div class="TP_title">{{ item.travelTitle }}</div>
        <div class="TP_operation">
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link">
              操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="delete_plan(item._id)">删除计划</el-dropdown-item>
                <el-dropdown-item @click="update_plan(item._id)">更新计划</el-dropdown-item>
                <el-dropdown-item @click="share_plan">分享计划</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <template v-if="!item.updateTime">
        <div class="updateTime">计划最近更新时间：<span> {{ item.createTime }}</span></div>
      </template>
      <template v-else>
        <div class="updateTime"> 计划最近更新时间：<span>{{ item.updateTime }}</span></div>
      </template>
      <div class="divider"></div>
      <div class="TP_content">
        <div class="TP_create_time">计划创建时间 ：{{ item.createTime }}</div>
        <div class="TP_currentCity">当前城市 ：{{ item.currentCity }}</div>
        <div class="TP_destinationCity">目的城市 ：{{ item.destinationCity }}</div>
        <div class="TP_departureTime">出发时间 : {{ item.departureTime }}</div>
        <div class="TP_returnTime">返回时间 ：{{ item.returnTime }}</div>
        <div class="TPR_contactInformation">用户联系方式 ：{{ item.contactInformation }}</div>
      </div>
      <div class="TP_remarks">
        <div class="TP_remarks_title">备注</div>
        <div class="TP_remarks_content">
          <div class="TPR_numberOfpeople">出行人数 ：{{ item.numberOfPeople }}</div>
          <div class="TPR_remarks">{{ item.remarks }}</div>
          <div class="TPR_isAchieved">{{ computed_isAchieved }}</div>
        </div>
      </div>
    </div>
    <div class="showMore">
      <button @click="showMorePlan" ref="showMoreRef">{{ travel_state_des }}</button>
    </div>
    <!-- <div class="noData" v-if="!hasPlan">
      <h5>用户暂时没有计划哦</h5>
    </div> -->
  </div>
</template>

<script setup>
  import { ref, defineProps, watchEffect, defineEmits, onMounted, computed, watch, onBeforeMount } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  // import updateTravelPlan from '../UIC_update_travel_plan/index.vue'
  // import updateTravelPlan from './create_travel_plan.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const router = useRouter();

  // 判断是否有用户计划
  const hasPlan = ref(true);
  // 为显示更多按钮添加ref，
  const showMoreRef = ref(null);
  // 自定义事件
  const props = defineProps({
    userId: String,
  });

  const { userId } = props;


  // const travelId = ref('');

  const pageSize = 1; // 每页显示的数据条数
  const currentPage = ref(1); // 当前页数

  // 是否还有更多数据的标识
  const hasMoreData = ref(true);

  // 显示数据的状态
  const travel_state_des = ref('显示更多');


  // 存储当前的用户旅游计划
  const userTravelPlans = ref([]);




  // 挂载之前
  onBeforeMount(async () => {
    // console.log('userId', userId);
    await getUserTravelPlanById();
  });

  // 为用户计划的展示更多按钮添加点击事件
  onMounted(() => {
    showMoreRef.value.addEventListener('click', showMorePlan);
  })


  // 根据用户id获取用户的计划
  const getUserTravelPlanById = async () => {
    const result = await axios({
      method: 'get',
      url: '/api/travelplan',
      params: {
        userId: userId,
        pageSize: pageSize,
        currentPage: currentPage.value
      }
    });
    console.log('获取用户计划', result.data.data);
    if (result.data.code === 200) {
      userTravelPlans.value = result.data.data;
      currentPage.value = currentPage.value + 1;
    } else {
      ElMessage({
        type: 'error',
        message: '获取用户计划失败'
      });
    }

  }
  // 根据旅游计划id删除计划
  const deletePlanById = async (id) => {
    const result = await axios({
      method: 'delete',
      url: '/api/travelplan',
      params: {
        travelId: id,
        userId: userId
      }
    });
    if (result.data.code === 200) {
      userTravelPlans.value = userTravelPlans.value.filter(item => item._id !== id);
      ElMessage({
        type: 'success',
        message: '删除成功!'
      });
    } else {
      ElMessage({
        type: 'error',
        message: '删除失败'
      });
    }
  }
  // 删除计划
  const delete_plan = (id) => {
    // 弹窗提示是否删除
    ElMessageBox.confirm('此操作将永久删除该计划, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        await deletePlanById(id);
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消删除'
        });
      });

  };


  // 更新计划
  const update_plan = (id) => {
    router.push(`/user/updateTravelPlan/${id}`);
    // console.log('更新计划,输出计划id', id);
  };

  const share_plan = () => {
    console.log('分享计划');
  };

  // 展示更多计划
  const showMorePlan = async () => {
    if (hasMoreData.value) {
      const result = await axios({
        method: 'get',
        url: '/api/travelplan',
        params: {
          userId: userId,
          pageSize: pageSize,
          currentPage: currentPage.value
        }
      });
      if (result.data.code === 200) {

        if (result.data.data.length < pageSize) {
          // 修改标记，不再请求数据
          hasMoreData.value = false;
          travel_state_des.value = '没有更多数据了';
        }
        userTravelPlans.value = [...userTravelPlans.value, ...result.data.data];
        currentPage.value = currentPage.value + 1;
        return true;
      } else {
        ElMessage({
          type: 'error',
          message: '获取用户计划失败'
        });

      }
    } else {
      return;
    }
  };


  // 是否有旅游计划
  // const hasPlan = computed(() => {
  //   return userTravelPlans.value.length > 0;
  // });


  // 使用计算属性computed_isAchieved来判断是否已经完成
  const computed_isAchieved = computed(() => {
    return userTravelPlans.value.isAchieved ? '已完成' : '未完成';
  });



</script>

<style lang="scss" scoped>
  .example-showcase .el-dropdown+.el-dropdown {
    margin-left: 15px;
  }

  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }

  .updateTime {
    font-size: 0.7rem;
    color: #666;
    margin-bottom: 1rem;

    span {
      font-weight: bold;
      color: red;
    }
  }

  .divider {
    width: 100%;
    border-bottom: 2px solid #f9a826;
    margin: 1rem 0;
  }

  .travel_plan {
    background-color: #ffffff;
    border-radius: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.295);
    padding: 1rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s;

    .TP_top_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // background-color: yellow;

      .TP_title {
        width: 100%;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .TP_operation {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 1rem 0;

        .el-dropdown {
          .el-dropdown-link {
            cursor: pointer;
            color: #007bff;
            display: flex;
            align-items: center;
          }
        }
      }
    }



    .TP_content {
      div {
        padding: 0.8rem 0;

      }

      .TP_create_time,
      .TP_currentCity,
      .TP_destinationCity,
      .TP_departureTime,
      .TP_returnTime,
      .TPR_contactInformation {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .TP_create_time,
      .TP_currentCity,
      .TP_destinationCity {
        font-weight: bold;
        color: #333;
      }

      .TP_departureTime,
      .TP_returnTime {
        color: #666;
      }

      .TPR_contactInformation {
        color: #007bff;
        // text-decoration: underline;

        &:hover {
          cursor: pointer;
          color: #0056b3;
        }
      }

      div:last-child {
        border: none;
        margin-bottom: 0.5rem;
      }
    }


    .TP_remarks {
      .TP_remarks_title {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
      }

      .TP_remarks_content {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .TPR_numberOfpeople {
          font-size: 16px;
          color: #333;
        }

        .TPR_remarks {
          font-size: 16px;
          color: #333;
        }

        .TPR_isAchieved {
          font-size: 16px;
          color: #ff6347;
        }
      }
    }
  }

  .showMore {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.295);
      color: #ffffff;
      border: none;
      border-radius: 2rem;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #0056b3;
      }
    }
  }



</style>