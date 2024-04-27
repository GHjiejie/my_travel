<template>
  <div class="update_user_info">
    <el-form :model="update_user_form" label-width="auto" style="max-width: 600px">
      <el-form-item label="用户头像">
        <img :src="`http://127.0.0.1:3000` + `${userInfo.avatar}`" alt="" @click="trigger_upload_new_avatar"
          ref="triggerUploadImgRef">
        <input type="file" style="display: none;" @click="click_old_avatar" ref="uploadNewImgRef"
          @change="upload_new_avatar">

      </el-form-item>

      <el-form-item label="用户昵称">
        <el-input v-model="update_user_form.username" placeholder="给自己取一个由辨识度的昵称吧！" />
      </el-form-item>
      <el-form-item label="用户性别">
        <el-select v-model="update_user_form.sex" placeholder="选择你的性别">
          <el-option label="男" value="man" />
          <el-option label="女" value="female" />
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期">
        <el-col :span="11">
          <el-date-picker v-model="update_user_form.birthday" type="date" placeholder="选择你的出生年月"
            :default-value="new Date(2010, 9, 1)" />
        </el-col>

      </el-form-item>

      <el-form-item label="居住城市">
        <el-input v-model="update_user_form.currentCity" />
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="update_user_form.address" />
      </el-form-item>
      <el-form-item label="微信号">
        <el-input v-model="update_user_form.wechat" />
      </el-form-item>
      <el-form-item label="QQ号">
        <el-input v-model="update_user_form.qq" />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="update_user_form.phone" />
      </el-form-item>

      <el-form-item label="个性签名">
        <el-input v-model="update_user_form.signature" type="textarea" />
      </el-form-item>

      <el-form-item label="我的简介">
        <el-input v-model="update_user_form.introduction" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交数据</el-button>
        <el-button @click="cancle_update_user">取消更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { reactive, ref, defineProps, defineEmits } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'

  // 获取用户的id(从父组件获取)
  const props = defineProps({
    userInfo: Object
  });

  // 自定义事件
  const emits = defineEmits(['submit_update', 'cancle_update'])

  // 将用户数据解构出来
  const { userInfo } = props;

  // 触发上传文件引用
  const triggerUploadImgRef = ref(null);

  // 上传文件引用
  const uploadNewImgRef = ref(null);

  // 更新用户表单
  const update_user_form = reactive({
    username: userInfo.username,
    sex: userInfo.sex,
    birthday: userInfo.birthday,
    // password: userInfo.password,

    // 个性签名
    signature: userInfo.signature,
    // 个人简介
    introduction: userInfo.introduction,
    // 当前城市
    currentCity: userInfo.currentCity,
    // 详细地址
    address: userInfo.address,

    email: userInfo.email,
    wechat: userInfo.wechat,
    qq: userInfo.qq,
    phone: userInfo.phone,
  });

  // 触发器，点击头像触发上传文件
  const trigger_upload_new_avatar = () => {
    //  触发上传文件点击事件，只有先点击才可以选择文件，从而触发文件变化事件
    uploadNewImgRef.value.click();
  }
  const click_old_avatar = () => {
    console.log('click old avatar!')
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

    update_user_form.birthday = new Date(update_user_form.birthday).toLocaleDateString();
    const result = await axios({
      method: 'put',
      url: '/api/users',
      // 将请求的参数放在params中，后端通过req.query来获取数据
      params: {
        id: userInfo._id
      },
      // 将传送的数据放在data中，后带你只有req.body来获取数据
      data: {
        ...update_user_form,
        // 注意这个字段与后端使用multer中间件时的字段名要一致，否则后端无法将文件解析出来
        // 也就是说，我们要使用upload.single('newAvatar')来解析文件，那么这里的字段名就要是newAvatar
        newAvatar: uploadNewImgRef.value.files[0],
      },
      // 设置请求头  ，这里是上传文件，所以需要设置请求头，告诉后端这是一个含有文件的表单
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (result.data.code === 200) {
      ElMessage.success('更新成功！');
      emits('submit_update');
    } else {
      ElMessage.error('更新失败！');


    }
  }
  // 取消更新
  const cancle_update_user = () => {
    emits('cancle_update')
  }
</script>

<style lang="scss" scoped>
  .el-form {

    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 2rem;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

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

    .el-form-item {
      margin-bottom: 2rem;
    }




  }
</style>
