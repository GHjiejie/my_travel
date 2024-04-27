<template>
  <div class="showProduct">
    <div class="productItem">
      <div class="productImg">
        <el-carousel :interval="5000" arrow="always">
          <el-carousel-item v-for="item in productInfo.productImage" :key="item._id">
            <img :src="item.path" alt="">
          </el-carousel-item>
        </el-carousel>
        <!-- <img src="http://localhost:3000/images/default.jpg" alt=""> -->
      </div>
      <div class="productIntro">
        <div class="intro">
          <span>商品介绍</span>
          <p>{{ productInfo.productIntroduction }}</p>
        </div>
        <div class="productName">
          <span>商品名称</span>
          <p>{{ productInfo.productName }}</p>
        </div>
        <!-- <span style="color: black; font-weight: bold;font-size: 2rem;">{{ productInfo.productName }}</span> -->
      </div>
      <div class="sale">
        <div class="sale_left">
          <div class="about">
            <template v-if="productInfo.productSellNumber == 0">
              <div class="travel"><span class="travel">商品暂未出售</span></div>
            </template>
            <template v-else>
              <div class="score"><span style="color:#409eff">4.9</span><span>/5</span></div>
              <div class="travel"><span class="travel">售出{{ productInfo.productSellNumber }}</span></div>
            </template>

          </div>
          <div class="price"><span>￥{{ productInfo.productPrice }}</span><span>起</span></div>
        </div>
        <div class="sale_right">
          <el-button type="primary" class="buy" @click="buy_product(productInfo)"><span>立即购买</span></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { ElMessage } from 'element-plus'
import useLoginUserInfoStore from '../../../../stores/login_user_info_store';
const loginUserInfo = useLoginUserInfoStore();
const productInfo = ref({});

// 点击购买按钮
const buy_product = (product) => {
  // console.log(product);
  ElMessage.success('业务功能相似,不写辣！');
};

onBeforeMount(() => {
  productInfo.value = loginUserInfo.viewProduct;
  // console.log(productInfo.value);
});

// 监听数据的变化，实时更新数据
watch(() => loginUserInfo.viewProduct, (newVal, oldVal) => {
  productInfo.value = newVal;
  console.log(productInfo.value);
});

</script>

<style lang="scss" scoped>
.showProduct {
  .productItem {
    width: 100%;
    padding-bottom: 0.5rem;
    display: flex;
    flex-direction: column;


    .productImg {
      width: 100%;
      // height: 30rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        // border-radius: 50%;
      }
    }

    .productIntro {
      .intro {
        padding: 0.5rem;
      }

      .productName {
        padding: 0.5rem;
      }

      span {
        color: black;
        font-weight: bold;
        font-size: 1.2rem;
      }

      p {
        text-indent: 2em;
        margin: 0.5rem 0;
      }



    }

    .sale {
      display: flex;

      justify-content: space-between;
      align-items: center;

      .sale_left {
        display: flex;
        flex-direction: column;


        .about {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 0.5rem;
          margin-bottom: 1rem;

          .score {
            font-size: 1.2rem;
            font-weight: bold;
          }

          .travel {
            font-size: 1.2rem;
            color: #a4a1a1;
            margin-left: 0.1rem;
          }
        }

        .price {
          padding: 0 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #ff0000;
        }

      }

      .sale_right {
        margin-right: 2rem;

        .buy {
          font-size: 0.9rem;
          padding: 1rem;
        }

      }
    }
  }
}
</style>