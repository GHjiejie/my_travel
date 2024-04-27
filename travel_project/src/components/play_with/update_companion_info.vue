<template>
  <div class="update_user_info">
    <el-form :model="guideInfo" label-width="auto" style="max-width: 600px">
      <el-form-item label="用户头像">
        <img :src="currentCompanion.avatar" alt="" @click="trigger_upload_new_avatar" ref="triggerUploadImgRef">
        <input type="file" style="display: none;" ref="uploadNewImgRef" @change="upload_new_avatar" accept="image/*">
      </el-form-item>

      <el-form-item label="用户昵称">
        <el-input v-model="companionInfo.username" :placeholder="currentCompanion.username" />
      </el-form-item>
      <el-form-item label="用户性别">
        <el-select v-model="companionInfo.sex" :placeholder="currentCompanion.sex">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>

      <el-form-item label="年龄">
        <el-input v-model="companionInfo.age" :placeholder="currentCompanion.age" />
      </el-form-item>

      <el-form-item label=" 服务区域">
        <el-input v-model="companionInfo.address" :placeholder="currentCompanion.address" />
      </el-form-item>
      <el-form-item label=" 陪玩费">
        <el-input v-model="companionInfo.price" :placeholder="currentCompanion.price" />
      </el-form-item>
      <el-form-item label=" 手机号">
        <el-input v-model="companionInfo.phone" :placeholder="currentCompanion.phone" />
      </el-form-item>
      <el-form-item label=" 我的简介">
        <el-input v-model="companionInfo.introduce" type="textarea" :placeholder="currentCompanion.introduce" />
      </el-form-item>
      <el-form-item label=" 状态">
        <el-select v-model="companionInfo.status" :placeholder="currentCompanion.status">
          <el-option label="空闲" value="空闲" />
          <el-option label="忙碌" value="忙碌" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="onSubmit">提交数据</el-button>
    <el-button @click="cancle_update_user">取消更新</el-button>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineEmits, watch, onBeforeMount } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import useLoginUserInfoStore from '@/stores/login_user_info_store/index'


const loginUserInfo = useLoginUserInfoStore();

// 获取当前用户的导游号

const route = useRoute();
const router = useRouter();
const currentCompanion = ref({});

const companionInfo = reactive({
  username: '',
  avatar: '',
  sex: '',
  age: '',
  introduce: '',
  price: '',
  address: '',
  phone: '',
  status: ''
});

// 触发上传文件引用
const triggerUploadImgRef = ref(null);

// 上传文件引用
const uploadNewImgRef = ref(null);


onBeforeMount(async () => {
  currentCompanion.value = loginUserInfo.companion_info;
  // console.log('currentCompanion', currentCompanion.value);
  // getUserInfo(route.params.id);
  // console.log('userInfo', userInfo.value);

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
}

// 提交表单
const onSubmit = async () => {
  const res = await axios({

    method: 'post',
    url: '/api/companion/completeInfo',
    // 将请求的参数放在params中，后端通过req.query来获取数据
    params: {
      id: currentCompanion.value._id
    },
    // 将传送的数据放在data中，后带你只有req.body来获取数据
    data: {
      companionInfo,
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
    console.log('更新成功！', res.data.data);
    await getCUrrentCompanionInfo();
  } else {
    ElMessage.error('更新失败！');
  }
}
const getCUrrentCompanionInfo = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/companion/getCompanionInfoById',
    params: {
      id: currentCompanion.value._id
    }
  });
  if (res.data.code === 200) {
    currentCompanion.value = res.data.data;
    loginUserInfo.companion_info = res.data.data;
  }
}

watch(() => loginUserInfo.companion_info, () => {
  currentCompanion.value = loginUserInfo.companion_info;
}, { immediate: true })

// 取消更新
const cancle_update_user = () => {
  console.log('取消更新');

}


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
