<template>
  <div class="userComment">
    <form>
      <textarea v-model="comment" placeholder="请输入您的评论"></textarea>
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
    <div class="score">

      <span class="score_title">评分</span>
      <el-rate v-model="comment_score" :colors="colors" />
    </div>
    <el-button @click="submitComment">提交评论</el-button>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, defineProps, defineEmits } from 'vue';
import axios from 'axios'
import { ElMessage } from 'element-plus';
import useLoginUserInfoStore from '../../../../stores/login_user_info_store/index';
const loginUserInfo = useLoginUserInfoStore();
const commentUser = ref({});
const guide_id = ref('');
const comment_score = ref(0);
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900']);

const uploadPhotoRef = ref(null);
const emits = defineEmits(['commentSuccess']);

// 存放照片的数组
const photoList = ref([]);

const props = defineProps({
  currentGuideId: String,
});


// 添加照片按钮
const addPhoto = async () => {
  uploadPhotoRef.value.click();
};

// 删除照片
const deletePhoto = (index) => {
  photoList.value.splice(index, 1);
  console.log(photoList.value);
}

// 查看当前照片
const viewCurrentPhoto = (path) => {
  // 新开一个窗口查看照片
  window.open(path);
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


}
onBeforeMount(() => {
  commentUser.value = loginUserInfo.login_user_info;
  guide_id.value = props.currentGuideId;
});

const comment = ref('');

// 提交评论
const submitComment = async () => {
  if (comment.value == '' && photoList.value.length == 0) {
    ElMessage.error('评论内容不能为空');
    return;
  }
  const appendData = {
    comment: comment.value,
    user_id: commentUser.value._id,
    user_name: commentUser.value.username,
    user_avatar: commentUser.value.avatar,
    user_rating: comment_score.value,
    comment_time: new Date().toLocaleString()
  };

  const formData = new FormData();
  for (let i = 0; i < photoList.value.length; i++) {
    formData.append('comment_photos', photoList.value[i].item);
  }
  formData.append('comment', JSON.stringify(appendData));

  const res = await axios({
    method: 'post',
    url: '/api/guide/comment',
    data: formData,
    params: {
      guideID: guide_id.value
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  if (res.data.code === 200) {
    ElMessage.success('评论成功');
    comment.value = '';
    comment_score.value = 0;
    photoList.value = [];
    emits('commentSuccess');
  } else {
    ElMessage.error('评论失败');
  }
}
</script>

<style lang="scss" scoped>
.userComment {
  padding: 10px;

  .score {
    margin-bottom: 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .score_title {
      margin-right: 1rem;
    }
  }

  form {
    display: flex;
    flex-direction: column;

    textarea {
      margin-bottom: 10px;
      padding: 5px;
      width: 100%;
      height: 100px;
      resize: vertical;
      /* 允许垂直调整文本区域大小 */
    }


  }

  button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }

  .photoWall {
    display: flex;
    justify-content: flex-start;
    align-self: flex-start;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1rem;

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
