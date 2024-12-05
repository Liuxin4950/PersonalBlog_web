<template>
    <div class="container" @mouseenter="showInputBox = true" @mouseleave="handleMouseLeave">
        <!-- 输入框放置在模型头部 -->
        <transition name="fade">
            <div class="input-container" v-show="showInputBox">
                <input v-model="userMessage" placeholder="请输入文本" class="input-box" @keyup.enter="sendMessage"
                    @focus="showInputBox = true" @blur="handleBlur">
                </input>
                <div class="control">
                    <button class="closeChatList" @click="closeChatList">清除记忆</button>
                    <button class="closeChatList" @click="playAudio">播放音频</button>

                    {{ fullResponse }}
                </div>
            </div>
        </transition>
        <canvas id="canvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useChatStore } from '@/store/chatStore';
import { Ollama } from 'ollama'
import Swal from 'sweetalert2';
import { GenerateAudioUrl } from '@/services/tts';
const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
const chatStore = useChatStore();
const userMessage = ref('');
let fullResponse = ref('');
const showInputBox = ref(false); // 控制输入框的显示与隐藏

// 持续聊天功能：发送消息并保持聊天记录
const sendMessage = async () => {

    fullResponse.value = ""; // 清空

    // 先将用户输入的消息添加到消息列表
    chatStore.addMessage({ name: 'user', text: userMessage.value });

    // 清空输入框
    userMessage.value = '';

    try {
        // 将当前消息和之前的对话一并发送给 Ollama
        const message = { role: 'user', content: userMessage.value };
        const response = await ollama.chat({
            model: 'naxida:latest',  // 使用的模型
            messages: chatStore.messages.map(msg => ({ role: msg.name === 'user' ? 'user' : 'assistant', content: msg.text })),
            stream: true,  // 启用流式响应
        });

        // 处理流式响应并更新消息
        for await (const part of response) {
            fullResponse.value += parseMarkdown(part.message.content); // 拼接消息内容
        }
        console.log(fullResponse.value);
        playAudio(fullResponse.value)

        chatStore.addMessage({ name: 'Nahida', text: fullResponse }); // 更新消息列表

    } catch (error) {
        console.error('Ollama API 错误:', error);
        Swal.fire('错误', '发送消息失败', 'error');
    }
};
//markdown解析过滤
function parseMarkdown(mdText) {
    // 去除标题符号（#）
    mdText = mdText.replace(/^#{1,6}\s+/g, ''); // 去除标题
    // 去除加粗符号（** 或 __）
    mdText = mdText.replace(/\*\*|\_\_/g, '');
    // 去除斜体符号（* 或 _）
    mdText = mdText.replace(/\*|\_/g, '');
    // 去除无序列表符号（* 或 -）
    mdText = mdText.replace(/^\s*[\*\-]\s+/gm, '');
    // 去除有序列表符号（数字.）
    mdText = mdText.replace(/^\s*\d+\.\s+/gm, '');
    // 去除链接和图片语法
    mdText = mdText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1'); // 链接
    mdText = mdText.replace(/!\[([^\]]+)\]\([^\)]+\)/g, '$1'); // 图片
    // 去除代码块和代码行
    mdText = mdText.replace(/```[\s\S]*?```/g, ''); // 多行代码块
    mdText = mdText.replace(/`[^`]+`/g, ''); // 单行代码

    // 在每个句点 (。) 后面加上换行符
    mdText = mdText.replace(/。/g, '。\n');

    return mdText;
}

const playAudio = async (text) => {
    let url = await GenerateAudioUrl({
        "character": "流萤",
        "text": text
    });
    console.log("生成的音频路径:" + url);

    let audioPath = `http://localhost:8080` + url + `?timestamp=${new Date().getTime()}`;
    console.log("我发送请求的链接" + audioPath);

    // 使用前端的音频播放功能
    talk(model, audioPath);  // 修改为新的函数名
}


// 播放音频的函数
function talk(model, audio) {
    let i = Math.floor(Math.random() * 11);
    model.speak(audio, {
        volume: 1,
        expression: i,
        resetExpression: true,
        crossOrigin: 'anonymous',
    });
}


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
const cubism4Model = '/public/live2d/model/Nahida/Nahida_1080.model3.json';

onMounted(() => {
    const live2d = PIXI.live2d;
    // 设置 PIXI.Application
    const app = new PIXI.Application({
        view: document.getElementById('canvas'),
        autoStart: true,
        resizeTo: window,  // 自动适应窗口尺寸
        backgroundAlpha: 0, // 保持透明背景
        resolution: window.devicePixelRatio || 1, // 提高清晰度
        clearBeforeRender: true,
    });

    (async function main() {
        const models = await Promise.all([live2d.Live2DModel.from(cubism4Model)]);

        models.forEach((m) => {
            app.stage.addChild(m);
            const scaleX = app.screen.width / m.width;
            const scaleY = app.screen.height / m.height;

            // 适配屏幕尺寸
            m.scale.set(Math.min(scaleX, scaleY));
            m.y = 50; // 留出空间给输入框
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

// 播放音频的函数
// 播放音频的函数
function playAudioFunction(model, audio) {
    let i = Math.floor(Math.random() * 11);
    model.speak(audio, {
        volume: 1,
        expression: i,
        resetExpression: true,
        crossOrigin: 'anonymous',
    });
}

// 鼠标离开时的处理逻辑
const handleMouseLeave = () => {
    // 当鼠标离开并且输入框没有聚焦时，才隐藏输入框
    if (document.activeElement !== document.querySelector('.input-box')) {
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
    width: 200%;
    transform: translateX(-30%);
    height: 100%;
    display: block;
    position: absolute;
}

.input-container {
    width: 100%;
    height: 50px;
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
    font-size: 12px;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid #fff;
    background-color: rgba(108, 224, 118, 0.5);
    color: #157c23;
    resize: none;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

input::placeholder {
    color: #267223;
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
    top: 100px;
    width: 190px;
    min-height: 260px;
    background-color: #8be297c2;
    overflow-y: auto;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 12px;
    color: #2f8808;

}

.closeChatList {
    border: #157c23;
    background-color: #3bb34b;
    padding: 5px;
    border-radius: 5px;
    color: white;
    transition: .5s;
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
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>
