<template>
  <div class="main">
    <router-view v-slot="{ Component }">
      <!-- <Transition name="fadeIn"> -->

      <component :is="Component"></component>

      <!-- </Transition> -->
    </router-view>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
  .main {

    .fadeIn-enter-active,
    .fadeIn-leave-active {
      transition: opacity 0.3s ease;
    }

    .fadeIn-leave-from {
      opacity: 1;
      transform: translateY(-100%);
    }

    .fadeIn-leave-to {
      opacity: 0;
      transform: translateY(0%);
    }

    .fadeIn-enter-from {
      opacity: 0;
      transform: translateY(100%);
    }

    .fadeIn-enter-to {
      opacity: 1;
      transform: translateY(0%);
    }

    .fadeIn-leave-active {
      position: absolute;
    }
  }
</style>