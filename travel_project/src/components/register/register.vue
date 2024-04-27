<!-- 我们将模仿elementplus实现一个表单验证的效果 -->
<template>
  <div class="addUser">
    <div class="title">
      <h1>注册</h1>

    </div>
    <form>
      <label for="username">用户名</label>
      <input type="text" id="username" ref="usernameRef" v-model="userForm.username" placeholder="请输入用户名" required>

      <div class="usernameErrorInfo hideInfo" ref="usernameErrorInfoRef">
        <h5>用户名长度不能小于3</h5>
      </div>


      <label for="password">密码</label>
      <input type="password" id="password" ref="passwordRef" v-model="userForm.password" placeholder="请输入密码" required>

      <div class="passwordErrorInfo hideInfo" ref="passwordErrorInfoRef">
        <h5>密码长度不能小于3</h5>
      </div>

      <label for="confirm">确认密码</label>
      <input type="password" id="confirm" ref="confirmRef" v-model="userForm.confirmPwd" placeholder="请再次输入密码" required>

      <div class="confirmErrorInfo hideInfo" ref="confirmErrorInfoRef">
        <h5>两次输入的密码不一致</h5>
      </div>

      <el-button type="primary" @click="addUser" class="addUserBtn">注册</el-button>
    </form>

    <!-- 一个定位的三角形,在盒子右上角 -->
    <div class="registerUser" @click="gotoRegister">
      <span class="first">登</span>
      <span class="second">录</span>
    </div>
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
  const confirmRef = ref(null);
  const usernameErrorInfoRef = ref(null);
  const passwordErrorInfoRef = ref(null);
  const confirmErrorInfoRef = ref(null);

  const router = useRouter();




  const userForm = reactive({
    username: '',
    password: '',
    confirmPwd: '',
  });


  const gotoRegister = () => {
    router.push('/login');
    // console.log('跳转到注册页面');
  }
  // 添加用户
  const addUser = async () => {

    console.log(userForm);
    // 判断用户输入的用户名和密码是否符合要求
    if (!usernameBlur() || !passwordBlur() || !confirmBlur()) {
      ElMessage.error('请检查输入的用户名和密码');
      return;
    }
    const res = await axios({
      method: 'post',
      url: '/api/users/register',
      data: {
        username: userForm.username,
        password: userForm.password,

      },

    })
    // console.log('注册res' + res);
    if (res.data.code === 200) {
      ElMessage.success('添加用户成功');

      userLoginStore.isLogin = true;
      userLoginStore.login_userName = userForm.username;
      userLoginStore.login_userId = res.data.data._id;

      router.push(`/user/info/${res.data.data._id}`);


    } else {
      ElMessage.error(`${res.data.msg}`);
    }



  }

  // 页面初始化
  onMounted(() => {
    // 为username、password注册失去焦点事件
    usernameRef.value.addEventListener('blur', usernameBlur);
    passwordRef.value.addEventListener('blur', passwordBlur);
    confirmRef.value.addEventListener('blur', confirmBlur);

  });

  const usernameBlur = () => {
    if (usernameRef.value.value.length < 3) {
      usernameErrorInfoRef.value.classList.remove('hideInfo');
      return false;
    } else {
      usernameErrorInfoRef.value.classList.add('hideInfo');
      return true;
    }

  }

  const passwordBlur = () => {
    if (passwordRef.value.value.length < 3) {
      passwordErrorInfoRef.value.classList.remove('hideInfo');
      return false;
    } else {
      passwordErrorInfoRef.value.classList.add('hideInfo');
      return true;
    }
  }

  const confirmBlur = () => {
    if (userForm.password !== userForm.confirmPwd) {
      confirmErrorInfoRef.value.classList.remove('hideInfo');
      return false;
    } else {
      confirmErrorInfoRef.value.classList.add('hideInfo');
      return true;
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
    box-shadow: 0px 0px 5px #cccccc8c;

    position: absolute;
    left: calc(50% - 15%);
    bottom: 5%;
    width: 30%;

    height: calc(95vh - 60px);
    // margin: auto;
    // margin-top: 5rem;

    // background-color: red;
    transition: all 0.5s ease-in-out;

    // &:hover {
    //   cursor: pointer;
    //   transform: translateY(2px);
    //   box-shadow: 0px 0px 5px 3px #0000007b;
    // }



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
        transition: all 0.5s ease-in-out;

        &:hover {
          border: 1px solid #409EFF;

        }
      }

      .addUserBtn {
        background-color: black;
        color: white;
        margin-top: 1rem;
        transition: all 0.5s ease-in-out;
        font-weight: bold;
        border: none;

        &:hover {
          transform: translateY(1px);
          box-shadow: 0 0 3px 1px #0000003c;
          background-color: green
        }
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

      .confirmErrorInfo {
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



    }


  }

  .registerUser {
    background-color: rgb(0, 0, 0);
    box-shadow: 0 0 5px 10px #000000f1;
    position: absolute;
    top: 0;
    right: 0;
    width: 8rem;
    height: 8rem;
    // 裁剪一个三角形
    clip-path: polygon(100% 0, 100% 50%, 50% 0);

    &:hover {
      cursor: pointer;
      background-color: green;


    }

    span {

      font-weight: bold;
      color: white;
      position: absolute;

    }

    .first {
      position: absolute;
      top: 0.2rem;
      right: 1.2rem;
      font-size: 0.8rem;
      color: white;
    }

    .second {
      position: absolute;
      top: 1.2rem;
      right: 0.3rem;
      font-size: 0.8rem;
      color: white;
    }
  }
</style>