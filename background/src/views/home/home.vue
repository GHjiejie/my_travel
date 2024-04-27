<template>
  <div class="home">
    <el-container>
      <el-header>
        <home_header>
        </home_header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <home_aside></home_aside>
        </el-aside>
        <el-main>
          <home_main></home_main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>



<script setup>
  import home_header from '../header/header.vue';
  import home_aside from '../aside/aside.vue';
  import home_main from '../main/main.vue';

</script>

<style>
  .el-header {
    padding: 0;
    margin: 0;
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

</style>
<style lang="scss" scoped>
  .home {
    .el-container {
      height: 100vh;
      overflow: scroll;



      .el-aside {
        // background-color: #409EFF;

      }

      .el-main {
        // background-color: #67c23a;

      }
    }


  }
</style>