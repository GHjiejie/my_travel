<template>
  <div class="publish">
    <h1>发布个人动态</h1>
    <el-form v-model="updates_form" ref="updateFormRef">
      <!-- 分享的内容 -->
      <el-form-item>
        <el-input type="textarea" v-model="updates_form.content" rows="8" name="content"
          placeholder="分享新鲜事..."></el-input>
      </el-form-item>
      <!-- 添加图片 -->
      <el-form-item>
        <div class="update_photo_wall">
          <TransitionGroup name="fadeIn">
            <div class="update_photo_item" v-for="(photo, index) in update_photo_list_fake" :key="index">
              <img :src="photo.url" alt="photo" />
            </div>
          </TransitionGroup>
          <div class="addPhoto">
            <svg class="icon" aria-hidden="true" @click="add_updates_photo">
              <use xlink:href="#icon-jiahao1"></use>
            </svg>
          </div>
          <input type="file" style="display: none;" ref="inputRef" name="updatesPhotos" @change="fileChange"
            accept="image/*" multiple>
        </div>
      </el-form-item>
      <!-- 设置权限 -->
      <el-form-item>
        <el-radio-group v-model="updates_form.isPublic">
          <el-radio label="public" value="true">公开</el-radio>
          <el-radio label="private" value="false">私密</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">发布</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script setup>

import { ref, reactive, TransitionGroup, onBeforeMount, defineEmits } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus';

const updateFormRef = ref(null);
const route = useRoute();
const userId = route.params.id;
const inputRef = ref(null); // 用于获取input的dom 

const emits = defineEmits(['publish_success', 'success_publish'])

// 用户发布动态的表单
const updates_form = reactive({
  content: '',
  // 权限
  isPublic: 'true'
});


// 用户发布动态的图片
const update_photo_list_fake = ref([
]);

// 添加图片
const add_updates_photo = () => {
  // console.log('添加图片');
  inputRef.value.click();
}

// 文件改变触发的函数
const fileChange = () => {
  // console.log('文件改变');
  // console.log(inputRef.value.files);
  //  将选中的我文件push到update_photo_list中

  for (let i = 0; i < inputRef.value.files.length; i++) {
    const file = inputRef.value.files[i];
    // 将文件转换为base64编码
    const url = URL.createObjectURL(file);
    update_photo_list_fake.value.push({
      url
    });
  }
}

// 提交动态
const submit = async () => {

  const formData = new FormData();
  for (let i = 0; i < inputRef.value.files.length; i++) {
    formData.append('updatesPhotos', inputRef.value.files[i]);
  }
  formData.append('content', updates_form.content);
  formData.append('isPublic', updates_form.isPublic);


  // console.log('发布动态');
  console.log(formData);
  const result = await axios({
    method: 'post',
    url: '/api/dynamic',
    params: {
      userId: userId
    },
    data:
      formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  if (result.data.code == 200) {
    ElMessage.success('动态发布成功！');
    emits('publish_success');
    emits('success_publish');
  } else {
    ElMessage.error('发布失败')
  }

}



</script>

<style scoped>
.fadeIn-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);

}

.fadeIn-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.fadeIn-enter-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fadeIn-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fadeIn-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fadeIn-leave-active {
  position: absolute;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fadeIn-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
<style lang="scss" scoped>
.publish {

  .update_photo_wall {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 1rem;



    img {
      width: 6rem;
      height: 6rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.245);
      object-fit: cover;
    }

    .addPhoto {
      width: 6rem;
      height: 6rem;
      // background-color: #ffffff;
      border: 1px dashed #000000;
      transition: all 0.3s;
      border-radius: 0.5rem;

      .icon {
        width: 3rem;
        height: 3rem;
        margin: 1.5rem;
        transition: all 0.3s;

        &:hover {
          cursor: pointer;
          transform: scale(1.2);
        }
      }

      &:hover {
        border: 1px dashed #409eff;
      }
    }

  }



  h1 {
    text-align: center;
    font-size: 20px;
    margin-bottom: 20px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-button {
    width: 100%;
  }

  .el-input {
    width: 100%;
  }
}
</style>