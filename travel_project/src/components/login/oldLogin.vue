<!-- 我们将模仿elementplus实现一个表单验证的效果 -->
<template>
  <div class="addUser">
    <div class="title">
      <h1>用户注册</h1>
    </div>
    <form>
      <label for="username">用户名</label>
      <input type="text" id="username" ref="usernameRef" v-model="userForm.username" placeholder="请输入用户名" required>

      <div class="usernameErrorInfo hideInfo" ref="usernameErrorInfoRef">
        <h5>用户名长度不能小于3</h5>
      </div>


      <label for="password">密码</label>
      <input type="text" id="password" ref="passwordRef" v-model="userForm.password" placeholder="请输入密码" required>

      <div class="passwordErrorInfo hideInfo" ref="passwordErrorInfoRef">
        <h5>密码长度不能小于3</h5>
      </div>

      <!-- 设置用户的身份 -->
      <!-- 使用单选框 -->
      <!-- <label for="role">身份</label>
      <el-radio-group id="role" v-model="userForm.role">
        <el-radio label="管理员">管理员</el-radio>
        <el-radio label="普通用户">普通用户</el-radio>
      </el-radio-group> -->


      <!-- <label for="avatat">头像</label>
      <el-button type="primary" plain @click="uploadImg" class="uploadBtn"> {{ currentBtnInfo }}</el-button>
      <input type="file" id="avatar" name="avatar" ref="avatarRef" @change="showAvatar" class="uploadUserImg">
      <img :src="testImg" alt="" class="avatar" style="object-fit: cover;" v-if="showImgStatus"> -->

      <el-button type="primary" @click="addUser">添加用户</el-button>
    </form>
  </div>
</template>
<script setup>
// import { ref, onMounted, reactive, defineEmits } from 'vue'
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

import axios from 'axios'
import { ElMessage } from 'element-plus'

import useUserLoginStore from '../../stores/user_login_store/index'

const userLoginStore = useUserLoginStore();

const usernameRef = ref(null);
const passwordRef = ref(null);
const usernameErrorInfoRef = ref(null);
const passwordErrorInfoRef = ref(null);
const avatarRef = ref(null);
const testImg = ref();
const showImgStatus = ref(false);


const router = useRouter();

const currentBtnInfo = ref('上传头像');
const userForm = reactive({
  username: '',
  password: '',
});

// const emits = defineEmits(['addUserSuccess']);


// 上传用户头像
const uploadImg = () => {
  avatarRef.value.click();
  avatarRef.value.onchange = showAvatar;
}

// 处理用户提交的头像
const showAvatar = () => {
  let avatar = avatarRef.value.files[0];
  userForm.avatar = avatarRef.value.files[0];
  if (avatar) {
    showImgStatus.value = true;
    // 创建一个文件读取对象
    let reader = new FileReader();
    // 读取文件
    reader.readAsDataURL(avatar);
    reader.onload = function () {
      // console.log(reader.result);
      currentBtnInfo.value = '更换头像';
      testImg.value = reader.result;
    }
  }
}

// 添加用户
const addUser = async () => {

  console.log(userForm);
  // 判断用户输入的用户名和密码是否符合要求
  if (userForm.username.length < 3 || userForm.password.length < 3) {
    ElMessage.error('用户名或密码长度不能小于3');
    return;
  }
  if (!avatarRef.value.files[0]) {
    ElMessage.error('请上传头像');
    return;
  }
  const res = await axios({
    method: 'post',
    url: '/api/users/register',
    data: {
      username: userForm.username,
      password: userForm.password,
      // role: userForm.role,
      avatar: avatarRef.value.files[0],
    },
    headers: { 'Content-Type': 'multipart/form-data' }

  })
  // console.log(res);
  if (res.status === 200) {
    ElMessage.success('添加用户成功');

    // router.push('/home');
    userLoginStore.isLogin = true;
    // emits('addUserSuccess', 'true');
  } else {
    ElMessage.error('添加用户失败');
  }


}

// 页面初始化
onMounted(() => {
  // 为username、password注册失去焦点事件
  usernameRef.value.addEventListener('blur', usernameBlur);
  passwordRef.value.addEventListener('blur', passwordBlur);
});

const usernameBlur = () => {
  if (usernameRef.value.value.length < 3) {
    usernameErrorInfoRef.value.classList.remove('hideInfo');
  } else {
    usernameErrorInfoRef.value.classList.add('hideInfo');
  }

}

const passwordBlur = () => {
  if (passwordRef.value.value.length < 3) {
    passwordErrorInfoRef.value.classList.remove('hideInfo');
  } else {
    passwordErrorInfoRef.value.classList.add('hideInfo');
  }
}


</script>

<style scoped lang="scss">
.addUser {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  box-shadow: 0px 5px 5px #ccc;
  height: calc(100vh - 60px);
  width: 35%;
  margin: auto;
  transition: all 0.5s ease-in-out;



  .title {
    h1 {
      font-size: 1.5rem;
      text-align: center;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    width: 80%;


    label {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }

    input {
      padding: 0.8rem;
      border-radius: 1rem;
      border: 1px solid #ccc;
      outline: none;

      &:hover {
        border: 1px solid #409EFF;

      }
    }

    .uploadBtn {
      width: 20%;
      margin: 1.5rem 0;
    }

    .uploadUserImg {
      display: none;
    }

    .usernameErrorInfo {
      font-size: 0.8rem;
      padding-top: 0.5rem;
      color: red;
      transition: all 0.5s ease-in-out;
    }

    .passwordErrorInfo {
      font-size: 0.8rem;
      padding-top: 0.5rem;
      color: red;
      transition: all 0.5s ease-in-out;
    }

    .hideInfo {
      opacity: 0;
    }

    .showInfo {
      opacity: 1;
    }


    .avatar {
      margin-bottom: 2rem;
      width: 10rem;
      height: 10rem;
    }

  }

  &:hover {
    cursor: pointer;
    transform: translateY(5px);
    box-shadow: 0px 0px 5px 3px #0000007b;
  }
}
</style>