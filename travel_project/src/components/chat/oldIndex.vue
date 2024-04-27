<template>
  <div class="chat" ref="chatRef">
    <div class="left">
      <div class="left_title">好友列表</div>
      <div class="friendList">
        <div v-for="(item, index) in friendList" :key="index" class="friendItem" @click="chatWithUser(item._id)">
          <div class="avatar">
            <img :src="item.avatar" alt="">
          </div>
          <div class="user_info">
            <span class="username">{{ item.username }}</span>

          </div>
        </div>
      </div>
    </div>
    <div class="right">

      <div class="chatBox" ref='chatBoxRef'>
        <div class="title">你正在与Jack聊天</div>
        <!-- 展示历史消息 -->

        <div v-for="(message, index) in messages" :key="index"
          :class="{ 'send': message.type === 'sent', 'receive': message.type === 'received' }" class="message">
          <div class="userAvatar">
            <img :src="message.avatar" alt="">
          </div>

          <div class="msgContent">

            <p> {{ message.text }}</p>
            <template v-if="message.photos">
              <div class="sendPhoto">
                <img :src="item" alt="" v-for="item in message.photos"
                  style="width: 5rem;height: 5rem;object-fit: cover;border-radius: 0; margin-right: 0.5rem;"
                  @dblclick="handleDbclick(item)">

              </div>
              <!-- 设置遮罩层 -->

            </template>
          </div>
        </div>

      </div>
      <div class="toolBox" ref="toolBoxRef">
        <div class="toolList">
          <div class="toolItem">
            <svg class="icon" aria-hidden="true" ref="emojiRef" @click="chooseEmoji">
              <use xlink:href="#icon-biaoqing"></use>
            </svg>
          </div>
          <div class="toolItem">
            <svg class="icon" aria-hidden="true" @click="choosePhoto">
              <use xlink:href="#icon-xiangce4"></use>
            </svg>
            <input type="file" style="display: none;" ref="photoRef" @change="photoChange" accept="image/*" multiple>
          </div>
          <div class="toolItem"><svg class="icon" aria-hidden="true" @click="chooseFile">
              <use xlink:href="#icon-wenjian"></use>
            </svg></div>
        </div>

        <div class="inputBox" @keyup.enter="sendMessage">
          <!-- 处理文本 -->
          <!-- <input type="text" class="inputContent" v-model="msg" contenteditable="true" ref="inputRef"> -->

          <textarea name="" id="" cols="0" rows="5" class="inputContent" v-model="msg" contenteditable="true"
            ref="inputRef"></textarea>
          <!-- 处理图片 -->
          <div class="photoShow">

            <img :src="item" alt="" v-for="(item, index) in photoList" @dblclick="handleThis(index)">
            <!-- 设置遮罩层 -->
          </div>
        </div>

      </div>

    </div>
    <!-- 由虚拟元素触发的弹出框,下面设置了virtual-ref来设置由什么触发的虚拟元素 -->
    <el-popover ref="popoverRef" :virtual-ref="emojiRef" trigger="click" virtual-triggering placement="top"
      effect="light" width="30%">

      <Picker :data="emojiIndexTest" set="twitter" @select="showEmoji" />

    </el-popover>

    <!-- 显示图片的对话框 -->
    <el-dialog v-model="show_chat_photo.state" width="500" :show-close="false">
      <div class="viewPhoto">
        <img :src="show_chat_photo.photoPath" alt="">
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
  import { ref, onBeforeMount, nextTick, onMounted, unref, reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  import io from 'socket.io-client';
  import useLoginUserInfoStore from '../../stores/login_user_info_store';
  import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
  // all emoji sets.
  import data from "emoji-mart-vue-fast/data/all.json";
  // Import default CSS
  import "emoji-mart-vue-fast/css/emoji-mart.css";
  import { ElMessage } from 'element-plus';
  // import showPhoto from './input_box_photo/index.vue'
  const loginUserInfo = useLoginUserInfoStore();
  const currentUser_friends_id = ref([]);
  const router = useRouter();
  const route = useRoute();
  // 获取与当前用户聊天的用户id
  const user_id = route.params.id;
  // console.log(user_id);
  const inputRef = ref(null);

  const socket = io('http://localhost:3000');

  const msg = ref('');

  const chatRef = ref(null);
  const chatBoxRef = ref(null);
  const toolBoxRef = ref(null);
  const friendList = ref([]);
  const messages = ref([]);
  const historyMessages = ref([]);

  const show_chat_photo = reactive({
    show_chat_photo_state: false,
    photoPath: ''
  })

  // 上传的图片集合
  const photoList = ref([]);
  // 设置emoji实例
  let emojiIndex = new EmojiIndex(data);
  let emojiIndexTest = emojiIndex;

  const popoverRef = ref(null);

  const emojiRef = ref(null);
  const photoRef = ref(null);

  // 选择表情
  const chooseEmoji = () => {
    // console.log('选择表情');
    unref(popoverRef).popperRef?.delayHide?.()
  }

  // 显示表情
  const showEmoji = (emoji) => {
    // 将表情添加到输入框
    msg.value += emoji.native;

    // 聚焦到输入框
    unref(inputRef).focus();
  }

  // 选择图片
  const choosePhoto = () => {
    // console.log('选择图片');
    unref(photoRef).click();
  }

  // 处理双击事件
  const handleDbclick = (path) => {
    show_chat_photo.state = true;
    show_chat_photo.photoPath = path;
    // console.log(path);
    // 在新窗口打开图片
    // window.open(path);
  }
  const handleThis = (index) => {
    photoList.value.splice(index, 1);
  }

  // 图片改变
  const photoChange = async () => {
    // messageType.value = 'photo';
    const files = unref(photoRef).files;
    // console.log(files);
    await handlePhoto(files);

    // 聚焦到输入框

    unref(inputRef).focus();

  }

  // 处理图片上传
  const handlePhoto = async (files) => {

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('chatPhotos', files[i]);
    }
    const res = await axios({
      method: 'post',
      url: '/api/photo',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // console.log(res.data);
    photoList.value = res.data.path_collection;


  }

  // 选择文件
  const chooseFile = () => {
    console.log('选择文件');
  }
  // 与当前用户聊天的用户id
  const chatWithUser = (id) => {
    console.log(id);
    // 跳转
    router.push({ path: `/chat/${id}` })
  }

  // 滚动到底部
  const scrollToBottom = () => {
    const chatBoxElement = chatBoxRef.value;
    if (chatBoxElement) {
      chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
    }
  };

  // dom挂载前
  onBeforeMount(async () => {
    currentUser_friends_id.value = loginUserInfo.login_user_info.friends;
    await getFriendsInfo();
    // 获取以前的聊天记录
    await getHistoryMessages();
  });

  // 页面加载之前获取历史消息
  const getHistoryMessages = async () => {
    const res = await axios({
      method: 'get',
      url: '/api/chat/history',
      params: {
        sender: loginUserInfo.login_user_info._id,
        receiver: user_id
      }
    });
    // console.log(res.data);
    historyMessages.value = res.data.history;
    for (let i = 0; i < historyMessages.value.length; i++) {
      if (historyMessages.value[i].sender === loginUserInfo.login_user_info._id) {
        messages.value.push({ text: historyMessages.value[i].message, type: "sent", avatar: historyMessages.value[i].avatar, username: historyMessages.value[i].username, photos: historyMessages.value[i].photos });
      } else {
        messages.value.push({ text: historyMessages.value[i].message, type: "received", avatar: historyMessages.value[i].avatar, username: historyMessages.value[i].username, photos: historyMessages.value[i].photos });
      }
    }
    nextTick(() => {
      scrollToBottom();
    });
  }

  // 获取所有的好友信息
  const getFriendsInfo = async () => {
    for (let i = 0; i < currentUser_friends_id.value.length; i++) {
      const res = await axios({
        method: 'get',
        url: '/api/users/',
        params: {
          id: currentUser_friends_id.value[i]
        }
      });
      friendList.value.push(res.data.data);

    }
  }

  // dom挂载后
  onMounted(() => {
    // 聚焦到输入框
    unref(inputRef).focus();
    //  加入特定的房间user_id, from: loginUserInfo.login_user_info._id
    socket.emit('joinPrivateChatRoom', {
      roomId: `room_${loginUserInfo.login_user_info._id}_${user_id}`, from: loginUserInfo.login_user_info._id, to: user_id
    });
  })
  // 发送消息
  const sendMessage = () => {
    // console.log(msg.value);
    if (msg.value.trim() !== '' || photoList.value.length > 0) {
      socket.emit('send',
        {
          message: msg.value,
          sender: loginUserInfo.login_user_info._id,
          receiver: user_id,
          time: new Date().toLocaleString(),
          avatar: loginUserInfo.login_user_info.avatar,
          username: loginUserInfo.login_user_info.username,
          photos: photoList.value,
        }
      );

      messages.value.push({ text: msg.value, type: "sent", avatar: loginUserInfo.login_user_info.avatar, username: loginUserInfo.login_user_info.username, photos: photoList.value });
      msg.value = '';
      photoList.value = [];

      nextTick(() => {
        scrollToBottom();
      });

    } else {
      ElMessage.error('发送内容不能为空');
    }
  };



  // 监听来自服务器的私聊消息
  socket.on('privateMessage', (message) => {
    // console.log(message);
    if (message.sender === user_id || message.receiver === loginUserInfo.login_user_info._id) {
      messages.value.push({ text: message.message, type: "received", avatar: message.avatar, username: message.username, photos: message.photos });
      nextTick(() => {
        scrollToBottom();
      });
    }

  });

</script>
<style>
  .el-dialog {
    --el-dialog-bg-color: rgba(0, 0, 0, 0);
    --el-dialog-box-shadow: none;
  }

  .el-popper.is-light {

    background: none;
    border: none;

  }

  .el-popover.el-popper {
    background: none;
    border: none;
    box-shadow: none;
  }

  .el-popper__arrow::before {
    background: #009cff !important;
  }

</style>


<style scoped lang="scss">
  .chat {
    display: flex;
  }


  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }

  .left {
    position: fixed;
    top: 60px;
    width: 20%;
    padding: 1rem;

    .left_title {
      padding: 1rem;
      text-align: center;
      font-size: 1rem;
      font-weight: bold;
    }

    .friendItem {
      display: flex;
      justify-content: flex-start;
      margin: 0.5rem;
      padding: 1rem 0rem 1rem 1rem;
      border-bottom: 1px solid #ccc;
      transition: all 0.3s;

      &:hover {
        background-color: #a65e5e;
      }
    }

    .user_info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-left: 1rem;
    }
  }

  .right {
    display: flex;
    flex-direction: column;
    position: relative;

    left: 20%;
    width: 80%;
    border-left: 1px solid #ccc;




    .chatBox {
      display: flex;
      flex-direction: column;
      height: 70vh;
      overflow: auto;



      .title {
        padding: 1rem;
        text-align: center;
        background-color: skyblue;
        font-size: 1rem;
        font-weight: bold;
      }

      .userAvatar {
        img {
          object-fit: cover;
        }
      }

      .send {
        justify-content: flex-start;
        flex-direction: row-reverse;


        .msgContent {
          background-color: #009cff;
          color: white;
        }



      }

      .receive {
        justify-content: flex-start;


        .msgContent {
          background-color: #ccc;
          color: black;
        }
      }

      .message {
        display: flex;
        margin: 1rem;
        padding: 0 1rem;

      }



      .msgContent {
        p {
          word-wrap: break-word;
          margin-bottom: 0.5rem;
        }

        max-width: 70%;

        margin-left: 10px;
        margin-right: 10px;
        font-weight: bold;
        padding: 0.5rem;
        font-size: 0.8rem;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      }
    }

    .toolBox {
      height: calc(30vh);
      border-top: 1px solid #ccc;
      position: relative;


      // 设置可以控制宽高



      .toolList {
        position: absolute;
        top: 0;

        width: 100%;
        display: flex;
        height: 2rem;

        .toolItem {
          width: 2rem;
          height: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }


      }

      .inputBox {
        position: absolute;
        top: 2rem;
        width: 100%;
        padding: 0.5rem;

        .inputContent {
          display: inline-block;
          width: 100%;
          height: 100%;

          font-size: 1rem;
          border: none;
          outline: none;
          border-bottom: 1px solid #cccccc4f;
          // background-color: red;




        }

        .photoShow {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-items: center;
          margin-top: 0.5rem;
          // background-color: red;

          img {
            width: 5rem;
            height: 5rem;
            object-fit: cover;
            border-radius: 0;
            margin-right: 0.5rem;


          }


        }
      }
    }
  }




  .viewPhoto {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0;
    }
  }


</style>
