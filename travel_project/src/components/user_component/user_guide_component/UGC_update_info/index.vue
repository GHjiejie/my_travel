<template>
  <div class="update_user_info">
    <el-form :model="guideInfo" label-width="auto" style="max-width: 600px">
      <el-form-item label="用户头像">
        <img :src="guideInfo.guideAvatar" alt="" @click="trigger_upload_new_avatar" ref="triggerUploadImgRef">
        <input type="file" style="display: none;" ref="uploadNewImgRef" @change="upload_new_avatar">

      </el-form-item>

      <el-form-item label="用户昵称">
        <el-input v-model="guideInfo.guideName" placeholder="给自己取一个由辨识度的昵称吧！" />
      </el-form-item>
      <el-form-item label="用户性别">
        <el-select v-model="guideInfo.guideGender" placeholder="选择你的性别">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>

      <el-form-item label="年龄">
        <el-input v-model="guideInfo.guideAge" />
      </el-form-item>

      <el-form-item label="服务区域">
        <el-input v-model="guideInfo.guideServiceArea" />
      </el-form-item>
      <el-form-item label="导服费">
        <el-input v-model="guideInfo.servicePrice" />
      </el-form-item>

      <el-form-item label="微信号">
        <el-input v-model="guideInfo.wechat" />
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input v-model="guideInfo.email" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="guideInfo.guidePhone" />
      </el-form-item>
      <el-form-item label="我的简介">
        <el-input v-model="guideInfo.guideIntroduction" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交数据</el-button>
        <el-button @click="cancle_update_user">取消更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineEmits, onBeforeMount } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import useLoginUserInfoStore from '../../../../stores/login_user_info_store/index.js';

const loginUserInfo = useLoginUserInfoStore();
// 获取当前用户的导游号
const guideId = ref(loginUserInfo.login_user_info.guideNumber);

const isUpdate = ref(loginUserInfo.is_guide_info_updated);
const route = useRoute();
const router = useRouter();


const guideInfo = reactive({
  guideName: '',
  guideAvatar: '',
  guideGender: '',
  guideAge: '',
  guideCertificate: '',
  guideIntroduction: '',
  servicePrice: '',
  // serveNumber: '',
  guideLanguage: '中文',
  guideServiceArea: '',
  guidePhone: '',
  wechat: '',
  email: ''
});

// 触发上传文件引用
const triggerUploadImgRef = ref(null);

// 上传文件引用
const uploadNewImgRef = ref(null);


onBeforeMount(async () => {
  if (isUpdate.value) {
    guideInfo.guideAvatar = loginUserInfo.guide_info.guideAvatar;
    guideInfo.guideName = loginUserInfo.guide_info.guideName;
    guideInfo.guideGender = loginUserInfo.guide_info.guideGender;
    guideInfo.guideAge = loginUserInfo.guide_info.guideAge;
    guideInfo.guideServiceArea = loginUserInfo.guide_info.guideServiceArea;
    guideInfo.servicePrice = loginUserInfo.guide_info.servicePrice;
    guideInfo.wechat = loginUserInfo.guide_info.wechat;
    guideInfo.email = loginUserInfo.guide_info.email;
    guideInfo.guidePhone = loginUserInfo.guide_info.guidePhone;
    guideInfo.guideIntroduction = loginUserInfo.guide_info.guideIntroduction;
  }
});


// 触发器，点击头像触发上传文件
const trigger_upload_new_avatar = () => {
  //  触发上传文件点击事件，只有先点击才可以选择文件，从而触发文件变化事件
  uploadNewImgRef.value.click();
}

const upload_new_avatar = () => {
  // console.log('检测到新头像上传！');
  const file = uploadNewImgRef.value.files[0];
  //创建一个文件读取对象
  const reader = new FileReader();

  // 读取文件，并将文件转换为base64格式
  reader.readAsDataURL(file);

  // 文件读取成功后，将其显示在页面上（如果请求失败怎么办？？？这里有一个bug，我们需要等请求通过后再显示新头像，这里暂时不考虑）
  reader.onload = function (e) {
    // console.log(e.target.result);
    triggerUploadImgRef.value.src = e.target.result;
  }

  // console.log('upload new avatar!');
}

// 提交表单
const onSubmit = async () => {
  // console.log('提交表单', guideInfo);
  // 将日期转换为时间戳 

  const res = await axios({
    method: 'put',
    url: '/api/guide/completeInfo',
    // 将请求的参数放在params中，后端通过req.query来获取数据
    params: {
      id: guideId.value
    },
    // 将传送的数据放在data中，后带你只有req.body来获取数据
    data: {
      guideInfo,
      // 注意这个字段与后端使用multer中间件时的字段名要一致，否则后端无法将文件解析出来
      // 也就是说，我们要使用upload.single('newAvatar')来解析文件，那么这里的字段名就要是newAvatar
      newAvatar: uploadNewImgRef.value.files[0],
    },
    // 设置请求头  ，这里是上传文件，所以需要设置请求头，告诉后端这是一个含有文件的表单
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  // console.log('result', res.data);
  if (res.data.code === 200) {
    ElMessage.success('更新成功！');
    loginUserInfo.setGuideInfo(res.data.data);

  } else {
    ElMessage.error('更新失败！');
  }
}



// 取消更新
const cancle_update_user = () => {
  console.log('取消更新');
  // emits('cancle_update')
  // router.push(`/user/info/${userInfo.value._id}`)
}

// 根据用户id获取用户信息
// const getUserInfo = async (id) => {
//   const res = await axios({
//     method: 'get',
//     url: `/api/users`,
//     params: {
//       id: id
//     }
//   });
//   userInfo.value = res.data.data;
//   // console.log('userInfo', userInfo.value);
// }
</script>

<style lang="scss" scoped>
.update_user_info {

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // background-color: red;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .el-page-header {
    width: 100%;
    padding: 2rem;

    span {
      font-size: 1rem;
      font-weight: bold;
      font-style: italic;
    }
  }

  .el-form {
    width: 100%;
    padding: 2rem;
  }

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid #7e7a7a;
    transition: all 0.3s;

    &:hover {
      border: 2px solid #000000;
    }
  }


}

// .el-form {

//   margin: 0 auto;
//   padding: 20px;
//   border: 1px solid #ebeef5;
//   border-radius: 2rem;
//   background-color: #fff;
//   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

//   img {
//     width: 100px;
//     height: 100px;
//     border-radius: 50%;
//     object-fit: cover;
//     cursor: pointer;
//     border: 2px solid #7e7a7a;
//     transition: all 0.3s;

//     &:hover {
//       border: 2px solid #000000;
//     }
//   }

//   .el-form-item {
//     margin-bottom: 2rem;
//   }


// }</style>
