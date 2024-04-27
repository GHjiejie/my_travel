<template>
  <div class="aside">
    <el-row>
      <el-col>
        <el-menu @open="handleOpen" @close="handleClose" :router="true">



          <el-sub-menu index="/user">
            <template #title>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user/userList">用户列表</el-menu-item>


          </el-sub-menu>

          <el-sub-menu index="/guide">
            <template #title>
              <span>导游管理</span>
            </template>
            <el-menu-item index="/guide/guideCheck">
              <span>导游资格审查</span>
            </el-menu-item>
            <!-- <el-menu-item index="/guide/guideList">
              <span>导游列表</span>
            </el-menu-item> -->
          </el-sub-menu>

          <el-sub-menu index="/companion">
            <template #title>
              <span>陪玩管理</span>
            </template>
            <el-menu-item index="/companion/companionCheck">
              <span>陪玩资格审查</span>
            </el-menu-item>
            <!-- <el-menu-item index="/guide/guideList">
              <span>导游列表</span>
            </el-menu-item> -->
          </el-sub-menu>

          <el-sub-menu index="/order">
            <template #title>
              <span>订单管理</span>
            </template>
            <el-menu-item index="/order/orderSearch">
              <span>订单查询</span>
            </el-menu-item>
            <el-menu-item index="/order/orderCheck">
              <span>订单审核</span>
            </el-menu-item>
            <el-menu-item index="/order/orderStatistics">
              <span>订单统计</span>
            </el-menu-item>
            <el-menu-item index="/order/orderRefund">
              <span>订单退款</span>
            </el-menu-item>
            <el-menu-item index="/order/orderRefundCheck">
              <span>订单退款审核</span>
            </el-menu-item>
            <el-menu-item index="/order/orderRefundStatistics">
              <span>订单退款统计</span>
            </el-menu-item>
          </el-sub-menu>

        </el-menu>
      </el-col>
    </el-row>


  </div>
</template>

<script setup>

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>
