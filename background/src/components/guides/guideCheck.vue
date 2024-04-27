<template>
  <div class="guideCheck">
    <el-table :data="allGudesPdf" style="width: 100%">
      <el-table-column label="用户ID" prop="userId">
        <template #default='scope'>
          <span class="userId">{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username">
        <template #default='scope'>
          <span class="username">{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="applyTime">
        <template #default='scope'>
          <span class="applyTime">{{ scope.row.applyTime }}</span>
        </template>

      </el-table-column>
      <el-table-column label="审核状态">
        <template #default="scope">

          <template v-if="scope.row.passStatus == 0">
            <el-tag type="danger" round>待审核</el-tag>
          </template>
          <template v-else>
            <el-tag type="success" round>已审核</el-tag>
          </template>

        </template>
      </el-table-column>
      <el-table-column label="是否通过" prop="isPass">
        <template #default="scope">

          <template v-if="scope.row.isPass">
            <el-tag type="success" round>通过</el-tag>
          </template>
          <template v-else>
            <el-tag type="danger" round>未通过</el-tag>
          </template>

        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="200">
        <template #default='scope'>
          <el-button link type="primary" size="small" @click="viewCertificate(scope.row.certificate)">查看证书</el-button>
          <template v-if="scope.row.isPass">
            <el-button link type="primary" size="small" disabled
              @click="pass(scope.$index, scope.row._id, scope.row.userId)">通过</el-button>
            <el-button link type="primary" size="small"
              @click="refuse(scope.$index, scope.row._id, scope.row.userId)">拒绝</el-button>
          </template>
          <template v-else>
            <el-button link type="primary" size="small"
              @click="pass(scope.$index, scope.row._id, scope.row.userId)">通过</el-button>
            <el-button link type="primary" size="small" disabled
              @click="refuse(scope.$index, scope.row._id, scope.row.userId)">拒绝</el-button>
          </template>


        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="viewData.state" :show-close="false" :align-center="true" @close="closeViewDialog">
      <div class="viewBox">
        <iframe :src="viewData.src" frameborder="0"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, reactive } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import useLoginAdminStore from '@/store/login_admin_store.js'
const loginAdminStore = useLoginAdminStore();
const adminName = ref(loginAdminStore.adminName);
const adminPhone = ref(loginAdminStore.adminPhone);
const allGudesPdf = ref([]);
// const viewState = ref(false);
const viewData = reactive({
  state: false,
  src: ''
});
const refuse_reason = ref('');



onBeforeMount(async () => {
  await getAllGuidesPdf();
});


// 通过
const pass = async (index, applyId, userId) => {
  // console.log(userId, applyId, index);
  const res = await axios({
    method: 'put',
    url: `/api/guide/pass`,
    data: {
      passTime: new Date().toLocaleString(),
      applyId: applyId,
      userId: userId,
      passPerson: adminName.value,
      passPersonPhone: adminPhone.value,
      passOpinion: '',
      passStatus: 1,
      isPass: true
    }
  });
  console.log(res.data);

  if (res.data.code == 200) {
    ElMessage.success('通过成功');
    // 更新表格数据
    await getAllGuidesPdf();
    // allGudesPdf.value.splice(index, 1);
  } else {
    ElMessage.error('通过失败');
  }
}

// 拒绝
const refuse = async (index, applyId, userId) => {
  await provideRefuseReason();

  const res = await axios({
    method: 'put',
    url: `/api/guide/reject`,
    data: {
      passTime: new Date().toLocaleString(),
      applyId: applyId,
      userId: userId,
      passPerson: adminName.value,
      passPersonPhone: adminPhone.value,
      passOpinion: refuse_reason.value,
      passStatus: 1,
      isPass: false
    }
  });
  console.log(res.data);

  if (res.data.code == 200) {
    ElMessage.success('拒绝成功');
    // 更新表格数据
    await getAllGuidesPdf();

  } else {
    ElMessage.error('拒绝失败');
  }
}

// 提供拒绝理由
const provideRefuseReason = () => {
  return new Promise((resolve, reject) => {
    ElMessageBox.prompt('请输入拒绝理由', '提示', {
    }).then(({ value }) => {
      refuse_reason.value = value;
      resolve();
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '取消输入'
      });
      reject();
    });
  });
}
// 关闭查看证书的对话框
const closeViewDialog = () => {
  viewData.state = false;
  viewData.src = '';
}

// 查看用户的证书
const viewCertificate = (certificate) => {
  viewData.state = true;
  viewData.src = certificate;
  console.log(certificate);
}

// 获取所有导游申请
const getAllGuidesPdf = async () => {
  const res = await axios({
    method: 'get',
    url: `/api/guide/allApply`,
  });

  if (res.data.code == 200) {
    allGudesPdf.value = res.data.data;

  } else {
    ElMessage.error('获取失败');
  }
}

</script>

<style lang="scss" scoped>
.viewBox {
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 90vh;
  }

}

.username {
  font-size: 0.8rem;
  font-weight: bold;

}

.userId {
  font-size: 0.7rem;
  color: #898585;
}

.applyTime {
  font-size: 0.8rem;
  color: #898585;
}


// 使用深度选择器修改element-ui的样式
:deep(.el-dialog) {
  --el-dialog-bg-color: rgba(0, 0, 0, 0);
  --el-dialog-box-shadow: none;
}
</style>