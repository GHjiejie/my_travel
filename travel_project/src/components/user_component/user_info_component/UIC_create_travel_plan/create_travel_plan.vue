<template>
  <div class="create_new_travel_plan">

    <el-page-header :icon="null" title="返回" @back="back_previous_page">
      <template #content>
        <span class="text-large font-600 mr-3"> 创建新的旅游计划 </span>
      </template>
    </el-page-header>


    <el-form :model="user_travel_plan" label-width="100px" :rules="form_rules" ref="travel_form_ref">
      <el-form-item label="旅游标题" prop="travelTitle">
        <el-input v-model="user_travel_plan.travelTitle"></el-input>
      </el-form-item>
      <el-form-item label=" 当前城市" prop="currentCity">
        <el-input v-model="user_travel_plan.currentCity"></el-input>
      </el-form-item>
      <el-form-item label="目的城市" prop="destinationCity">
        <el-input v-model="user_travel_plan.destinationCity"></el-input>
      </el-form-item>
      <el-form-item label="出发时间" prop="departureTime">
        <el-date-picker v-model="user_travel_plan.departureTime" type="date" format="YYYY/MM/DD"
          value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="返回时间" prop="returnTime">
        <el-date-picker v-model="user_travel_plan.returnTime" type="date" format="YYYY/MM/DD"
          value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="出行人数" prop="numberOfPeople">
        <el-input v-model="user_travel_plan.numberOfPeople"></el-input>
      </el-form-item>
      <el-form-item label="出行人员联系方式" prop="contactInformation">
        <el-input v-model="user_travel_plan.contactInformation"></el-input>
      </el-form-item>
      <el-form-item label="出行人员备注">
        <el-select v-model="user_travel_plan.remarks">
          <el-option label="无" value="无" />
          <el-option label="有老弱病残" value="有老弱病残" />
          <el-option label="有儿童" value="有儿童" />
          <el-option label="有孕妇" value="有孕妇" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(travel_form_ref)">提交</el-button>
        <el-button type="info">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { reactive, ref, onBeforeMount, defineProps, defineEmits, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  import { ElMessage } from 'element-plus';


  const route = useRoute();
  const router = useRouter();
  const userId = ref(route.params.id);

  const travel_form_ref = ref(null);

  const pageSize = 5; // 每页显示的数据条数
  const currentPage = ref(1); // 当前页数

  const current_user_max_plans = ref(5);
  const current_user_plans = ref(0);



  // console.log('我获取了travelId', travelId);

  const form_rules = reactive({
    travelTitle: [
      { required: true, message: '请输入旅游标题', trigger: 'blur' },
    ],
    currentCity: [
      { required: true, message: '请输入当前城市', trigger: 'blur' },
    ],
    destinationCity: [
      { required: true, message: '请输入目的城市', trigger: 'blur' },
    ],
    departureTime: [
      { required: true, message: '请选择出发时间', trigger: 'change' },
    ],
    returnTime: [
      { required: true, message: '请选择返回时间', trigger: 'change' },
    ],
    numberOfPeople: [
      { required: true, message: '请输入出行人数', trigger: 'blur' },
    ],
    contactInformation: [
      { required: true, message: '请输入出行人员联系方式', trigger: 'blur' },
    ],
  });

  // 挂载前
  onBeforeMount(async () => {
    await getUserTravelPlanById(userId.value);

  });

  // 根据用户id获取用户的计划
  const getUserTravelPlanById = async (userId) => {
    const result = await axios({
      method: 'get',
      url: '/api/travelplan',
      params: {
        userId: userId,
        pageSize: pageSize,
        currentPage: currentPage.value
      }
    });
    // console.log('获取用户计划', result.data.data);
    if (result.data.code === 200) {
      current_user_plans.value = result.data.data.length;
    } else {
      ElMessage({
        type: 'error',
        message: '获取用户计划失败'
      });
    }

  }
  // 创建新的旅游计划表单
  const user_travel_plan = reactive({
    userId: route.params.id,
    // 旅游标题
    travelTitle: '',
    currentCity: '',
    destinationCity: '',
    // 出发时间
    departureTime: '',
    // 返回时间
    returnTime: '',
    // 出行人数
    numberOfPeople: '',
    // 出行人员联系方式
    contactInformation: '',
    // 出行人员备注
    remarks: '',
    // 计划发布时间
    createTime: new Date().toLocaleString(),
    //计划更新时间
    updateTime: new Date().toLocaleString(),
    // 计划是否已实现
    isAchieved: false,
  });

  // 提交表单
  const submitForm = async (formRef) => {
    // 重新获取用户计划数量
    await getUserTravelPlanById(userId.value);
    if (current_user_plans.value >= current_user_max_plans.value) {
      ElMessage.error('用户计划数量已达上限,请购买会员提升计划存储数量');
      return;
    }

    formRef.validate(async (valid) => {
      if (valid) {
        // 说明验证通过
        // console.log('数据通过验证',);
        const res = await axios({
          method: 'post',
          url: '/api/travelplan',
          params: {
            id: route.params.id
          },
          data: user_travel_plan,
        });
        if (res.data.code === 200) {
          ElMessage.success('计划创建成功');
        } else {
          ElMessage.error('计划创建失败');
        }
      } else {
        console.log('数据验证失败')
        return false
      }
    });
  };

  // 回到上一页
  const back_previous_page = () => {
    router.go(-1);
  }

</script>

<style lang="scss" scoped>
  .create_new_travel_plan {
    background-color: white;
    width: 70%;
    padding: 1rem 2rem;

    .el-page-header {
      width: 100%;

      padding: 1rem 0.25rem;
    }

    .el-form {
      width: 100%;


      .el-form-item {

        width: 100%;
        padding: 0.3rem 1rem;
      }
    }

  }
</style>
