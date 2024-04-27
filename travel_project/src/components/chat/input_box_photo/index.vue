<template>
  <div class="showPhoto">
    <img :src="item" alt="" v-for="item in message.photos">
  </div>
</template>

<script setup>
  import { ref } from 'vue'


</script>

<style lang="scss" scoped>
  .showPhoto {
    img {
      width: 5rem;
      height: 5rem;
      object-fit: cover;
      border-radius: 0;
      margin-right: 0.5rem;
    }
  }
</style>