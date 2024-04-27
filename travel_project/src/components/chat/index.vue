<template>
  <div class="chat" ref="chatRef">
    <div class="left">
      <div class="left_title">好友列表</div>
      <div class="friendList">
        <div v-for="(item, index) in friendList" :key="index" class="friendItem" @click="chatWithUser(item._id, index)"
          :class="{ 'selected': index == currentIndex }">
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
        <div class="title">{{ currentUser_friend_name }}</div>
        <!-- 展示历史消息 -->
        <div v-for="(message, index) in messages" :key="index"
          :class="{ 'send': message.type === 'sent', 'receive': message.type === 'received', 'time': message.type === 'time' }"
          class="message">

          <div class="userAvatar">
            <img :src="message.avatar" alt="">
          </div>

          <div class="msgContent">
            <el-tooltip effect="dark" :content="message.time" placement="right">
              <p> {{ message.text }}</p>
            </el-tooltip>
            <!-- <p> {{ message.text }}</p> -->
            <template v-if="message.photos">
              <div class="sendPhoto">
                <img :src="item" alt="" v-for="item in message.photos"
                  style="width: 5rem;height: 5rem;object-fit: cover;border-radius: 0; margin-right: 0.5rem;"
                  @dblclick="handleDbclick(item)">
              </div>
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

          <textarea name="" id="" cols="0" rows="1" class="inputContent" v-model="msg" contenteditable="true"
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
import { ref, onBeforeMount, nextTick, onMounted, unref, reactive, watch } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
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
const user_id = ref(route.params.id);
const currentUser_friend_name = ref('');

const currentIndex = ref(0);




const inputRef = ref(null);

const socket = io('http://localhost:3000');

const msg = ref('');

const chatRef = ref(null);
const chatBoxRef = ref(null);
const toolBoxRef = ref(null);
const friendList = ref([]);
const messages = ref([]);
const historyMessages = ref([]);
const showTime = ref(false);

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
const chatWithUser = (id, index) => {
  currentIndex.value = index;
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
  // 输出一下当前的路由id
  // console.log('路由id为', route.params.id);
  currentUser_friends_id.value = loginUserInfo.login_user_info.friends;
  await getFriendsInfo();
  // 获取以前的聊天记录
  await getHistoryMessages();
});

// 监听路由id的变化，获取新的聊天记录
watch(() => route.params.id, async (newVal) => {
  user_id.value = newVal;
  historyMessages.value = [];
  messages.value = [];
  await getHistoryMessages();
});
// 页面加载之前获取历史消息
const getHistoryMessages = async () => {
  const res = await axios({
    method: 'get',
    url: '/api/chat/history',
    params: {
      sender: loginUserInfo.login_user_info._id,
      receiver: user_id.value
    }
  });
  if (res.data.history.length === 0) {
    return;
  }
  // console.log(res.data);
  historyMessages.value = res.data.history;
  console.log(historyMessages.value);
  // 设置常量接受历史消息的长度，避免多次计算
  const HisMlength = historyMessages.value.length;
  for (let i = 0; i < HisMlength; i++) {
    // if (historyMessages.value[i].showTime) {
    //   // console.log('时间消息');
    //   messages.value.push({ text: historyMessages.value[i].message, type: "time", avatar: historyMessages.value[i].avatar, username: historyMessages.value[i].username, photos: [], showTime: true, time: historyMessages.value[i].time });
    // }
    // else if (historyMessages.value[i].sender === loginUserInfo.login_user_info._id && historyMessages.value[i].showTime === false) {
    //   // console.log('发送消息');
    //   messages.value.push({ text: historyMessages.value[i].message, type: "sent", avatar: historyMessages.value[i].avatar, username: historyMessages.value[i].username, photos: historyMessages.value[i].photos, showTime: false, time: historyMessages.value[i].time });
    // } else {
    //   // console.log('接受消息');
    //   messages.value.push({ text: historyMessages.value[i].message, type: "received", avatar: historyMessages.value[i].avatar, username: historyMessages.value[i].username, photos: historyMessages.value[i].photos, showTime: false, time: historyMessages.value[i].time });
    // }
    if (historyMessages.value[i].sender === loginUserInfo.login_user_info._id && historyMessages.value[i].showTime === false) {
      // console.log('发送消息');
      messages.value.push({ text: historyMessages.value[i].message, type: "sent", avatar: historyMessages.value[i].avatar, username: historyMessages.value[i].username, photos: historyMessages.value[i].photos, showTime: false, time: historyMessages.value[i].time });
    } else {
      // console.log('接受消息');
      messages.value.push({ text: historyMessages.value[i].message, type: "received", avatar: historyMessages.value[i].avatar, username: historyMessages.value[i].username, photos: historyMessages.value[i].photos, showTime: false, time: historyMessages.value[i].time });
    }
  }


  // console.log(historyMessages.value[HisMlength - 1].time);

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
    // 将好友信息添加到好友列表中
    friendList.value.push(res.data.data);

  }
  currentIndex.value = friendList.value.findIndex(item => item._id === user_id.value);

  // 获取当前聊天的用户的名字
  currentUser_friend_name.value = friendList.value[currentIndex.value].username;
}

// dom挂载后
onMounted(() => {
  // 聚焦到输入框
  unref(inputRef).focus();
  //  加入特定的房间user_id, from: loginUserInfo.login_user_info._id
  socket.emit('joinPrivateChatRoom', {
    roomId: `room_${loginUserInfo.login_user_info._id}_${user_id.value}`, from: loginUserInfo.login_user_info._id, to: user_id.value
  });
});
// 发送时间
// function sendTime() {
//   socket.emit('send',
//     {
//       message: new Date().toLocaleString(),
//       sender: loginUserInfo.login_user_info._id,
//       receiver: user_id.value,
//       time: new Date().toLocaleString(),
//       avatar: loginUserInfo.login_user_info.avatar,
//       username: loginUserInfo.login_user_info.username,
//       photos: [],
//       showTime: true
//     }
//   );
//   messages.value.push({ text: new Date().toLocaleString(), type: "time", avatar: loginUserInfo.login_user_info.avatar, username: loginUserInfo.login_user_info.username, photos: [], showTime: true, time: new Date().toLocaleString() });
// }

//时间差计算
// function timeCalculate(lastTime) {
//   // console.log(lastTime);
//   const nowDate = new Date();
//   // console.log(nowDate);
//   const cha = new Date(nowDate) - lastTime;
//   const minute = cha / 1000 / 60;
//   // console.log('相差的分钟数为', minute);
//   return minute;
// }
// 发送消息
const sendMessage = () => {
  // if (messages.value.length === 0) {
  //   sendTime();
  // } else {
  //   // 这里有一个问题，最后一个数组需要及时更新，否则一直是之前状态的最后一个数组
  //   // const lastTime = new Date(historyMessages.value[historyMessages.value.length - 1].time);
  //   const lastTime = new Date(messages.value[messages.value.length - 1].time);
  //   // console.log('最后一个时间为', lastTime);
  //   if (timeCalculate(lastTime) > 0.1) {
  //     // 发送时间
  //     sendTime();
  //   }
  // }


  // console.log(msg.value);
  if (msg.value.trim() !== '' || photoList.value.length > 0) {
    socket.emit('send',
      {
        message: msg.value,
        sender: loginUserInfo.login_user_info._id,
        receiver: user_id.value,
        time: new Date().toLocaleString(),
        avatar: loginUserInfo.login_user_info.avatar,
        username: loginUserInfo.login_user_info.username,
        photos: photoList.value,
        showTime: false
      }
    );

    messages.value.push({ text: msg.value, type: "sent", avatar: loginUserInfo.login_user_info.avatar, username: loginUserInfo.login_user_info.username, photos: photoList.value, showTime: false, time: new Date().toLocaleString() });
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
  // 判断是不是发送时间的信息
  // if (message.showTime) {
  //   console.log('时间消息');
  // }
  // if (message.showTime) {
  //   messages.value.push({ text: message.message, type: "time", avatar: message.avatar, username: message.username, photos: [], showTime: true, time: message.time });
  //   nextTick(() => {
  //     scrollToBottom();
  //   });
  //   return;
  // } else {
  //   messages.value.push({ text: message.message, type: "received", avatar: message.avatar, username: message.username, photos: message.photos, showTime: message.showTime, time: message.time });
  //   nextTick(() => {
  //     scrollToBottom();
  //   });
  // }
  // // console.log(message);
  if (message.sender === user_id.value || message.receiver === loginUserInfo.login_user_info._id) {
    messages.value.push({ text: message.message, type: "received", avatar: message.avatar, username: message.username, photos: message.photos, showTime: message.showTime, time: message.time });
    nextTick(() => {
      scrollToBottom();
    });
  }

});

// 监听当前聊天的用户的索引，实时更新当前聊天的用户的名字
watch(() => currentIndex.value, (newVal) => {
  currentUser_friend_name.value = friendList.value[newVal].username;
});

</script>
<style>
/* .el-popper.is-light {
  background: none;
  border: none;
} */

/* .el-popover.el-popper {
  background: none;
  border: none;
  box-shadow: none;
} */

/* .el-popper__arrow::before {
  background: #009cff !important;
} */
</style>


<style scoped lang="scss">
:deep(.el-dialog) {
  background-color: #ffffff00;
  box-shadow: none;
}

// :deep(.el-popper .is-light) {
//   background: none;
//   border: none;
// }
.el-popper>>>.is-light {
  background: none;
  border: none;

}

.el-popover>>>.el-popper {
  background: none;
  border: none;
  box-shadow: none;
}

// :deep(.el-popover .el-popper) {

//   background: none;
//   border: none;
//   box-shadow: none;

// }

:deep(.el-popper__arrow::before) {
  background: #009cff;
}

.selected {
  background-color: #f5f5f5;
}

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


  .left_title {
    padding: 1rem;
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
  }

  .friendList {
    display: flex;
    flex-direction: column;

    .friendItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #cccccc71;
      // box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      transition: all 0.1s;

      &:hover {
        background-color: #f5f5f5;
      }

      .avatar {
        img {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .user_info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-left: 1rem;

        .username {
          font-size: 1rem;
          font-weight: bold;
        }
      }
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
      position: sticky;
      top: 0;
      padding: 0.2rem;
      color: white;
      text-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      font-style: italic;
      text-align: center;
      background-color: rgb(73, 65, 65);
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.719);
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

    .time {
      .userAvatar {
        display: none;
      }

      .msgContent {

        margin: 0 auto;
        display: flex;
        background: #cccccc90;
        color: black;
        font-size: 0.5rem;
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
        // margin-bottom: 0.5rem;
      }

      max-width: 70%;

      margin: 0 0.8rem;
      font-weight: bold;
      padding: 0.5rem;
      font-size: 0.8rem;
      border-radius: 10px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
  }

  .toolBox {
    height: calc(30vh - 60px);
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
