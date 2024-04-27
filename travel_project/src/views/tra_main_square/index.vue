<template>
  <div class="main">



    <div class="title">
      <p>探险之旅</p>
      <p>寻找你的完美旅行伴侣！</p>
      <span>旅行不仅是探索世界，更是发现自我的旅程。在每次新的经历中，我们超越了自己的边界，释放出内心深处的勇气与激情。让旅行成为你的导师，让每一步踏出的痕迹都是向着成长的方向。无论身在何处，都记得，真正的冒险是敞开心扉，拥抱未知，才能发现生命中最珍贵的宝藏。</span>
    </div>
    <div class="startBtn">
      <button>开始你的旅行</button>
    </div>

  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    text-align: center;
    padding: 100px 0;

    p {
      font-size: 40px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    span {
      font-size: 20px;
      color: #666;
      margin-bottom: 20px;
      line-height: 1.5;
    }
  }

  .startBtn {
    margin-top: 50px;

    button {
      padding: 10px 20px;
      background-color: #ff6700;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #ff8c00;
      }
    }
  }
}
</style>
