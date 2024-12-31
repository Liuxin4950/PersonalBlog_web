<template>
    <div class="container" @mouseenter="showInputBox = true" @mouseleave="handleMouseLeave">
        <!-- 输入框放置在模型头部 -->
        <transition name="fade">
            <div class="input-container" v-show="showInputBox">
                <div class="input-box">
                    <input class="input" v-model="userMessage" placeholder="请输入文本" @keyup.enter="sendMessage"
                        @focus="showInputBox = true" @blur="handleBlur">
                    </input>
                </div>

                <div class="control" v-show="fullResponse !== ' '">
                    <div class="control-tool f fb">
                        <button class="closeChatList" @click="activeIndex = 0">聊天页面</button>
                        <button class="closeChatList" @click="activeIndex = 1">控制面板</button>
                    </div>

                    <div v-if="activeIndex == 1" class="control-tool">

                        <div class="f">
                            <!-- 聊天模型 -->
                            <button class="closeChatList">
                                聊天模型:
                                <input type="text" v-model="form.ollamaModel" placeholder="输入聊天模型" />
                            </button>

                            <!-- 语言模型 -->
                            <button class="closeChatList">
                                语言模型:
                                <input type="text" v-model="form.ttsModel" placeholder="输入语言模型" />
                            </button>
                        </div>

                        <div class="f">
                            <!-- 当前情绪选择 -->
                            <button class="closeChatList">
                                当前情绪:
                                <select v-model="form.selectedEmotion">
                                    <option v-for="emotion in ttsEmotion" :key="emotion" :value="emotion">
                                        {{ emotion }}
                                    </option>
                                </select>
                            </button>

                            <!-- 切分字数 -->
                            <button class="closeChatList">
                                切分字数:
                                <input type="number" v-model.number="len" placeholder="输入字数" />
                            </button>
                        </div>

                        <div class="f">
                            <!-- Top K 设置 -->
                            <button class="closeChatList">
                                Top K:
                                <input type="number" v-model.number="form.top_k" placeholder="输入 Top K" />
                            </button>

                            <!-- Top P 设置 -->
                            <button class="closeChatList">
                                Top P:
                                <input type="number" step="0.1" v-model.number="form.top_p" placeholder="输入 Top P" />
                            </button>
                            <button class="closeChatList">
                                speed:
                                <input type="number" step="0.1" v-model.number="form.speed" placeholder="输入 speed" />
                            </button>

                        </div>
                        <!-- Temperature 设置 -->

                        <button class="closeChatList">
                            Temperature:
                            <input type="number" step="0.1" v-model.number="form.temperature" placeholder="输入温度值" />
                        </button>
                        <!-- 提交和操作按钮 -->
                        <button class="closeChatList" @click="textAudio">播放音频</button>
                        <button class="closeChatList" @click="closeChatList">重置记忆</button>
                        <button class="closeChatList" @click="fullResponse = ''">隐藏</button>
                        <router-link :to="`/chat`">
                            <button class="closeChatList">查看记忆</button>
                        </router-link>
                    </div>
                    <div v-else id="markdown" class="control-chat" v-html="fullResponse"></div>
                </div>
            </div>
        </transition>
        <canvas id="canvas"></canvas>
    </div>
</template>


<script setup>
import { ref, onMounted, watch, reactive, toRaw } from 'vue';
import { useChatStore } from '@/store/chatStore';
import { Ollama } from 'ollama'
import Swal from 'sweetalert2';
import { GenerateAudioUrl } from '@/services/tts';
import { marked } from 'marked';
// 定义当前激活的页面索引
const activeIndex = ref(1);
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
const ServiceUrl = 'http://47.108.63.126:8080'
const chatStore = useChatStore();
const userMessage = ref('');
let fullResponse = ref('');
const showInputBox = ref(false); // 控制输入框的显示与隐藏
const cubism4Model = '/public/live2d/model/Nahida/Nahida_1080.model3.json';
const ollamaModel = ref('qwen2.5:3b')
const ttsModel = 'Naxida'
const ttsEmotion = ['default', 'chat', 'empathetic']//情绪
const len = ref(10)
// 表单参数集合
const form = reactive({
    ollamaModel: "qwen2.5:3b",
    ttsModel: "Naxida",
    selectedEmotion: ttsEmotion[0],
    batch_size: 50,
    top_k: 5,
    top_p: 0.8,
    temperature: 0.8,
    text: "",
    speed: 1,
});


let isAuto = ref(true);
let audioQueue = ref([]); // 使用 ref 包装数组
let currentText = "";

const textAudio = async () => {

    const audioPath = ServiceUrl + `/tts_outputs/Believe in You-nonoc.m4a`;
    console.log("正在播放", audioPath);
    await talk(audioPath); // 等待播放完成
    audioQueue.value.shift(); // 播放完成后移除队列
}

//按照文本生成音频文件，将音频推入列表
const playAudio = async (text) => {
    activeIndex.value = 0//切换到聊天窗口
    currentText = ""//清空已经推理的文本
    try {
        const url = await GenerateAudioUrl({
            ...toRaw(form),
            text
        });
        audioQueue.value.push(url); // 加入队列
    } catch (error) {
        console.error("生成音频路径失败：", error);
    }
};
//播放音频，同步模型嘴部。
function talk(audioPath) {
    return new Promise((resolve, reject) => {
        isAuto.value = false; // 播放开始
        const audioChecker = new Audio(audioPath); // 用于判断播放完成

        audioChecker.volume = 0; // 静音，用于检测播放状态
        audioChecker.crossOrigin = "anonymous";

        // 播放结束
        audioChecker.onended = () => {
            isAuto.value = true;
            resolve();
        };

        // 播放失败
        audioChecker.onerror = (err) => {
            console.error("检测音频播放出错：", err);
            isAuto.value = true; // 即使失败也恢复状态
            reject(err);
        };

        // 播放检测对象
        audioChecker.play().catch((err) => {
            console.error("检测音频无法播放：", err);
            isAuto.value = true;
            reject(err);
        });
        let exp = Math.floor(Math.random() * 10) + 1;
        // 实际播放音频
        model.speak(audioPath, {
            volume: 1,
            expression: exp,
            resetExpression: true,
            crossOrigin: "anonymous",
        });
    });
}


// 监听队列播放音频
watch(
    audioQueue,
    async () => {
        // 队列非空且当前没有在播放时触发播放
        if (audioQueue.value.length > 0 && isAuto.value) {
            const audioPath = ServiceUrl + `${audioQueue.value[0]}`;
            try {
                console.log("正在播放", audioPath);
                await talk(audioPath); // 等待播放完成
                audioQueue.value.shift(); // 播放完成后移除队列
            } catch (error) {
                console.error("音频播放失败：", error);
                audioQueue.value.shift(); // 出现错误也移除队列
            }
        }
    },
    { deep: true }
);

// 发送消息方法
const sendMessage = async () => {
    fullResponse.value = ""; // 清空响应
    chatStore.addMessage({ name: "user", text: userMessage.value });
    userMessage.value = "";
    try {
        const response = await ollama.chat({
            model: form.ollamaModel,
            messages: chatStore.messages.map((msg) => ({
                role: msg.name === "user" ? "user" : "assistant",
                content: msg.text,
            })),
            stream: true, // 启用流式响应
        });

        for await (const part of response) {
            currentText += part.message.content;

            // 每 50 字生成一次音频
            if (currentText.length >= len.value && currentText.endsWith('。')) {
                console.log("生成的文本长度：", currentText.length);
                fullResponse.value += marked(currentText);
                await playAudio(currentText);
            }
        }
        // 播放剩余文本
        if (currentText.length > 0) {
            console.log("最后生成的文本长度：", currentText.length);
            fullResponse.value += marked(currentText);
            await playAudio(currentText);
        }

        chatStore.addMessage({ name: ttsModel, text: fullResponse.value });
    } catch (error) {
        console.error("Ollama API 错误:", error);
        Swal.fire("错误", "发送消息失败", "error");
    }
};


// 清除记忆
const closeChatList = async () => {
    chatStore.closeMessage();
    fullResponse.value = ""
    Swal.fire({
        icon: 'success',
        title: '清除成功！',
        text: '您的聊天记录已清除！',
    });
}

const text = ref('你好，欢迎光临'); // 用来存储文本输入
let model = null;
// 确定模型

onMounted(() => {
    const live2d = PIXI.live2d;
    // 设置 PIXI.Application
    const app = new PIXI.Application({
        view: document.getElementById('canvas'),
        autoStart: true,
        antialias: true,
        backgroundAlpha: 0, // 保持透明背景
        resolution: window.devicePixelRatio || 2,
        clearBeforeRender: true,
    });

    (async function main() {
        const models = await Promise.all([live2d.Live2DModel.from(cubism4Model)]);

        models.forEach((m) => {
            app.stage.addChild(m);

            // 设置最大/最小缩放比例，控制模型宽度
            const scale = .13;  // 设置一个基础缩放比例（解决在高分辨率下变窄的问题）
            const scaleX = 2.5; // 增大宽度，比例可以根据需要调整

            // 仅缩放宽度
            m.scale.set(scale, scale);
            m.scale.x = scale * scaleX;

            // 固定到页面左下角，调整位置
            m.x = 0;
            m.y = 0;

            draggable(m);
        });

        model = models[0];
        model.x = (app.screen.width - model.width) / 2; // 居中显示模型

        model.on('hit', (hitAreas) => {
            if (hitAreas.includes('Body')) {
                model.motion('Tap');
            }
            if (hitAreas.includes('Head')) {
                model.expression();
            }
        });
    })();
    // 使模型可以拖动
    function draggable(model) {
        model.buttonMode = true;
        model.on('pointerdown', (e) => {
            model.dragging = true;
            model._pointerX = e.data.global.x - model.x;
            model._pointerY = e.data.global.y - model.y;
        });
        model.on('pointermove', (e) => {
            if (model.dragging) {
                model.position.x = e.data.global.x - model._pointerX;
                model.position.y = e.data.global.y - model._pointerY;
            }
        });
        model.on('pointerupoutside', () => (model.dragging = false));
        model.on('pointerup', () => (model.dragging = false));
    }
});


// 鼠标离开时的处理逻辑
const handleMouseLeave = () => {
    // 当鼠标离开并且输入框没有聚焦时，才隐藏输入框
    if (document.activeElement !== document.querySelector('.input')) {
        showInputBox.value = false;
    }
}

// 输入框失焦时的处理逻辑
const handleBlur = () => {
    // 输入框失去焦点时，可以隐藏输入框
    showInputBox.value = false;
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    background-color: transparent;
    transition: opacity 0.3s ease-in-out;
}

#canvas {
    width: 100%;
    transform: translateX(-30%);
    height: 100%;
    display: block;
    position: absolute;
    transform: translateX(-80px);
}

.input-container {
    width: 100%;
    height: 40px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    justify-content: center;
    transition: opacity 0.3s ease-in-out;
    /* 过渡效果 */
}

.input-box {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    border: 2px solid #313131;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;

    input {
        width: 100%;
        height: 100%;
        padding-left: 10px;
        color: #3bb34b;
        font-size: 16px;
    }
}


input::placeholder {
    color: #3fa73b;
    /* 设置占位符文字颜色 */
    font-size: 16px;
    /* 设置占位符文字大小 */
    font-style: italic;
    /* 设置占位符文字为斜体 */
    font-weight: bold;
    /* 设置占位符文字为加粗 */
}

/* 回应框 */
.control {
    padding: .5em;
    position: absolute;
    right: 0;
    top: 70px;
    width: 200px;
    min-height: 280px;
    background-color: #30af41de;
    overflow-y: auto;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 12px;
    color: #bcf878;
    overflow-y: auto;

    .control-tool {
        width: 100%;
        height: auto;
    }

    #markdown {
        width: 100%;
        height: auto;
        padding: 0 5px;
        background-color: #cef8d4;
    }

}

// 按钮
.closeChatList {
    width: 100%;
    border: #157c23;
    background-color: #3f9b4b;
    padding: 5px;
    border-radius: 5px;
    color: white;
    transition: .5s;
    margin-bottom: 5px;

    input {
        width: 100%;
        padding: 0.1em;
    }
}

.closeChatList:hover {
    color: #ffffff;
    background-color: #157c23;
}

/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
