<template>
  <div class="uploadPhoto">

    <div class="photoWall">
      <TransitionGroup name="fadeIn">
        <div v-for="(photo, index) in photoList" :key="photo._id" class="photoItem">
          <img :src="photo.path" alt="Photo" class="photoImage" />
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
      <!-- 可以在这里加上icon模拟上传照片的按钮 -->
      <!-- <button @click="addPhoto" class="addButton">添加照片</button> -->
    </div>
    <el-progress :text-inside="true" :stroke-width="26" :percentage="loadingProgress" v-show="showProgress"
      :color="customColor" />
    <button @click="addPhoto" class="addButton">添加照片</button>
    <input type="file" multiple style="display: none;" accept="image/*" @change="photoChange" ref="uploadPhotoRef">


  </div>
</template>

<script setup>
  import { ref, onBeforeMount } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios'
  import { ElMessage } from 'element-plus';

  const uploadPhotoRef = ref(null);
  const route = useRoute();
  const userId = route.params.id;

  let percentCompleted = 0;

  const max_upload_number = 5;
  const showProgress = ref(false);
  const loadingProgress = ref(0);
  const customColor = [
    { color: '#f56c6c', percentage: 20 },
    { color: '#e6a23c', percentage: 40 },
    { color: '#5cb87a', percentage: 60 },
    { color: '#1989fa', percentage: 80 },
    { color: '#6f7ad3', percentage: 100 }
  ]

  // 挂载之前获取照片数据
  onBeforeMount(async () => {
    await getPhotos();
  });


  // 存放照片的数组
  const photoList = ref([]);


  // 查看当前照片
  const viewCurrentPhoto = (path) => {
    // 新开一个窗口查看照片
    window.open(path);
  }

  // 删除用户照片
  const deletePhoto = async (index) => {
    try {
      const result = await axios({
        method: 'delete',
        url: '/api/album',
        params: {
          userId: userId,
          index: index
        }
      });
      if (result.data.code === 200) {
        ElMessage.success('删除成功');
        photoList.value.splice(index, 1);
      } else {
        ElMessage.error('删除失败');
      }
    } catch (error) {
      console.error(error);
    }
  }
  // 获取当前用户的照片(下面代码是正确的)
  const getPhotos = async () => {
    try {
      const result = await axios({
        method: 'get',
        url: '/api/album',
        params: {
          userId: userId
        }
      })
      if (result.data.code === 200) {
        photoList.value = result.data.data;
        // console.log(photoList.value);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 添加照片按钮
  const addPhoto = async () => {
    uploadPhotoRef.value.click();
  };

  // 监听到上传照片的变化
  const photoChange = async () => {
    if (uploadPhotoRef.value.files.length > 5) {
      ElMessage.error('一次最多上传5张照片哦！');
      return;
    } else if (photoList.value.length + uploadPhotoRef.value.files.length > 15) {
      ElMessage.error('用户主页最多只可以上传15张照片哦！');
      return;
    }
    await uploadPhoto(uploadPhotoRef.value.files);

  }

  // 上传图片
  const uploadPhoto = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('photos', files[i]);
    }
    // console.log(formData.get('photos'));

    try {
      showProgress.value = true;
      const result = await axios({
        method: 'post',
        url: '/api/album',
        data: formData,
        params: {
          userId: userId
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          loadingProgress.value = percentCompleted;
          // 在这里可以更新页面上的上传进度条或其他展示方式
        }

      });
      if (result.data.code === 200) {
        afterUploadSuccess();
        ElMessage.success('上传成功');
        // 后期优化点，可以直接将上传成功的照片添加到photoList中，减少一次请求，但是路径需要处理，头痛！！！，难不成同一路径？？ base64地址？？
        // 每次上传都会重新获取照片，性能会造成极大的浪费，后期优化！！！
        await getPhotos();
      } else {
        ElMessage.error('上传失败');
      }
    } catch (error) {
      console.error(error);
    }
  };


  // const beforeUpload = async (current_photo_number, uploadNumber) => {
  //   if (uploadNumber > 5) {
  //     ElMessage.error('一次最多上传5张照片哦！');
  //     return;
  //   } else if (current_photo_number + uploadNumber > 15) {
  //     ElMessage.error('用户主页最多只可以上传15张照片哦！');
  //     return;
  //   }

  // }

  // 处理上传成功后的操作
  const afterUploadSuccess = () => {
    showProgress.value = false;
    loadingProgress.value = 0;
    uploadPhotoRef.value.value = '';
  }

</script>

<style lang="scss" scoped>



  .fadeIn-enter-from {
    opacity: 0;
    transform: translateX(100%);
  }

  .fadeIn-move {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .fadeIn-enter-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    position: relative;
  }

  .fadeIn-enter-to {
    opacity: 1;
    transform: translateX(0);
  }

  .fadeIn-leave-from {
    opacity: 1;
    transform: translateX(0);
  }

  .fadeIn-leave-active {
    position: absolute;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  }

  .fadeIn-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }



  .uploadPhoto {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .photoWall {
      display: flex;
      justify-content: flex-start;
      align-self: flex-start;
      flex-wrap: wrap;
      gap: 1rem;

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

    .addButton {
      width: 10rem;
      height: 3rem;
      margin-bottom: 3rem;
      border: none;
      border-radius: 0.5rem;
      background-color: #f0f0f0;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background-color: #e0e0e0;
      }
    }
  }
</style>
