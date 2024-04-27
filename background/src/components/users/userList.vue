<template>
  <div class="allusers">

    <el-table :data="filterTableData" :border="false" style="width: 100%">
      <!-- 展开项 -->
      <el-table-column type="expand">
        <template #default="props">
          <div class="userInfo">
            <div class="introduction"> <span>自我介绍:</span> {{ props.row.introduction }}</div>
            <div class="sex"> <span>性别:</span> {{ props.row.sex }}</div>
            <div class="age"> <span>年龄：</span> {{ props.row.age }}</div>
            <div class="role"><span>身份：</span>{{ props.row.role }}</div>
            <div class="hobbies">
              <span>爱好：</span>
              <el-tag v-for="item in props.row.hobbies" :key="item" type="success">{{ item }}</el-tag>
            </div>

            <div class="address"> <span>居住地址：</span> {{ props.row.address }}</div>
            <div class="email"> <span>邮箱：</span> {{ props.row.email }}</div>
            <div class="phone"> <span>电话：</span> {{ props.row.phone }}</div>
            <div class="wechat"> <span>微信：</span> {{ props.row.wechat }}</div>


            <div class="createTime"> <span>账号创建时间：</span> {{ props.row.createTime }}</div>
            <div class="more"><span>更多</span> <a href="#" style="padding-right: 2rem;">查看主页相册</a>
              <a href="#">查看他的好友</a>
            </div>

            <!-- 个人相册 -->
            <!-- <div class="privateAlbum">
              <div class="photoList">
                <span>个人相册：</span>
                <el-image v-for="item in props.row.privateAlbum" :key="item" style="width: 100px; height: 100px"
                  :src="item.path" fit="cover"></el-image>
              </div>
            </div> -->
            <!-- 好友列表 -->
            <!-- <div class="friends">
              <span>好友列表：</span>
              <span v-for="item in props.row.friends" :key="item">{{ item }}</span>
            </div> -->
          </div>

        </template>
      </el-table-column>

      <!-- 列举项 -->
      <el-table-column label="用户ID" prop="_id" />
      <el-table-column label="用户头像" prop="avatar">
        <template #default="scope">
          <el-image style="width: 50px; height: 50px ; border-radius: 50%;" :src="scope.row.avatar"
            fit="cover"></el-image>
        </template>
      </el-table-column>


      <el-table-column label="用户名" prop="username" />

      <el-table-column align="right" width="350px">
        <template #header>
          <!-- <el-input v-model="search" size="small" placeholder="Type to search" /> -->
          <el-input v-model="search" style="max-width: 600px" placeholder="输入关键字" v-debounce:input="handleSearch">
            <template #prepend>
              <el-select v-model="select" placeholder="查询方式" style="width: 100px">
                <el-option label="用户名" value="1" />
                <el-option label="用户身份" value="2" />
                <el-option label="邮箱" value="3" />
                <el-option label="电话" value="4" />
                <el-option label="微信" value="5" />
              </el-select>
            </template>

          </el-input>
        </template>
        <template #default="scope">
          <el-dropdown>
            <el-button size="small" type="danger" round>权限修改</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="purview_normal(scope.$index, scope.row._id, 0)">正常</el-dropdown-item>
                <el-dropdown-item @click="purview_prohibition(scope.$index, scope.row._id, 1)">永久禁言</el-dropdown-item>
                <el-dropdown-item @click="ban(scope.$index, scope.row._id, 2)">封禁</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script setup>
  import { ref, onMounted, onBeforeMount, computed } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  const allUsers = ref([]);
  const search = ref('');
  const select = ref('1');
  onBeforeMount(async () => {
    await getAllUsers();
  });

  // 筛选数据
  const filterTableData = computed(() => {
    return allUsers.value.filter(item => {
      if (select.value == 1) {
        return item.username.includes(search.value);
      } else if (select.value == 2) {
        return item.role.includes(search.value);
      } else if (select.value == 3) {
        return item.email.includes(search.value);
      } else if (select.value == 4) {
        return item.phone.includes(search.value);
      } else if (select.value == 5) {
        return item.wechat.includes(search.value);
      }
    });
  });

  // 为search设置防抖
  // 防抖处理函数
  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  // 处理搜索操作的函数
  const handleSearch = debounce((value) => {
    // console.log('Debounced search:', value);
    // 在这里执行搜索操作，例如发送请求或更新数据
  }, 500); // 设置防抖延迟时间为 500ms



  // 正常
  const purview_normal = async (index, id, purview_code) => {
    console.log(id);
    // console.log('purview_code', purview_code);
    await updateUserPurview(id, purview_code);
  }

  // 永久禁言 
  const purview_prohibition = async (index, id, purview_code) => {
    console.log(id);
    await updateUserPurview(id, purview_code);
    // console.log('purview_code', purview_code);
  }

  // 封禁
  const ban = async (index, id, purview_code) => {
    console.log(id);
    await updateUserPurview(id, purview_code);
    // console.log('purview_code', purview_code);
  }

  const updateUserPurview = async (id, purview_code) => {
    const res = await axios({
      method: 'put',
      url: `/api/users`,
      params: {
        id: id
      },
      data: {
        uesrPermission: purview_code
      }
    });
    if (res.data.code == 200) {
      ElMessage.success('修改成功');
      await getAllUsers();
    } else {
      ElMessage.error('修改失败');
    }
  }

  // 获取所有用户
  const getAllUsers = async () => {
    const res = await axios({
      method: 'get',
      url: '/api/users/allusers',
    });
    if (res.data.code == 200) {
      allUsers.value = res.data.data;
    }

  };
</script>

<style scoped lang="scss">
  .allusers {

    .userInfo {
      background-color: #f9f9f9;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 15px;
      margin: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .privateAlbum {
        .photoList {
          width: 100%;
          background-color: red;
        }
      }

      div {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        span {
          font-weight: bold;
          color: #333;
          width: 120px;
        }

        &.introduction {
          span {
            color: #007bff;
          }
        }

        &.sex {
          span {
            color: #28a745;
          }
        }

        &.age {
          span {
            color: #6c757d;
          }
        }

        &.hobbies {
          span {
            color: #17a2b8;
          }

          .el-tag {
            margin-right: 5px;
            margin-bottom: 5px;
          }
        }

        &.address {
          span {
            color: #dc3545;
          }
        }

        &.email {
          span {
            color: #6610f2;
          }
        }

        &.phone {
          span {
            color: #ffc107;
          }
        }

        &.wechat {
          span {
            color: #fd7e14;
          }
        }

        &.createTime {
          span {
            color: #6f42c1;
          }
        }
      }
    }


  }
</style>
