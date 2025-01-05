<template>
  <div>
    <div class="content">
      <!-- 聊天信息展示部分 -->
      <div class="chatlist">
        <div class="chatlist-box">
          <div v-for="(message, index) in chatStore.messages" :key="index" class="message"
            :class="{ 'chatlist-user': message.name === 'user', 'chatlist-ai': message.name !== 'user' }">
            <h4 v-if="message.name !== 'user'">{{ message.name }}</h4>
            <div id="markdown" v-html="message.text"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入框部分：用户发送消息 -->
    <div class="text-input">
      <div>
      </div>
      <div class="input-box">
        <input type="text" v-model="userMessage" :disabled="isInputDisabled" placeholder="给Nahida发送消息"
          @keyup.enter="sendMessage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useChatStore } from '../store/chatStore';
import { Ollama } from 'ollama'
import Swal from 'sweetalert2';
import { marked } from 'marked';
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
const ollamaModel = 'qwen2.5:3b'
const ttsModel = 'Naxida'
const chatStore = useChatStore();
const userMessage = ref('');
const isInputDisabled = ref(false);

// 持续聊天功能：发送消息并保持聊天记录
const sendMessage = async () => {
  // 先将用户输入的消息添加到消息列表
  chatStore.addMessage({ name: 'user', text: userMessage.value });

  // 清空输入框
  userMessage.value = '';
  let fullResponse = ref('');
  let currentText = '';
  try {
    const response = await ollama.chat({
      model: ollamaModel,
      messages: chatStore.messages.map((msg) => ({
        role: msg.name === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      stream: true, // 启用流式响应
    });

    for await (const part of response) {
      currentText += part.message.content;
    }
    fullResponse.value += marked(currentText);

    chatStore.addMessage({ name: ttsModel, text: fullResponse.value });
  } catch (error) {
    console.error("Ollama API 错误:", error);
    Swal.fire("错误", "发送消息失败", "error");
  }
};
</script>



<style scoped>
.content {
  width: 1300px;
  background-color: white;
  min-height: calc(100vh - 70px);
}

/* 聊窗口队列 */
.chatlist {
  width: 100%;
  background-color: white;
  height: 100%;
  overflow-y: auto;
}


.chatlist-box {
  padding: 1rem;
  padding-bottom: 120px;
  width: 100%;
  height: 100%;
  background-color: white;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  /* 设置为垂直方向布局 */
  align-items: flex-start;
  /* 对齐到左边 */
}

.chatlist-box h4 {
  margin-bottom: 10px;
}

.message {
  width: fit-content;
  /* 内容宽度自适应 */
  max-width: 70%;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
}

.chatlist-user {
  background-color: #d1f0d1;
  /* 用户消息背景色 */
  align-self: flex-end;
  /* 用户消息右对齐 */
}

.chatlist-ai {
  background-color: #f1f1f1;
  /* AI 消息背景色 */
  align-self: flex-start;
  /* AI 消息左对齐 */
}

/* 用新版的，不然会报错 */
:deep(.code) {
  background-color: #000;
  color: #fff;
  font-family: monospace;
  padding: 10px;
  white-space: pre-wrap;
  border-radius: 5px;
  margin: 10px 0;
}


/* 输入框 */
.text-input {
  width: 100%;
  height: 100px;
  border-radius: 25px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 20;
}

.user-model {
  width: 900px;
  height: 600px;
  z-index: -1;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -150px;
  /* top: -30rem;
  left: calc(50% - 10rem); */

}

.input-box {
  width: 65%;
  margin: 0 auto;
  border-radius: 25px;
  overflow: hidden;
  background-color: #eeeeee;

}

.text-input input {
  width: 100%;
  line-height: 50px;
  font-size: 18px;
  padding-left: 15px;
  border: none;
  outline: none;
  background-color: #eeeeee;
}

@media screen and (max-width: 1300px) {
  .content {
    width: 100%;
  }

}
</style>