<template>
  <div class="userReply">
    <form>
      <textarea v-model="reply_text" :placeholder="defaultInfo"></textarea>
    </form>
    <button @click="addPhoto" class="addButton">添加照片</button>
    <input type="file" multiple style="display: none;" accept="image/*" @change="photoChange" ref="uploadPhotoRef">
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
    <el-button @click="submitReply">回复</el-button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, defineProps, watch, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import useLoginUserInfoStore from '../../../../stores/login_user_info_store/index';
const loginUserInfo = useLoginUserInfoStore();
import axios from 'axios';
const reply_text = ref('');
const props = defineProps({
  data: Object,
});

const emits = defineEmits(['replySuccess']);
const reply_username = ref('');
const reply_index = ref('');
const defaultInfo = ref('');
const currentGuideID = ref('');

const uploadPhotoRef = ref(null);

// 存放照片的数组
const photoList = ref([]);

// 添加照片按钮
const addPhoto = async () => {
  uploadPhotoRef.value.click();
};

// 删除照片
const deletePhoto = (index) => {
  photoList.value.splice(index, 1);
  console.log(photoList.value);
}

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

// 回复评论
const submitReply = async () => {
  if (reply_text.value === '' && photoList.value.length === 0) {
    ElMessage.error('回复内容不能为空');
    return;
  }
  const appendData = {
    reply_user_id: loginUserInfo.login_user_info._id,
    reply_content: reply_text.value,
    reply_time: new Date().toLocaleString(),
    // reply_index: reply_index.value,
    reply_username: loginUserInfo.login_user_info.username,
    reply_avatar: loginUserInfo.login_user_info.avatar
  };

  const formData = new FormData();
  for (let i = 0; i < photoList.value.length; i++) {
    formData.append('reply_photos', photoList.value[i].item);
  }
  formData.append('reply', JSON.stringify(appendData));
  // console.log(appendData);
  const res = await axios({
    method: 'post',
    url: '/api/guide/reply',
    data: formData,
    params: {
      guideID: currentGuideID.value,
      index: reply_index.value
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  // console.log(res.data);
  if (res.data.code === 200) {
    ElMessage.success('回复成功');
    reply_text.value = '';
    photoList.value = [];
    emits('replySuccess')
  } else {
    ElMessage.error('回复失败');
  }
};


onBeforeMount(() => {
  // console.log(props.data);
  reply_username.value = props.data.reply_username;
  reply_index.value = props.data.reply_index;
  currentGuideID.value = props.data.currentGuideID;
  defaultInfo.value = `回复${reply_username.value}`;
});

// 监听props.data的变化，开启深度监听
watch(() => props.data, (newVal, oldVal) => {
  reply_username.value = newVal.reply_username;
  reply_index.value = newVal.reply_index;
  currentGuideID.value = props.data.currentGuideID;
  defaultInfo.value = `回复${reply_username.value}`;
  // console.log(reply_username.value, reply_index.value);
}, { deep: true });
</script>

<style lang="scss" scoped>
.userReply {
  padding: 10px;

  form {
    display: flex;
    flex-direction: column;

    textarea {
      margin-bottom: 10px;
      padding: 5px;
      width: 100%;
      height: 100px;
      resize: vertical;
    }


  }

  button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: #000000;
    }
  }

  .addButton {
    width: 10rem;
    height: 3rem;
    border: none;
    border-radius: 0.5rem;
    background-color: #f0f0f0;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #e0e0e0;
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
}
</style>