<template>
  <div>
    <div class="box">
      <div class="content">

        <!-- 配置部分：完整的全局配置 -->
        <div class="config" :class="{ 'collapsed': isCollapsed }">
          <el-card>
            <el-button type="primary" @click="toggleCollapse">{{ isCollapsed ? '展开' : '收缩' }}</el-button>

          </el-card>
          <el-card>
            <div v-show="!isCollapsed" class="config-box">
              <h3>配置全局参数</h3>

              <el-form label-position="top" label-width="100px">
                <!-- BASE_URL -->
                <el-form-item label="BASE_URL">
                  <el-input v-model="config.BASE_URL" placeholder="请输入 服务ip地址" />
                </el-form-item>

                <!-- TTS_PORT -->
                <el-form-item label="TTS_PORT">
                  <el-input v-model="config.TTS_PORT" placeholder="请输入 TTS服务端口" />
                </el-form-item>

                <!-- CHAT_PORT -->
                <el-form-item label="CHAT_PORT">
                  <el-input v-model="config.CHAT_PORT" placeholder="请输入 本地模型端口" />
                </el-form-item>

                <!-- 角色与情感选择部分 -->
                <h3>选择角色和情感</h3>
                <!-- <div>
                  <label for="characterSelect">角色</label>
                  <select id="characterSelect" v-model="config.DEFAULT_TTS_PARAMS.cha_name"
                    @change="updateEmotionsForSelectedCharacter">
                    <option v-for="(emotions, character) in characterList" :key="character" :value="character">
                      {{ character }}
                    </option>
                  </select>
                </div> -->

                <el-form-item label="角色">
                  <el-select v-model="config.DEFAULT_TTS_PARAMS.cha_name"
                    @change="updateEmotionsForSelectedCharacter, $forceUpdate()" placeholder="请选择角色">
                    <el-option v-for="(emotions, character) in characterList" :key="character" :label="character"
                      :value="character">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="情感">
                  <el-select v-model="config.DEFAULT_TTS_PARAMS.character_emotion" placeholder="请选择情感">
                    <el-option v-for="emotion in emotionsForSelectedCharacter" :key="emotion" :label="emotion"
                      :value="emotion">
                    </el-option>
                  </el-select>
                </el-form-item>

                <!-- 其他 TTS 参数 -->
                <h3>其他 TTS 参数</h3>

                <el-form-item label="语言">
                  <el-input v-model="config.DEFAULT_TTS_PARAMS.language" placeholder="请输入语言" />
                </el-form-item>

                <el-form-item label="速度">
                  <el-input-number v-model="config.DEFAULT_TTS_PARAMS.speed" :step="0.1" />
                </el-form-item>

                <el-form-item label="批处理大小">
                  <el-input-number v-model="config.DEFAULT_TTS_PARAMS.batch_size" />
                </el-form-item>

                <el-form-item label="Top-K">
                  <el-input-number v-model="config.DEFAULT_TTS_PARAMS.top_k" />
                </el-form-item>

                <el-form-item label="Top-P">
                  <el-input-number v-model="config.DEFAULT_TTS_PARAMS.top_p" :step="0.1" />
                </el-form-item>

                <el-form-item label="Temperature">
                  <el-input-number v-model="config.DEFAULT_TTS_PARAMS.temperature" :step="0.1" />
                </el-form-item>

                <!-- 优化为布尔值下拉框 -->
                <el-form-item label="流模式">
                  <el-select v-model="config.DEFAULT_TTS_PARAMS.stream" placeholder="请选择流模式">
                    <el-option :label="'True'" :value="true"></el-option>
                    <el-option :label="'False'" :value="false"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="保存临时文件">
                  <el-select v-model="config.DEFAULT_TTS_PARAMS.save_temp" placeholder="请选择是否保存临时文件">
                    <el-option :label="'True'" :value="true"></el-option>
                    <el-option :label="'False'" :value="false"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>

              <!-- 操作按钮 -->
              <el-row justify="center" class="button-group">
                <el-space>
                  <el-button round type="primary" icon="el-icon-check" @click="updateConfig">保存配置</el-button>
                  <el-button round type="danger" icon="el-icon-delete" @click="closeChatList">清除记录</el-button>
                </el-space>
              </el-row>
            </div>

          </el-card>
        </div>


        <!-- 聊天信息展示部分 -->
        <div class="chatlist">
          <div class="chatheader">
            <div class="header-title">ChatTTS</div>
            <div class="user-info">
              <img src="../assets/image/admin/kk.gif" alt="user">
            </div>
          </div>
          <div class="chatlist-box">
            <div v-for="(message, index) in chatStore.messages" :key="index" class="message"
              :class="{ 'chatlist-user': message.name === 'user', 'chatlist-ai': message.name !== 'user' }">
              <h4 v-if="message.name !== 'user'">{{ message.name }}</h4>
              <div v-html="message.text"></div>
              <audio v-if="message.audio" :src="message.audio" controls></audio>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入框部分：用户发送消息 -->
      <div class="text-input">
        <div class="">
          <huohou class="huohuo" />
        </div>
        <div class="input-box">
          <input type="text" v-model="userMessage" :disabled="isInputDisabled" placeholder="给AI发送消息"
            @keyup.enter="sendMessage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import huohou from '../components/chat/huohuo.vue';
import { useChatStore } from '../store/chatStore';
// 统一管理仓库
const chatStore = useChatStore();
// 侧边配置栏
const isCollapsed = ref(false)
const isInputDisabled = ref(false);
const config = ref({
  BASE_URL: '',
  TTS_PORT: '',
  CHAT_PORT: '',
  DEFAULT_TTS_PARAMS: {
    cha_name: '',
    character_emotion: '',
    language: '',
    speed: 1.2,
    batch_size: 70,
    top_k: 1,
    top_p: 0.9,
    temperature: 1.0,
    stream: 'true',
    save_temp: 'False'
  }
})

const characterList = ref({})
const emotionsForSelectedCharacter = ref([])

const userMessage = ref('')

// 配置窗口收缩
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 获取当前的角色列表
const getCharacterList = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/character_list')
    characterList.value = response.data

    if (!config.value.DEFAULT_TTS_PARAMS.cha_name) {
      config.value.DEFAULT_TTS_PARAMS.cha_name = Object.keys(characterList.value)[0]
    }
    updateEmotionsForSelectedCharacter()
  } catch (error) {
    console.error('无法获取角色列表', error)
  }
}

// 更新当前角色的情感选项
const updateEmotionsForSelectedCharacter = () => {
  emotionsForSelectedCharacter.value = characterList.value[config.value.DEFAULT_TTS_PARAMS.cha_name] || []
  if (!emotionsForSelectedCharacter.value.includes(config.value.DEFAULT_TTS_PARAMS.character_emotion)) {
    config.value.DEFAULT_TTS_PARAMS.character_emotion = emotionsForSelectedCharacter.value[0]
  }
  console.log('Selected Character:', config.value.DEFAULT_TTS_PARAMS.cha_name);
  console.log('Available Emotions:', emotionsForSelectedCharacter.value);

}

// 获取当前的全局配置
const getConfig = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/config')
    Object.assign(config.value, response.data)
    console.log(response);

  } catch (error) {
    console.error('无法获取配置', error)
  }
}

// 更新配置
const updateConfig = async () => {
  try {
    let code = await axios.post('http://127.0.0.1:8000/config', config.value)
    console.log(code);

    Swal.fire({
      icon: 'success',
      title: '配置已更新',
      text: '您的配置已成功更新！',
    })
  } catch (error) {
    console.error('更新配置失败', error)
    Swal.fire({
      icon: 'error',
      title: '更新配置失败',
      text: '请稍后再试。',
    })
  }
}
//清除所有聊天记录
const closeChatList = () => {
  chatStore.closeMessage()
  Swal.fire({
    icon: 'success',
    title: '清除成功！',
    text: '您的聊天记录已清除！',
  })
}
// 发送聊天消息并显示响应
const sendMessage = async () => {
  if (!userMessage.value) return

  isInputDisabled.value = true;
  try {
    // 先保存用户消息到 store
    chatStore.addMessage({
      name: 'user',
      text: userMessage.value,
    });

    // 发送消息到后端
    const response = await axios.post('http://127.0.0.1:8000/chat', {
      message: userMessage.value
    });
    console.log(response);

    let rawText = response.data.response_text;
    let formattedText = formatResponseText(rawText);
    console.log(formattedText)

    const audioSrc = `data:audio/wav;base64,${response.data.audio_base64}`;

    // 立即保存 AI 的返回消息到 store，不依赖于音频播放
    chatStore.addMessage({
      name: config.value.DEFAULT_TTS_PARAMS.cha_name,
      text: formattedText,
      audio: audioSrc,
    });

    // 尝试播放音频，播放失败时也不会影响数据保存
    const audio = new Audio(audioSrc);
    audio.play().catch(error => {
      console.error('音频播放失败:', error);
    });

    // 清空用户输入框
    userMessage.value = ''
  } catch (error) {
    console.error('发送消息失败', error)
  } finally {
    isInputDisabled.value = false;
  }
}



// 格式化返回的文本
const formatResponseText = (rawText) => {
  // 如果 rawText 为空或不是字符串，返回空字符串
  if (!rawText || typeof rawText !== 'string') {
    console.error('Invalid rawText input');
    return '';
  }

  // 匹配代码块的正则表达式
  let codeBlockRegex = /```([\s\S]*?)```/g;
  let segments = [];
  let lastIndex = 0;
  let match;

  // 循环查找代码块并处理
  while ((match = codeBlockRegex.exec(rawText)) !== null) {
    // 处理代码块前的普通文本，替换句号和换行
    segments.push(
      rawText.slice(lastIndex, match.index)
        .replace(/。/g, '。<br/>') // 中文句号替换为 <br/>
        .replace(/\./g, '.<br/>') // 英文句号替换为 <br/>
    );

    // 处理代码块内容，替换空格和换行
    let codeBlockContent = match[1].replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
    segments.push(`<div class="code">${codeBlockContent}</div>`);

    // 更新 lastIndex 以继续查找下一个代码块
    lastIndex = codeBlockRegex.lastIndex;
  }

  // 处理最后一个代码块之后的普通文本
  segments.push(
    rawText.slice(lastIndex)
      .replace(/。/g, '。<br/>')
      .replace(/\./g, '.<br/>')
  );

  // 返回拼接后的 HTML 字符串
  return segments.join('');
};


// 初始化配置和角色列表
onMounted(() => {
  getConfig()
  getCharacterList()
})
</script>


<style scoped>
.select_popper {
  z-index: 99999 !important;
}

.box {
  margin-top: 70px;
  width: 100%;
  height: calc(100vh - 70px);
  background-color: #fafafa;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
}

.config {
  width: 350px;
  height: calc(100%);
  background-color: white;
  padding: 10px;
  padding-bottom: 100px;
  transition: width 0.5s;
  overflow-y: auto;
  /* 添加宽度变化的过渡 */
}

.config .el-card {
  box-shadow: none;
}

.config.collapsed {
  width: 130px;
  /* 收缩后的宽度 */
  padding: 10px 5px;
  /* 收缩后的内边距 */
}

.config button {
  color: #fff;
}


/* 聊窗口队列 */
.chatlist {
  width: 100%;
  height: calc(100% - 60px);
  background-color: white;
}

.chatheader {
  width: 100%;
  height: 60px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
}

.user-info {
  display: flex;
}

.user-info img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: cadetblue;
  color: white;
  padding: 5px;
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

::v-deep .code {
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
  background-color: white;
  border-radius: 25px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 20;
}

.huohuo {
  width: 300px;
  z-index: -1;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  /* top: -30rem;
  left: calc(50% - 10rem); */

}

.input-box {
  width: 80%;
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
</style>