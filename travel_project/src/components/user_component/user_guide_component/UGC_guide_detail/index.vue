<template>
  <div class="showGuideInfo">
    <div class="mainInfo">
      <div class="main_info_top">
        <div class="top_left">
          <div class="headImg">
            <img :src="guideInfo.guideAvatar" alt="" loading="lazy">
          </div>
        </div>
        <div class="top_right">
          <div class="TR_info">
            <div class="top_right_top">
              <div class="name">{{ guideInfo.guideName }}</div>
            </div>
            <div class="top_right_bottom">
              <div class="certificate"><span style="color: black;font-weight: bold; padding-right: 0.5rem;">专业证书 </span>
                初级导游证</div>
              <div class="guideLanguage"><span style="color: black;font-weight: bold;padding-right: 0.5rem;">语言能力
                </span>
                <el-tag type="primary" size="small" v-for="(item, index) in guideInfo.guideLanguage"
                  style="margin-right: 0.5rem;">{{ item
                  }}</el-tag>
              </div>
            </div>
          </div>
          <div class="reservation">
            <el-tooltip effect="dark" :content="`需支付${guideInfo.servicePrice}`" placement="bottom">
              <div class="reservation_btn_front" @click="reservation(guideInfo)">预约个人</div>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="main_info_top_supplement">
        <span class="guideID"> <span class="title">ID</span>{{ guideInfo._id }}</span>
        <span class="phone"><span class="title">联系方式</span>{{ guideInfo.guidePhone }}</span>

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
      </div>
      <div class="products_center">
        <template v-if="products.length == 0">
          <span>您还没有发布任何旅游产品哦</span>
        </template>
        <template v-else>
          <div class="productList">
            <div class="productItem" v-for="(item, index) in products">
              <div class="productImg">
                <img src="http://localhost:3000/images/default.jpg" alt="" loading="lazy">
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
    <div class="comment">
      <el-button type="primary" link class="comment_title" @click="addComment(guideInfo._id)">点评</el-button>
      <!-- 分隔线 -->
      <div class="divider"></div>
      <div class="commentBox">
        <div class="commentList">
          <TransitionGroup name="fadeRight">
            <div class="commentItem" v-for="(item, rootIndex) in guideInfo.userComments" :key="item._id">
              <div class="comment_left">
                <div class="userAvatar">
                  <img :src="item.user_avatar" alt="">
                </div>
              </div>
              <div class="comment_right">
                <div class="comment_right_top">
                  <div class="comment_right_top_left">
                    <div class="userName">{{ item.user_name }}</div>
                    <div class="commentTime">{{ item.comment_time }}</div>
                  </div>
                  <div class="comment_right_top_right">

                    <el-dropdown trigger="click">
                      <!-- <span class="more" @click="operation_menu(item.user_id)">...</span> -->
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-more"></use>
                      </svg>
                      <template #dropdown>
                        <template v-if="item.user_id !== loginUserInfo.login_user_info._id">
                          <el-dropdown-menu>
                            <el-dropdown-item @click="report(item.user_id)">举报</el-dropdown-item>
                            <el-dropdown-item @click="join_blackList(item.user_id)">加入黑名单</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                        <template v-else>
                          <el-dropdown-menu>
                            <el-dropdown-item
                              @click="delete_this_comment(item.user_id, rootIndex)">删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>

                      </template>
                    </el-dropdown>
                  </div>
                </div>
                <div class="comment_right_center">
                  <div class="comment_score">
                    <el-rate v-model="item.user_rating" disabled :colors="colors" />
                  </div>
                  <div class="commentContent">{{ item.comment }}</div>
                  <template v-if="item.comment_images.length !== 0">
                    <div class="comment_imgList">
                      <div class="comment_imgItem" v-for="(img, index) in item.comment_images" :key="index">
                        <img :src="img" alt="" @click="viewPhoto(img)" loading="lazy">
                      </div>
                    </div>
                  </template>
                </div>
                <div class="comment_right_bottom">

                  <!-- 点赞数量 -->
                  <div class="dianzan" @click="dianzan(rootIndex)">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-dianzan2"></use>
                    </svg>
                    <span class="dianzan_number">{{ item.user_like }}</span>
                  </div>

                  <!-- 转发数量
                  <div class="zhuanfa">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-zhuanfa"></use>
                    </svg>
                    <span class="zhuanfa_number">222</span>
                  </div> -->
                  <!-- 回复评论 -->
                  <div class="huifu" @click="reply(item.user_name, rootIndex, guideInfo._id)">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-huifu"></use>
                    </svg>
                    <span class="huifu_title">回复</span>
                  </div>
                </div>
                <template v-if="item.replyList.length !== 0">
                  <!-- <div class="replyBox"><span class="replyNumber">共{{ item.replyList.length }}条回复 </span></div> -->
                  <div class="replyBox">
                    <el-collapse accordion>
                      <el-collapse-item :title="`共${item.replyList.length}条评论`" name="1">
                        <div class="replyItem" v-for="(reply, replyIndex) in item.replyList" :key="reply._id">
                          <div class="replyLeft">
                            <div class="replyAvatar">
                              <img :src="reply.reply_avatar" alt="" loading="lazy">
                            </div>
                          </div>
                          <div class="replyRight">
                            <div class="reply_right_top">
                              <div class="reply_right_top_left">
                                <span class="replyName">{{ reply.reply_username }}</span>
                                <span class="replyTime">{{ reply.reply_time }}</span>
                              </div>
                              <div class="reply_right_top_right">
                                <el-dropdown trigger="click">
                                  <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-more"></use>
                                  </svg>
                                  <!-- <span class="more" @click="operation_menu(reply.reply_user_id)">...</span> -->
                                  <template #dropdown>
                                    <template v-if="reply.reply_user_id !== loginUserInfo.login_user_info._id">
                                      <el-dropdown-menu>
                                        <el-dropdown-item @click="report(reply.reply_user_id)">举报</el-dropdown-item>
                                        <el-dropdown-item
                                          @click="join_blackList(reply.reply_user_id)">加入黑名单</el-dropdown-item>
                                      </el-dropdown-menu>
                                    </template>
                                    <template v-else>
                                      <el-dropdown-menu>
                                        <el-dropdown-item
                                          @click="delete_this_reply(rootIndex, replyIndex)">删除</el-dropdown-item>
                                      </el-dropdown-menu>
                                    </template>
                                  </template>
                                </el-dropdown>
                              </div>

                            </div>
                            <div class="reply_right_bottom">
                              <div class="replyContent">{{ reply.reply_content }}</div>
                              <template v-if="reply.reply_images.length !== 0">
                                <div class="reply_imgList">
                                  <div class="reply_imgItem" v-for="(img, index) in reply.reply_images" :key="index">
                                    <img :src="img" alt="" @click="viewPhoto(img)" loading="lazy">
                                  </div>
                                </div>
                              </template>
                            </div>
                          </div>
                        </div>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                </template>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>


    </div>
    <!-- 查看产品详情 -->
    <el-dialog v-model="view_product_state" :show-close="false" @close="closeViewPanel">
      <viewProduct></viewProduct>
    </el-dialog>

    <!-- 用户点评 -->
    <el-dialog v-model="add_comment_state" :show-close="false">
      <userComment :currentGuideId="evaluated_guideID" @commentSuccess="commentSuccess"></userComment>
    </el-dialog>

    <!-- 用户回复评论 -->
    <el-dialog v-model="reply_dialog_state" :show-close="false">
      <userReply :data="reply_data" @replySuccess="replySuccess"></userReply>
    </el-dialog>

    <!-- 用户预览照片 -->
    <el-dialog v-model="view_photo_state" :show-close="false">
      <div class="viewImg">
        <img :src="view_photo_path" alt="">
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import useLoginUserInfoStore from '../../../../stores/login_user_info_store/index';
// import createNewProduct from '../UGC_guide_publish_new_product/index.vue'
import userComment from '../UGC_guide_comments/index.vue';
import viewProduct from '../UGC_guide_show_product/index.vue'
import userReply from '../UGC_guide_comments/userReply.vue'

// const props = defineProps({
//   needViewGuideID: String
// });
const guideInfo = ref({});
const loginUserInfo = useLoginUserInfoStore();
const view_product_state = ref(false);

// const create_new_product_state = ref(false);
const products = ref([]);
const add_comment_state = ref(false);
const evaluated_guideID = ref('');
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900']);

const reply_dialog_state = ref(false);
const reply_data = reactive({
  reply_index: '',
  reply_username: '',
  currentGuideID: ''
});


const view_photo_state = ref(false);
const view_photo_path = ref('');



// 为用户点赞
const dianzan = async (rootIndex) => {
  const res = await axios({
    method: 'post',
    url: '/api/guide/likeComment',
    data: {
      guideID: guideInfo.value._id,
      commentIndex: rootIndex,
    }
  });
  if (res.data.code === 200) {
    // ElMessage.success('点赞成功');
    // 重新获取数据
    // await getGuideInfo(guideInfo.value._id);
    guideInfo.value.userComments[rootIndex].user_like += 1;
  } else {
    ElMessage.error('点赞失败');
  }
}

// 删除用户回复
const delete_this_reply = async (rootIndex, replyIndex) => {
  ElMessageBox({
    title: '提示',
    message: '确定删除这条回复吗？',
    type: 'warning',
    showCancelButton: true
  }).then(async () => {
    await execute_delete_reply(rootIndex, replyIndex);
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}

// 执行删除用户回复的信息
const execute_delete_reply = async (rootIndex, replyIndex) => {
  // console.log(rootIndex, replyIndex)
  const res = await axios({
    method: 'post',
    url: '/api/guide/deleteReply',
    data: {
      guideID: guideInfo.value._id,
      commentIndex: rootIndex,
      replyIndex: replyIndex
    }
  });
  if (res.data.code === 200) {
    ElMessage.success('删除成功');
    // 重新获取数据
    // await getGuideInfo(guideInfo.value._id);
    guideInfo.value.userComments[rootIndex].replyList.splice(replyIndex, 1);
  } else {
    ElMessage.error('删除失败');
  }
}



// 点击举报
const report = async (user_id) => {
  // 弹窗提示举报理由
  ElMessageBox.prompt('请输入举报理由', '举报', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /\S/,
    inputErrorMessage: '请输入举报理由'
  }).then(async ({ value }) => {
    // console.log(value);
    await execute(user_id, value);
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消举报'
    });
  });
}
// 执行举报
const execute = async (user_id, value) => {
  const res = await axios({
    method: 'post',
    url: '/api/users/report',
    data: {
      reported_user_id: user_id,
      report_reason: value,
      reporter_user_id: loginUserInfo.login_user_info._id
    }
  });
  if (res.data.code === 200) {
    ElMessage({
      type: 'success',
      message: '举报成功'
    });
  } else {
    ElMessage({
      type: 'error',
      message: '举报失败'
    });
  }
}

// 加入黑名单
const join_blackList = (user_id) => {
  ElMessage.success('加入黑名单成功');
}

// 删除评论
const delete_this_comment = async (user_id, index) => {
  ElMessageBox({
    title: '提示',
    message: '确定删除这条评论吗？',
    type: 'warning',
    showCancelButton: true
  }).then(async () => {
    await execute_delete_comment(user_id, index);
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
}
// 执行删除功能
const execute_delete_comment = async (user_id, index) => {
  const res = await axios({
    method: 'post',
    url: '/api/guide/deleteComment',
    data: {
      guideID: guideInfo.value._id,
      index: index
    }
  });
  if (res.data.code === 200) {
    ElMessage.success('删除成功');
    // 重新获取数据
    // await getGuideInfo(guideInfo.value._id);
    guideInfo.value.userComments.splice(index, 1);

  } else {
    ElMessage.error('删除失败');
  }
}

// 点击右侧操作按钮
// const operation_menu = (selected_user_id) => {
//   // console.log('operation_menu');
//   console.log(selected_user_id);
// }

// 用户查看照片
const viewPhoto = (item) => {
  console.log(item);
  view_photo_state.value = true;
  view_photo_path.value = item;
}

// 用户回复评论
const reply = (reply_user, index, guideID) => {
  // console.log(reply_user, index);
  reply_data.reply_username = reply_user;
  reply_data.reply_index = index;
  reply_data.currentGuideID = guideID;
  reply_dialog_state.value = true;
}

// 用户回复成功
const replySuccess = async () => {
  reply_dialog_state.value = false;
  // 重新获取数据
  await getGuideInfo(guideInfo.value._id);
}

// 获取导游信息
const getGuideInfo = async (guideID) => {
  const res = await axios({
    method: 'get',
    url: '/api/guide/getGuideInfoById',
    params: {
      id: guideID
    }
  });
  if (res.data.code === 200) {
    // console.log('输出重新获取的导游数据', res.data.data);
    loginUserInfo.viewGuide = res.data.data;
    guideInfo.value = res.data.data;
  }
}

// 添加评论
const addComment = (guideID) => {
  evaluated_guideID.value = guideID;
  add_comment_state.value = true;
}

// 用户评论成功
const commentSuccess = async () => {
  add_comment_state.value = false;
  await getGuideInfo(guideInfo.value._id);
}

// 查看商品详情
const view_product = async (product) => {
  loginUserInfo.viewProduct = product;
  view_product_state.value = true;
}

// 关闭商品浏览窗口
const closeViewPanel = () => {
  view_product_state.value = false;
}

// 预约导游
const reservation = async (guide) => {

  // 获取当前的时间戳
  const timestamp = new Date().getTime();
  // 将当前时间戳加上一个小时
  const time_out = new Date().getTime() + 3600 * 1000;
  const timeout = handle(time_out);
  // loginUserInfo.set_need_data(guide, time_out);
  const res = await axios({
    method: 'post',
    url: '/api/pay/guide',
    data: {
      userID: loginUserInfo.login_user_info._id,
      guideID: loginUserInfo.guide_info._id,
      orderID: `${timestamp}_${loginUserInfo.login_user_info._id}`,
      orderPrice: guide.servicePrice,
      orderName: '导游个人预约服务',
      timeout: timeout,
    }
  });

  if (loginUserInfo.thisTime_pay_order_id == "") {
    // console.log('新的订单号为空');
    loginUserInfo.thisTime_pay_order_id = `${timestamp}_${loginUserInfo.login_user_info._id}`;
    loginUserInfo.lastTime_pay_order_id = `${timestamp}_${loginUserInfo.login_user_info._id}`;
  } else {
    loginUserInfo.thisTime_pay_order_id = `${timestamp}_${loginUserInfo.login_user_info._id}`;
  }

  window.open(res.data);
  loginUserInfo.set_need_data(guide, time_out, res.data);
}

// 时间格式化处理函数
const handle = (time) => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}


onBeforeMount(async () => {
  // await getGuideInfo(props.needViewGuideID);
  // console.log('hello');
  guideInfo.value = loginUserInfo.viewGuide;
  products.value = guideInfo.value.myProducts;
});

// 监听数据的变化，实时更新数据
watch(() => loginUserInfo.viewGuide, (newVal, oldVal) => {
  // console.log('监听到数据的变化');
  guideInfo.value = newVal;
  products.value = guideInfo.value.myProducts;
}, { deep: true }, { immediate: true });





</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  background-color: rgb(255, 255, 255);
  box-shadow: none;
  border-radius: 10px;
}

:deep(.el-collapse-item__header) {
  color: #409eff;
  font-weight: bold;
  transition: all 0.3s;

  &:hover {
    color: #000000;
  }
}

.fadeRight-move,
.fadeRight-enter-active,
.fadeRight-leave-active {
  transition: all 0.5s ease-in-out;
}

.fadeRight-enter-from,
.fadeRight-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.fadeRight-leave-active {
  position: absolute;
}




.showGuideInfo {
  // padding: 1rem;
  // border-right: 1px solid #ebebeb;


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
        flex: 1;
        // flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .TR_info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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

              margin-right: 1rem;
            }
          }
        }

        .reservation {
          .reservation_btn_front {
            padding: 0.5rem 1rem;
            background-color: #409eff;
            color: white;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-radius: 10px;
              background-color: black;
            }
          }
        }
      }
    }

    .main_info_top_supplement {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-bottom: 0.5rem;

      .title {
        font-size: 0.8rem;
        font-weight: bold;
        color: black;
        margin-right: 0.8rem;
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
        color: #605454;

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

  .comment {
    .divider {
      height: 2px;
      width: 100%;
      background-color: orange;
      margin: 1rem 0;
    }

    .commentBox {
      .commentList {
        display: flex;
        flex-direction: column;

        .commentItem {
          display: flex;
          justify-content: flex-start;
          // border-bottom: 1px solid #a7949430;
          // padding-bottom: 1rem;
          margin-top: 1rem;

          .comment_left {
            width: 3rem;

            .userAvatar {
              width: 3rem;
              height: 3rem;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
              }
            }
          }

          .comment_right {
            flex: 1;
            margin-left: 1rem;
            display: flex;
            flex-direction: column;

            .comment_right_top {

              display: flex;
              justify-content: space-between;
              align-items: center;

              .comment_right_top_left {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                height: 3rem;

                .userName {
                  font-size: 1rem;
                  font-weight: bold;
                  color: black;
                }

                .commentTime {
                  font-size: 0.8rem;
                  color: #a4a1a1;
                }
              }

              .comment_right_top_right {
                margin-right: 1rem;

                svg {
                  width: 1.2rem;
                  height: 1.2rem;

                  &:hover {
                    cursor: pointer;
                  }
                }

                .more {
                  font-size: 0.8rem;
                  color: #a4a1a1;
                  font-weight: bold;

                  &:hover {
                    color: #409eff;
                    cursor: pointer;
                  }
                }
              }


            }

            .comment_right_center {
              padding: 0 0 0.5rem 0;

              .comment_score {
                margin: 0.2rem 0;
              }

              .commentContent {
                font-size: 0.8rem;
                color: black;
              }

              .comment_imgList {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;

                .comment_imgItem {
                  display: flex;
                  width: 8rem;
                  height: 8rem;
                  margin-top: 0.5rem;

                  img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 0.5rem;

                    &:hover {
                      cursor: pointer;
                    }
                  }
                }
              }
            }

            .comment_right_bottom {
              // width: 100%;
              display: flex;
              gap: 2rem;

              .dianzan {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                svg {
                  width: 1rem;
                  height: 1rem;

                  &:hover {
                    cursor: pointer;
                  }
                }
              }

              // .zhuanfa {
              //   display: flex;
              //   align-items: center;
              //   gap: 0.5rem;

              //   svg {
              //     width: 1rem;
              //     height: 1rem;
              //   }
              // }

              .huifu {
                display: flex;
                align-items: center;
                gap: 0.5rem;

                svg {
                  width: 1rem;
                  height: 1rem;

                  &:hover {
                    cursor: pointer;
                  }
                }
              }

              span {
                font-size: 0.8rem;

                &:hover {
                  cursor: pointer;
                }
              }
            }

            .replyBox {
              margin-top: 1rem;
              background-color: #f6f8f8;

              .replyItem {
                display: flex;
                justify-content: flex-start;
                padding-bottom: 1rem;
                margin-top: 1rem;
                border-bottom: 1px solid #59555525;

                &:last-child {
                  border-bottom: none;
                }



                .replyLeft {
                  width: 3rem;

                  .replyAvatar {
                    width: 3rem;
                    height: 3rem;

                    img {
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                      border-radius: 50%;
                    }
                  }
                }

                .replyRight {
                  margin-left: 1rem;
                  display: flex;
                  flex: 1;
                  flex-direction: column;

                  .reply_right_top {


                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .reply_right_top_left {
                      display: flex;
                      flex-direction: column;
                      justify-content: space-between;

                      .replyName {
                        font-size: 1rem;
                        font-weight: bold;
                        color: black;
                      }

                      .replyTime {
                        font-size: 0.8rem;
                        color: #a4a1a1;
                      }
                    }

                    .reply_right_top_right {
                      margin-right: 1rem;

                      .more {
                        font-size: 0.8rem;
                        color: #a4a1a1;
                        font-weight: bold;

                        &:hover {
                          color: #409eff;
                          cursor: pointer;
                        }
                      }
                    }



                  }

                  .reply_right_bottom {

                    .replyContent {
                      margin-top: 1rem;
                      font-size: 0.8rem;
                      color: black;
                    }

                    .reply_imgList {
                      display: flex;
                      gap: 1rem;
                      flex-wrap: wrap;

                      .reply_imgItem {
                        display: flex;
                        width: 8rem;
                        height: 8rem;
                        margin-top: 0.5rem;

                        img {
                          width: 100%;
                          height: 100%;
                          object-fit: cover;
                          border-radius: 0.5rem;

                          &:hover {
                            cursor: pointer;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }


    }

  }

  .viewImg {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>