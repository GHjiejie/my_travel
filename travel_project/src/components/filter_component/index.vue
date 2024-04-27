<template>
  <div class="filter">
    <el-form :model="filterForm" class="filter_form" label-width="80px">
      <!-- 年龄选择 -->
      <el-form-item label="年龄">
        <el-select v-model="filterForm.travelDateRange">
          <el-option label="18岁以下" value="18岁以下" />
          <el-option label="18-25岁" value="18-25岁" />
          <el-option label="25-35岁" value="25-35岁" />
          <el-option label="35-45岁" value="35-45岁" />
          <el-option label="45岁以上" value="45岁以上" />
        </el-select>
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别">
        <el-select v-model="filterForm.ageRange" placeholder="驴友性别" clearable>
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>

      <!-- 出发城市 -->
      <el-form-item label="出发城市">
        <el-input v-model="filterForm.currentCity" placeholder="请输入出发城市" clearable />
      </el-form-item>

      <!-- 目的城市 -->

      <el-form-item label="目的城市">
        <el-input v-model="filterForm.destinationCity" placeholder="请输入目的城市" clearable />
      </el-form-item>



      <el-form-item label="出行方式">
        <el-select v-model="filterForm.travelType" placeholder="请选择出行方式" clearable>
          <el-option label="自驾" value="自驾" />
          <el-option label="骑行" value="骑行" />
          <el-option label="徒步" value="徒步" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>

      <!-- 出行时间 -->
      <el-form-item label="出行时间">
        <!-- <el-date-picker v-model="filterForm.travelDateRange" type="daterange" unlink-panels range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" :size="size" /> -->
        <el-date-picker v-model="filterForm.travelDateRange" type="daterange" unlink-panels range-separator="至"
          start-placeholder="开始时间" end-placeholder="结束时间" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Query</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script setup>
  import { ref, reactive } from 'vue'
  const filterForm = reactive({
    sex: '',
    ageRange: '',
    currentCity: '',
    destinationCity: '',
    travelType: '',
    travelDateRange: '',
  });
  const obj = {
    name: 'zhangsan',
    age: 18,
    phone: 1234567890
  }

  const onSubmit = () => {
    console.log('submit!')
  }


</script>

<style lang="scss" scoped>
  .filter {
    .filter_form {
      width: 80%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
    }
  }
</style>