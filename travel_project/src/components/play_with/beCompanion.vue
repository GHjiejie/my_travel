<template>
  <div class="beGuide">
    <template v-if="isCompanion">
      <div class="guide">
        <div class="left">
          <companionPanelShow></companionPanelShow>
        </div>
        <div class="right">
          <div class="title"><span>恭喜您成为陪玩</span></div>
          <el-button type="primary" link @click="viewExamineResult">点击查看审核结果</el-button>
          <el-button class="info" link type="info" @click="updateGuideIngo">完善你的消息，提高曝光度</el-button>
        </div>
      </div>

    </template>
    <template v-else>
      <div class="not_companion">
        <template v-if="!isUploadCompanionPdf">
          <div class="wait">
            <el-empty image="http://127.0.0.1:3000/svg/cloud-6604_128.gif" description="上传文件">
              <button @click="triggerUpload">上传你的工作记录/PDF</button>
              <input type="file" accept=".pdf" ref="uploadPdf" style="display: none;" @change="pdfChange">
            </el-empty>
          </div>
        </template>
        <template v-else>
          <template v-if="!currentCompanionInfo.isCheck">
            <div class="notyetReviewd">
              <el-empty :image-size="200" image="http://127.0.0.1:3000/svg/cartoon-761_256.gif"
                description="您的申请正在审核中，请耐心等待">
              </el-empty>
            </div>
          </template>
          <template v-else>
            <div class="checkResult">
              <span class="checkResult_title" @click="viewExamineResult">点击查看审核结果</span>
            </div>
          </template>
        </template>
      </div>

    </template>
    <!-- 查看审核结果 -->
    <el-dialog v-model="CheckState" title="查看审核结果" width="800">
      <div class="viewResultBox">
        <div class="passPerson"><span>审核人:</span>{{ currentCompanionInfo.passPerson }}</div>
        <div class="applyTime"><span>申请时间:</span>{{ currentCompanionInfo.applyTime }}</div>
        <div class="passTime"><span>审核时间:</span>{{ currentCompanionInfo.passTime }}</div>
        <template v-if="currentCompanionInfo.isPass">
          <div class="passResult">
            <span>审核结果:</span>
            <el-tag type="success" round>通过</el-tag>
          </div>
        </template>
        <template v-else>
          <div class="passResult">
            <span>审核结果:</span>
            <el-tag type="danger" round>未通过</el-tag>
            <div class="passOpinion">
              <span>审核意见:</span>
              <span class="text">{{ currentCompanionInfo.passOpinion }}</span>
            </div>
          </div>
        </template>
        <div class="passPersonPhone"><span>审核人联系方式:</span>
          <a>{{ currentCompanionInfo.passPersonPhone }}</a>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="updateDialogState" :show-close="false">
      <updateCompanionInfo />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, reactive, watch } from 'vue'
import useLoginUserInfoStore from '../../stores/login_user_info_store';
import axios from 'axios'
import { ElMessage } from 'element-plus'
import updateCompanionInfo from './update_companion_info.vue'
import companionPanelShow from './companion_panel_show.vue'

const loginUserInfo = useLoginUserInfoStore();
const isCompanion = ref();


const updateDialogState = ref(false);
const examineState = ref(false);
const uploadPdf = ref(null);
const isUploadCompanionPdf = ref(false);
const pageSize = 12;
const currentPage = 1;

const CheckState = ref(false);
const currentCompanionInfo = ref({});

// 完善信息
const updateGuideIngo = async () => {
  if (!loginUserInfo.companion_info) {
    console.log('没有陪玩信息');
    await getCUrrentCompanionInfo();
  }
  updateDialogState.value = true;
}

onBeforeMount(async () => {
  if (!loginUserInfo.companion_info) {
    currentCompanionInfo.value = loginUserInfo.companion_info;
  }
  // 根据用户里面的isCompanion判断是否是陪玩
  await getCurrentUserInfo();
  await getCUrrentCompanionInfo();
});

watch(() => loginUserInfo.companion_info, (newVal, oldVal) => {
  currentCompanionInfo.value = newVal;
}, { deep: true })

const getCUrrentCompanionInfo = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/companion/getCompanionInfoById',
    params: {
      id: loginUserInfo.login_user_info.companionNumber
    }
  })
  if (res.data.code === 200) {
    loginUserInfo.companion_info = res.data.data;
  }
}

// 获取并更新当前用户信息
const getCurrentUserInfo = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/users',
    params: {
      id: loginUserInfo.login_user_info._id
    }
  })
  if (res.data.code === 200) {
    loginUserInfo.login_user_info = res.data.data;
    isCompanion.value = res.data.data.isCompanion;
  }
}
const viewExamineResult = () => {
  CheckState.value = true;
}


// 上传pdf触发器
const triggerUpload = () => {
  uploadPdf.value.click();
}
// 检测到文件改变
const pdfChange = async (e) => {
  const file = e.target.files[0];
  // 等待上传
  await uploadPdfToServer(file);
}
// 上传文件
const uploadPdfToServer = async (file) => {
  console.log(file);
  // 使用formData上传文件
  const formData = new FormData();
  formData.append('companionpdf', file);
  formData.append('userId', loginUserInfo.login_user_info._id);
  formData.append('username', loginUserInfo.login_user_info.username);
  formData.append('applyTime', new Date().toLocaleString());
  const res = await axios({
    method: 'post',
    url: '/api/companion/uploadPdf',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (res.data.code === 200) {
    ElMessage.success('上传成功,请等待审核结果');
    isUploadCompanionPdf.value = true;
    loginUserInfo.companion_info = res.data.data;
    currentCompanionInfo.value = res.data.data;
  } else {
    ElMessage.error('上传失败');
  }
}
</script>

<style lang="scss" scoped>
.notyetReviewd {
  height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.wait {
  height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.beGuide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .guide {

    display: flex;
    width: 100%;
    position: relative;


    .left {

      width: 80%;
      height: 100%;
      // background-color: red;
    }

    .right {
      margin-top: 2rem;
      width: 20%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // background-color: green;

      .title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .info {
        margin-top: 20px;
      }
    }
  }

  .not_companion {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    button {
      padding: 10px 20px;
      background-color: #409eff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .checkResult {
      margin-top: 2rem;

      .checkResult_title {
        font-size: 0.8rem;
        color: #409eff;

        &:hover {
          text-decoration: underline;
        }
      }

    }


  }

  .viewResultBox {
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    .passPerson,
    .applyTime,
    .passTime,
    .passResult,
    .passPersonPhone {
      margin-bottom: 15px;

      span {
        font-weight: bold;
        color: #333;
        margin-right: 10px;
      }
    }

    .passResult {
      .passOpinion {
        margin-top: 5px;

        span {
          font-weight: bold;
          color: #333;
          margin-right: 10px;
        }

        .text {
          color: #000000;
        }
      }

      .el-tag {
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 5px;
        text-transform: uppercase;
      }

      .el-tag--success {
        background-color: #4caf50;
        color: #fff;
      }

      .el-tag--danger {
        background-color: #f44336;
        color: #fff;
      }
    }

    // Adjust the following styles for better contrast
    .passPersonPhone {
      span {
        font-weight: bold;
        color: #333;
        margin-right: 10px;
      }

      a {
        color: #409eff;
        text-decoration: none;
      }
    }
  }

}
</style>