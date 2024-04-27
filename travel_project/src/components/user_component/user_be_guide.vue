<template>
  <div class="beGuide">
    <template v-if="isGuide">
      <div class="guide">
        <div class="left">
          <guidePanelShow></guidePanelShow>
        </div>
        <div class="right">
          <div class="title"><span>恭喜您成为导游</span></div>
          <el-button type="primary" link @click="viewExamineResult">点击查看审核结果</el-button>
          <el-button class="info" link type="info" @click="updateGuideIngo">完善导游信息，提高曝光度</el-button>
        </div>
      </div>

    </template>
    <template v-else>
      <div class="noguide">
        <template v-if="isUploadPdf">
          <div class="wait">
            <el-empty image="http://127.0.0.1:3000/svg/cloud-6604_128.gif" description="上传文件">
              <button @click="triggerUpload">上传证书</button>
              <input type="file" accept=".pdf" ref="uploadPdf" style="display: none;" @change="pdfChange">
            </el-empty>
          </div>
          <!-- <button @click="triggerUpload">上传证书</button>
          <input type="file" accept=".pdf" ref="uploadPdf" style="display: none;" @change="pdfChange"> -->
        </template>
        <template v-else>
          <template v-if="examineResult.passStatus == 0">
            <div class="notyetReviewd">
              <el-empty :image-size="300" image="http://127.0.0.1:3000/svg/cartoon-761_256.gif"
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
    <el-dialog v-model="examineState" title="查看审核结果" width="800">
      <div class="viewResultBox">
        <div class="passPerson"><span>审核人:</span>{{ examineResult.passPerson }}</div>
        <div class="applyTime"><span>申请时间:</span>{{ examineResult.applyTime }}</div>
        <div class="passTime"><span>审核时间:</span>{{ examineResult.passTime }}</div>
        <template v-if="examineResult.isPass">
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
              <span class="text">{{ examineResult.passOpinion }}</span>
            </div>
          </div>
        </template>
        <div class="passPersonPhone"><span>审核人联系方式:</span>
          <a>{{ examineResult.passPersonPhone }}</a>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="updateDialogState" :show-close="false">
      <updateGuideInfo />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, reactive, watch } from 'vue'
import useLoginUserInfoStore from '../../stores/login_user_info_store';
import axios from 'axios'
import { ElMessage } from 'element-plus'
import updateGuideInfo from '../user_component/user_guide_component/UGC_update_info/index.vue'
import guidePanelShow from '../user_component/user_guide_component/UGC_guide_info_show/index.vue'

const loginUserInfo = useLoginUserInfoStore();
const isGuide = ref();

const updateDialogState = ref(false);
const examineState = ref(false);
const examineResult = ref({});
const uploadPdf = ref(null);

const isUploadPdf = ref(false);

const pageSize = 12;
const currentPage = 1;

onBeforeMount(async () => {
  // 更新原来存储在pinia里面的持久化数据

  await getCurrentUserInfo();

  await getExamineResult();
});

watch(() => loginUserInfo.login_user_info, (newVal, oldVal) => {
  isGuide.value = newVal.isGuide;
}, { deep: true });

const updateGuideIngo = () => {
  updateDialogState.value = true;
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
  // console.log(res.data);
  if (res.data.code === 200) {
    //  重新存储用户数据
    loginUserInfo.login_user_info = res.data.data;
    if (loginUserInfo.login_user_info.isGuide) {
      // 更新所有导游的数据
      await getAllUGuides();
    }
  }
}

// 获取所有导游数据
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
  }
};

// 查看审核结果
const viewExamineResult = async () => {
  await getExamineResult();
  examineState.value = true;
}

// 获取审核结果
const getExamineResult = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/guide/applyById',
    params: {
      userId: loginUserInfo.login_user_info._id
    }
  })

  // console.log(res.data);
  if (res.data.code == 200) {
    // 判断当前用户是否有提交过申请
    if (!res.data.data) {
      isUploadPdf.value = true;
      return;
    }
    loginUserInfo.examine_result = res.data.data;
    examineResult.value = res.data.data;
  }
}
// 监听审核结果
watch(() => loginUserInfo.examine_result, (newVal, oldVal) => {
  examineResult.value = newVal;
  isUploadPdf.value = false;// 上传成功后隐藏上传按钮
}, { deep: true });

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
  // 使用formData上传文件
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('userId', loginUserInfo.login_user_info._id);
  formData.append('username', loginUserInfo.login_user_info.username);
  formData.append('applyTime', new Date().toLocaleString());
  const res = await axios({
    method: 'post',
    url: '/api/guide/uploadPdf',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (res.data.code === 200) {
    ElMessage.success('上传成功,请等待审核结果');
    // console.log('上传成功', res.data, data);
    loginUserInfo.examine_result = res.data.data;
  } else {
    ElMessage.error('上传失败');
  }
}
</script>

<style lang="scss" scoped>
.wait {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);

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

  .noguide {
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

  .notyetReviewd {
    height: calc(100vh - 200px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>