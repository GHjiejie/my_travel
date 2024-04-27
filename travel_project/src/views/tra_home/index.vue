<template>
  <div>
    <el-container>
      <div class="travel">
        <nav>
          <home_header></home_header>
        </nav>
        <main>
          <home_main></home_main>
        </main>

      </div>
    </el-container>
  </div>
</template>


<script setup>
import home_header from './home_header.vue';
import home_main from '../tra_main_home/index.vue';
// import home_footer from './home_footer.vue';

</script>

<style lang="scss" scoped>
nav {
  width: 100%;
}
</style>../tra_main_home/home_main.vue