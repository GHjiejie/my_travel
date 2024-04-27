<script setup>
  import home_header from './views/tra_home/home_header.vue';


</script>

<template>
  <div>
    <home_header></home_header>
  </div>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;

    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
      width: 0px;
    }

    .icon {
      width: 1em;
      height: 1em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
</style>
