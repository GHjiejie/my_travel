<template>
  <div class="companionInfo">
    <div class="top">
      <div class="top_left">
        <div class="avatar">
          <img :src="currentcompanion.avatar" alt="" />
        </div>
      </div>
      <div class="top_right">
        <div class="top_right_left">
          <span class="username">{{ currentcompanion.username }}</span>
          <span class="id">{{ currentcompanion._id }}</span>
        </div>
      </div>
    </div>
    <div class="center">
      <div class="center_top">
        <div class="service">
          <el-tag type="primary" v-for="item in currentcompanion.service">{{ item }}</el-tag>
        </div>
        <div class="intro">
          <p class="intro_title">个人简介</p>
          <p class="content">{{ currentcompanion.introduce }}</p>
        </div>
      </div>
      <div class="center_center">
        <div class="address">{{ currentcompanion.address }}</div>
      </div>
    </div>
    <div class="other_info">
      <p class="other_info_title">其他信息</p>
      <div class="other_box">
        <div class="other_item">
          <span class="age">年龄</span>
          <span>{{ currentcompanion.age }}</span>
        </div>
        <div class="other_item">
          <span class="sex">性别</span>
          <span>{{ currentcompanion.sex }}</span>
        </div>
        <div class="other_item">
          <span class="price">陪玩价格</span>
          <span>{{ currentcompanion.price }}</span>
          <!-- <span class="order" @click="orderCompanion">立即预约</span> -->
        </div>
        <div class="bottom">
          <template v-if="currentcompanion.photos.length !== 0">
            <el-carousel :interval="4000" height="300px" arrow="always">
              <el-carousel-item v-for="item in currentcompanion.photos" :key="item">
                <img :src="item" class="image" />
              </el-carousel-item>
            </el-carousel>
          </template>
          <template v-else>
            <div class="no_photo">
              <el-button link type="primary" @click="addPhoto">添加生活照片</el-button>
              <input type="file" multiple style="display: none;" accept="image/*" @change="photoChange"
                ref="uploadPhotoRef">
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="photoWall">
      <TransitionGroup name="fadeIn">
        <div v-for="(photo, index) in photoList" :key="photo._id" class="photoItem">
          <img :src="photo.path" alt="Photo" />
          <div class="overlay">
            <svg class="icon" aria-hidden="true" @click="viewCurrentPhoto(photo.path)">
              <use xlink:href="#icon-sousuofangda"></use>
            </svg>
            <svg class="icon" aria-hidden="true" @click="deletePhoto(index)">
              <use xlink:href="#icon-shanchu1"></use>
            </svg>
          </div>
        </div>
      </TransitionGroup>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineEmits, onBeforeMount } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import useLoginUserInfoStore from '@/stores/login_user_info_store/index'
const loginUserInfo = useLoginUserInfoStore();
const currentcompanion = ref({});

const uploadPhotoRef = ref(null);
// 存放照片的数组
const photoList = ref([]);
onBeforeMount(async () => {
  if (!loginUserInfo.companion_info) {
    await getCUrrentCompanionInfo();
  }
  currentcompanion.value = loginUserInfo.companion_info;
  // console.log('currentAompanion', currentcompanion.value);
});
const getCUrrentCompanionInfo = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/companion/getCompanionInfoById',
    params: {
      id: loginUserInfo.login_user_info.companionNumber
    }
  })
  if (res.data.code === 200) {
    loginUserInfo.companion_info = res.data.data;
  }
}

const orderCompanion = () => {
  ElMessage.success('功能相同，不在实现！');
}

// 删除照片
const deletePhoto = (index) => {
  photoList.value.splice(index, 1);
  console.log(photoList.value);
}
// 添加照片按钮
const addPhoto = async () => {
  uploadPhotoRef.value.click();
};

// 监听到上传照片的变化
const photoChange = async () => {
  // console.log('photoChange');
  if (uploadPhotoRef.value.files.length > 5) {
    ElMessage.error('一次最多上传5张照片哦！');
    return;
  }
  // 将图片添加到photoList中
  for (let i = 0; i < uploadPhotoRef.value.files.length; i++) {
    photoList.value.push({
      item: uploadPhotoRef.value.files[i],
      path: URL.createObjectURL(uploadPhotoRef.value.files[i]),
      _id: i
    });
  }
  // await uploadPhoto(uploadPhotoRef.value.files);

}

</script>

<style lang="scss" scoped>
.companionInfo {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-right: 1px solid #ede7e7;

  .top {
    display: flex;

    .top_left {
      margin-right: 1rem;

      .avatar {
        width: 5rem;
        height: 5rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
      }
    }

    .top_right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // margin-bottom: 2rem;

      .top_right_left {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        gap: 1rem;

        .username {
          font-size: 1rem;
          font-weight: bold;
        }

        .id {
          font-size: 0.9rem;
          // font-weight: bold;
          color: #969393;
        }
      }


    }
  }

  .center {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    margin-top: 2rem;

    .center_top {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .service {
        display: flex;
        gap: 1rem;
      }

      .intro {

        .intro_title {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .content {
          font-size: 1rem;
          color: #969393;
          text-indent: 2em;

        }
      }
    }

    .center_center {
      font-size: 1rem;
      color: #969393;
    }
  }

  .other_info {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .other_info_title {
      font-size: 1rem;
      font-weight: bold;
    }

    .other_box {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .other_item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 1rem;
        color: #969393;
        margin-left: 2rem;

        .age,
        .sex,
        .price {
          font-size: 1rem;
          font-weight: bold;
          color: black;
          margin-right: 1rem;
        }

        .order {
          margin-left: 1rem;
          padding: 0.5rem 1rem;
          color: skyblue;

          &:hover {
            color: red;
            cursor: pointer;
          }
        }


      }

      .bottom {
        .no_photo {
          font-size: 1rem;
          color: #969393;
        }

        .image {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }
      }
    }
  }

}

.photoWall {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;

  .photoItem {
    position: relative;
    width: 10rem;
    height: 10rem;
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.44);

    img {
      width: 100%;
      height: 100%;
      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
      object-fit: cover;
      border-radius: 0.5rem;
    }

  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.385);
    /* 半透明黑色遮罩层 */
    opacity: 0;
    transition: opacity 0.3s;

    /* 添加过渡效果 */
  }

  .photoItem:hover .overlay {
    opacity: 1;
    /* 鼠标悬停时显示遮罩层 */
  }

  .icon {
    font-size: 1.5rem;

    cursor: pointer;
    margin: 0 1rem;
    transition: all 0.3s;
    color: rgba(255, 255, 255, 0.611);

    &:hover {
      transform: scale(1.2);
    }
  }

}
</style>