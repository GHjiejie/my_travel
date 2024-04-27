<!-- 我们将模仿elementplus实现一个表单验证的效果 -->
<template>
  <div class="addUser">
    <div class="title">
      <h1>登录</h1>
      <router-link to="/register">注册</router-link>
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

      <!-- <label for="contact">联系方式</label>
      <input type="text" id="contact" ref="contactRef" v-model="userForm.contact" placeholder="请输入联系方式" required>

      <div class="contactErrorInfo hideInfo" ref="contactErrorInfoRef">
        <h5>请输入合法的联系方式</h5>
      </div> -->


      <el-button type="primary" @click="addAdmin" class="addUserBtn">登录</el-button>
    </form>


  </div>
</template>
<script setup>
  // import { ref, onMounted, reactive, defineEmits } from 'vue'
  import { ref, onMounted, reactive } from 'vue'
  import { useRouter } from 'vue-router'

  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import useLoginAdminStore from '@/store/login_admin_store.js'
  const loginAdminStore = useLoginAdminStore()





  const usernameRef = ref(null);
  const passwordRef = ref(null);
  // const contactRef = ref(null);
  const usernameErrorInfoRef = ref(null);
  const passwordErrorInfoRef = ref(null);
  // const contactErrorInfoRef = ref(null);

  const router = useRouter();




  const userForm = reactive({
    username: '',
    password: '',
    contact: '',
  });



  // 添加用户
  const addAdmin = async () => {

    // console.log(userForm);
    // 判断用户输入的用户名和密码是否符合要求
    if (userForm.username.length < 3 || userForm.password.length < 3) {
      ElMessage.error('请输入符合要求的数据');
      return;
    }
    const res = await axios({
      method: 'post',
      url: '/api/admin/login',
      data: {
        username: userForm.username,
        password: userForm.password,

      },
    });
    console.log(res.data);
    if (res.data.code === 200) {
      ElMessage.success('登录成功');
      loginAdminStore.setAdminInfo(res.data.data.username, res.data.data.phone);
      router.push('/home');

    } else if (res.data.code === 404) {
      ElMessage.error(`${res.data.msg}`);
    } else {
      ElMessage.error(`${res.data.msg}`);
    }



  }

  // 页面初始化
  onMounted(() => {
    // 为username、password注册失去焦点事件
    usernameRef.value.addEventListener('blur', usernameBlur);
    passwordRef.value.addEventListener('blur', passwordBlur);
    // contactRef.value.addEventListener('blur', contactBlur);
  });

  const usernameBlur = () => {
    if (usernameRef.value.value.length < 3) {
      usernameErrorInfoRef.value.classList.remove('hideInfo');
    } else {
      usernameErrorInfoRef.value.classList.add('hideInfo');
    }

  }

  // const contactBlur = () => {
  //   if (contactRef.value.value.length < 3) {
  //     contactErrorInfoRef.value.classList.remove('hideInfo');
  //   } else {
  //     contactErrorInfoRef.value.classList.add('hideInfo');
  //   }
  // }

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
    box-shadow: 0px 0px 5px #cccccc8c;

    position: absolute;
    left: calc(50% - 15%);
    height: 80vh;
    margin-top: 10vh;

    width: 30%;
    // height: calc(100vh - 60px);

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

      .contactErrorInfo {
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



</style>