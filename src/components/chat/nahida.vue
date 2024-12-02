<template>
    <div class="container">
        <!-- 输入框放置在模型头部 -->
        <div class="input-container">
            <input v-model="text" placeholder="请输入文本" class="input-box" @keyup.enter="sendMessage"></input>
        </div>
        <canvas id="canvas"></canvas>
        <div id="control">
            <div class="label">1、测试说话</div>
            <button id="play">测试音频</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';


const text = ref('你好，欢迎光临'); // 用来存储文本输入
let model = null;

const cubism4Model = '/public/live2d/model/Nahida/Nahida_1080.model3.json';
const props = defineProps({
    audioUrl: {
        type: String,
        default: ''
    }
});
const audioRef = ref(null);
// 当 audioUrl 改变时，播放音频
watch(() => props.audioUrl, (newAudioUrl) => {
    if (newAudioUrl && audioRef.value) {
        console.log("改变了，触发成功", newAudioUrl);

        talk(model, newAudioUrl);  // 使用生成的 Blob URL
    }
});

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

    // 播放音频的函数
    function talk(model, audio) {
        model.speak(audio, {
            volume: 1,
            expression: 3,
            resetExpression: true,
            crossOrigin: 'anonymous',
        });
    }

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

    document.getElementById('play').onclick = function () {
        talk(model, '/src/assets/audio/mog.wav');
    };


});
// 播放音频的函数
function talk(model, audio) {
    model.speak(audio, {
        volume: 1,
        expression: 3,
        resetExpression: true,
        crossOrigin: 'anonymous',
    });
}

const sendMessage = async () => {
    talk(model, '/src/assets/audio/mog.wav');
};
</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    background-color: transparent;
}

#canvas {
    width: 100%;
    height: 100%;
    display: block;
}

#control {
    position: absolute;
    bottom: 50px;
    left: 50px;
    color: #ffffff;
    font-size: 18px;
    z-index: 10;
    background-color: transparent;
}

.label {
    font-size: 20px;
    font-weight: 800;
}

.input-container {
    width: 100%;
    height: 100px;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    justify-content: center;
}

.input-box {
    width: 80%;
    height: 80px;
    font-size: 16px;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid #fff;
    background-color: rgba(108, 224, 118, 0.5);
    color: #157c23;
    resize: none;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

textarea:focus {
    outline: none;
}

button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:disabled {
    background-color: #ccc;
}

button:hover {
    background-color: #2980b9;
}
</style>
