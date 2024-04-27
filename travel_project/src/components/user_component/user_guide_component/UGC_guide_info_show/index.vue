<template>
  <div class="showGuideInfo">
    <div class="mainInfo">
      <div class="main_info_top">
        <div class="top_left">
          <div class="headImg">
            <img :src="guideInfo.guideAvatar" alt="">
          </div>
        </div>
        <div class="top_right">
          <div class="top_right_top">
            <div class="name">{{ guideInfo.guideName }}</div>
          </div>
          <div class="top_right_bottom">
            <div class="certificate"><span style="color: black;font-weight: bold; padding-right: 0.5rem;">专业证书 </span>
              初级导游证 </div>
            <div class="guideLanguage"><span style="color: black;font-weight: bold;padding-right: 0.5rem;">语言能力 </span>
              <!-- <el-tag type="success" size="smill" v-for="item in guideInfo.guideLanguage">{{ item
                }}</el-tag> -->
              <div class="languageList" v-for="(item, index) in guideInfo.guideLanguage">
                <el-dropdown>
                  <el-tag type="success" size="small" style="margin-right: 0.5rem;">{{ item }}</el-tag>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="updateLanguage(guideInfo._id, index)">修改</el-dropdown-item>
                      <el-dropdown-item @click="delLanguage(guideInfo._id, item, index)">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="addLanguageBtn">
                <el-button type="primary" size="small" link @click="addLanguage(guideInfo._id)">添加语言</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="main_info_center">
        <div class="guideIntroduction"><span style="font-weight: bold;color: black;">个人简介：</span>{{
          guideInfo.guideIntroduction }}</div>
      </div>
      <div class="main_info_bottom">
        <div class="main_info_bottom_top">
          <span>用户们都觉得:'业务能力强' '热情' '生动有趣'</span>
        </div>
        <div class="main_info_bottom_bottom">
          <div class="score">
            <p class="averageScore">5.0</p>
            <span>评分</span>
          </div>
          <div class="workYears">
            <p class="years">3</p>
            <span>工作年限</span>
          </div>
          <div class="orderNum">
            <p class="num">100</p>
            <span>接单数</span>
          </div>
        </div>

      </div>
    </div>
    <div class="products">
      <div class="products_top">
        <div class="products_title">我的产品</div>
        <el-button link type="primary" @click="publish_new_product">发布新的产品</el-button>
      </div>
      <div class="products_center">
        <template v-if="products.length == 0">
          <span>您还没有发布任何旅游产品哦</span>
        </template>
        <template v-else>
          <div class="productList">
            <div class="productItem" v-for="(item, index) in products">
              <div class="productImg">
                <img src="http://localhost:3000/images/default.jpg" alt="">
              </div>
              <div class="productIntro">
                <span style="color: black; font-weight: bold;font-size: 0.8rem;">{{ item.productName }}</span>
              </div>
              <div class="sale">
                <div class="sale_left">
                  <div class="about">
                    <template v-if="item.productSellNumber == 0">
                      <div class="travel"><span class="travel">商品暂未出售</span></div>

                    </template>
                    <template v-else>
                      <div class="score"><span style="color:#409eff">4.9</span><span>/5</span></div>
                      <div class="travel"><span class="travel">售出{{ item.productSellNumber }}</span></div>
                    </template>

                  </div>
                  <div class="price"><span>￥{{ item.productPrice }}</span><span>起</span></div>
                </div>
                <div class="sale_right">
                  <el-button type="primary" class="order" size="small"
                    @click="view_product(item)"><span>查看详情</span></el-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

    </div>
    <div class="comment"></div>
    <el-dialog title="创建新的商品" v-model="create_new_product_state">
      <createNewProduct @update_success="reGetProducts"></createNewProduct>
    </el-dialog>

    <el-dialog v-model="view_product_state" :show-close="false" @close="closeViewPanel">
      <viewProduct></viewProduct>
    </el-dialog>

    <!-- <el-popover ref="popoverRef" :virtual-ref="languageRef" trigger="click" virtual-triggering>
      <el-option>删除</el-option>
      <el-option>增加</el-option>
    </el-popover> -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import useLoginUserInfoStore from '../../../../stores/login_user_info_store/index';
import createNewProduct from '../UGC_guide_publish_new_product/index.vue'
import viewProduct from '../UGC_guide_show_product/index.vue'
const guideInfo = ref({});
const loginUserInfo = useLoginUserInfoStore();
const view_product_state = ref(false);
const create_new_product_state = ref(false);
const products = ref([]);

// const languageRef = ref(null);
// const popoverRef = ref(null);

const updateLanguage = (id, index) => {
  ElMessageBox.prompt('请输入您要修改的语言', '修改语言', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /\S/,
    inputErrorMessage: '语言不能为空'
  }).then(async ({ value }) => {
    console.log(value);
    const res = await axios({
      method: 'post',
      url: '/api/guide/updateLanguage',
      data: {
        id,
        index,
        language: value
      }
    });
    if (res.data.code === 200) {
      ElMessage.success('修改语言成功');
      // 重新获取导游信息
      await getGuideInfo(guideInfo.value._id);
    }
  }).catch(() => {
    ElMessage.info('取消修改语言');
  });

}

// 删除语言
const delLanguage = async (id, language, index) => {
  // 弹窗提示是否删除
  ElMessageBox.confirm('确定删除该语言吗？', '删除语言', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await delLanguageRequest(id, index);
  }).catch(() => {
    ElMessage.info('取消删除语言');
  });
}

//删除语种请求
const delLanguageRequest = async (id, language, index) => {
  const res = await axios({
    method: 'post',
    url: '/api/guide/delLanguage',
    data: {
      id,
      language,
      index
    }
  });
  if (res.data.code === 200) {
    ElMessage.success('删除语言成功');
    // 重新获取导游信息
    await getGuideInfo(guideInfo.value._id);
  }
}


// 查看商品详情
const view_product = async (product) => {
  loginUserInfo.viewProduct = product;
  // console.log(loginUserInfo.viewProduct);

  view_product_state.value = true;
}

const closeViewPanel = () => {
  view_product_state.value = false;
}

// 发布新的产品
const publish_new_product = () => {
  create_new_product_state.value = true;
  // console.log('发布新的产品');
}

// 发布产品成功，获取新的数据
const reGetProducts = async () => {
  // console.log('重新获取产品');
  // 重新获取导游信息
  await getGuideInfo(guideInfo.value._id);
}
// 获取导游信息
const getGuideInfo = async (id) => {
  const res = await axios({
    method: 'get',
    url: '/api/guide/getGuideInfoById',
    params: {
      id: id
    }
  });
  if (res.data.code === 200) {
    // console.log('导游信息获取成功');
    // console.log(res.data.data);

    loginUserInfo.guide_info = res.data.data;
    guideInfo.value = loginUserInfo.guide_info;
    // console.log('guideInfo', guideInfo.value.myProducts.length);
    // console.log(loginUserInfo.guide_info.myProducts.length);
    products.value = loginUserInfo.guide_info.myProducts;
    // console.log(products.value.length);

  }
};

// 获取用户的信息
const getUserInfo = async (id) => {
  const res = await axios({
    method: 'get',
    url: '/api/users',
    params: {
      id: id
    }
  });
  if (res.data.code === 200) {
    // ElMessage.success('用户信息更新成功！');
    loginUserInfo.login_user_info.value = res.data.data;
    // console.log(loginUserInfo.login_user_info.value);
  }
}
// 添加导游语言
const addLanguage = async (id) => {
  if (guideInfo.value.guideLanguage.length >= 5) {
    ElMessage.error('最多只能添加五种语言');
    return;
  }
  // 弹窗提示用户添加语言
  ElMessageBox.prompt('请输入您要添加的语言', '添加语言', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /\S/,
    inputErrorMessage: '语言不能为空'
  }).then(async ({ value }) => {
    const res = await axios({
      method: 'post',
      url: '/api/guide/addLanguage',
      data: {
        id,
        language: value
      }
    });
    if (res.data.code === 200) {
      ElMessage.success('添加语言成功');
      // 重新获取导游信息
      await getGuideInfo(guideInfo.value._id);
    }
  }).catch(() => {
    ElMessage.info('取消添加语言');
  });

}
onBeforeMount(async () => {
  //c重新获取用户的信息
  await getUserInfo(loginUserInfo.login_user_info._id);
  // 如果是导游的话，重新获取导游的信息
  if (loginUserInfo.login_user_info.isGuide) {
    await getGuideInfo(loginUserInfo.login_user_info.guideNumber);

  }
});

</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  background-color: rgb(255, 255, 255);
  box-shadow: none;
  border-radius: 10px;
}

.showGuideInfo {
  // padding: 1rem;
  border-right: 1px solid #ebebeb;


  .mainInfo {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 0 10px #ebebeb;

    .main_info_top {
      display: flex;
      margin-bottom: 1rem;


      .top_left {
        .headImg {
          width: 4rem;
          height: 4rem;
          margin-right: 1rem;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
          }

        }

      }

      .top_right {
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .top_right_top {
          .name {
            font-size: 1rem;
            font-weight: bold;
          }
        }

        .top_right_bottom {
          display: flex;
          justify-content: flex-start;
          color: #ccc;


          .certificate {

            margin-right: 2rem;
          }

          .guideLanguage {
            display: flex;
            justify-content: space-between;
            margin-right: 1rem;
          }
        }
      }

    }

    .main_info_center {
      border: 2px solid #fdeeda;
      padding: 0.5rem;
      margin-bottom: 1rem;

      .guideIntroduction {
        color: #a5a0a0;

      }
    }

    .main_info_bottom {
      border: 2px solid #fdeeda;
      // padding: 0.5rem;

      .main_info_bottom_top {
        background-color: #fdf0de;
        padding: 0.5rem;
        color: #000000;

        span {
          font-weight: bold;
        }
      }

      .main_info_bottom_bottom {
        display: flex;
        justify-content: space-around;
        padding: 0.5rem;

        .score {
          .averageScore {
            font-size: 1.5rem;
            font-weight: bold;
          }
        }

        .workYears {
          .years {
            font-size: 1.5rem;
            font-weight: bold;
          }
        }

        .orderNum {
          .num {
            font-size: 1.5rem;
            font-weight: bold;
          }
        }
      }
    }



  }

  .products {
    display: flex;
    flex-direction: column;
    padding: 1rem;

    .products_top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;

      .products_title {
        font-weight: bold;
      }

    }

    .products_center {
      display: flex;

      // height: 15rem;
      // background-color: red;
      .productList {
        display: flex;
        justify-content: flex-start;

        flex-wrap: wrap;
        gap: 2rem;
        margin: 0 auto;
        width: 100%;


        .productItem {
          width: 15rem;
          padding-bottom: 0.5rem;
          // margin-bottom: 1rem;
          display: flex;
          // justify-content: center;
          // align-items: center;
          flex-direction: column;
          // background-color: green;
          box-shadow: 0 0 5px #635c5c81;
          // border-radius: 2px;



          .productImg {
            width: 100%;

            img {
              width: 100%;
              height: 10rem;
              object-fit: cover;
              // border-radius: 50%;
            }
          }

          .productIntro {
            margin-top: 0.3rem;
            padding: 0 0.5rem;
            margin-bottom: 0.5rem;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;

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
                margin-bottom: 0.5rem;

                .score {
                  font-size: 0.65rem;
                  font-weight: bold;
                }

                .travel {
                  font-size: 0.65rem;
                  color: #a4a1a1;
                  margin-left: 0.1rem;
                }
              }

              .price {
                padding: 0 0.5rem;
                font-size: 0.8rem;
                font-weight: bold;
                color: #409eff;
              }

            }

            .sale_right {
              margin-right: 0.3rem;

              span {
                font-size: 0.8rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>