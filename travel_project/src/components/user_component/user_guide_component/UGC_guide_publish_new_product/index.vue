<template>
  <div class="update_user_info">

    <el-form :model="productInfo" label-width="auto" style="max-width: 600px">
      <el-form-item label="产品名称">
        <el-input v-model="productInfo.productName" />
      </el-form-item>
      <el-form-item label="产品介绍">
        <el-input v-model="productInfo.productIntroduction" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="productInfo.productPrice" />
      </el-form-item>
    </el-form>
    <div class="photoWall">
      <TransitionGroup name="fadeIn">
        <div v-for="(photo, index) in photoList" :key="index" class="photoItem">
          <img :src="photo.path" alt="Photo" />
          <div class="overlay">
            <svg class="icon" aria-hidden="true" @click="deletePhoto(index)">
              <use xlink:href="#icon-shanchu1"></use>
            </svg>
          </div>
        </div>
      </TransitionGroup>
    </div>
    <button @click="addProductPhotos" class="addButton">添加照片</button>
    <input type="file" multiple style="display: none;" accept="image/*" @change="photoChange" ref="uploadPhotoRef">

    <el-button type="primary" @click="onSubmit">提交数据</el-button>
    <el-button @click="cancle_update_user">取消更新</el-button>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineEmits, onBeforeMount } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import useLoginUserInfoStore from '@/stores/login_user_info_store/index';
const loginUserInfo = useLoginUserInfoStore();
const uploadPhotoRef = ref(null);
const photoList = ref([]);

const guideId = ref(loginUserInfo.login_user_info.guideNumber);
const emits = defineEmits(['update_success']);


const productInfo = reactive({
  productName: '',
  productPrice: '',
  productIntroduction: ''
});


const onSubmit = async () => {
  const formData = new FormData();
  formData.append('productName', productInfo.productName);
  formData.append('productPrice', productInfo.productPrice);
  formData.append('productIntroduction', productInfo.productIntroduction);
  for (let i = 0; i < photoList.value.length; i++) {
    formData.append('productPhotos', photoList.value[i].file);
  }
  const res = await axios({
    method: 'post',
    url: '/api/guide/addProduct',
    params: {
      id: guideId.value
    },
    data: formData,
  });
  if (res.data.code === 200) {
    ElMessage.success('添加成功！');
    emits('update_success')
  } else {
    ElMessage.error('添加失败！');
  }
}

const addProductPhotos = () => {
  uploadPhotoRef.value.click();
}

// 监听到上传照片的变化
const photoChange = async () => {
  const files = uploadPhotoRef.value.files;
  if (uploadPhotoRef.value.files.length > 5) {
    ElMessage.error('一次最多上传5张照片哦！');
    return;
  }
  for (let i = 0; i < uploadPhotoRef.value.files.length; i++) {
    const reader = new FileReader();
    reader.readAsDataURL(uploadPhotoRef.value.files[i]);
    reader.onload = async (e) => {
      photoList.value.push({
        path: e.target.result,
        file: uploadPhotoRef.value.files[i]
      });
    }
  }
}
// 删除图片
const deletePhoto = (index) => {
  photoList.value.splice(index, 1);
}

</script>

<style>
.fadeIn-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.fadeIn-enter-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
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
</style>
<style lang="scss" scoped>
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
</style>
