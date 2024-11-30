<template>
    <div>
        <canvas id="canvas"></canvas>
        <div id="control">
            <div class="label">1、测试说话</div>
            <button id="play">测试音频</button>
            <br /><br />
            <div class="label">2、调用接口生成音频</div>
            <textarea v-model="text" style="width:400px;height:300px;">你好，欢迎光临</textarea>
            <br /><br />
            <button id="start">开始说话</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 定义响应式数据
const text = ref('你好，欢迎光临'); // 用来存储文本输入
let model = null;

// Live2D 模型路径
const cubism4Model = '/public/live2d/model/Nahida/Nahida_1080.model3.json';

// 在组件挂载时执行
onMounted(() => {
    const live2d = PIXI.live2d;

    // 初始化 PIXI 应用
    const app = new PIXI.Application({
        view: document.getElementById('canvas'),
        autoStart: true,
        resizeTo: window,
        backgroundColor: 0x333333,
    });

    (async function main() {
        const models = await Promise.all([live2d.Live2DModel.from(cubism4Model)]);

        models.forEach((m) => {
            app.stage.addChild(m);

            const scaleX = innerWidth / m.width;
            const scaleY = innerHeight / m.height;

            // 自适应窗口尺寸
            m.scale.set(Math.min(scaleX, scaleY));
            m.y = innerHeight * 0.1;
            draggable(m);
        });

        model = models[0];

        // 居中显示模型
        model.x = (innerWidth - model.width) / 2;

        // 监听模型交互
        model.on('hit', (hitAreas) => {
            if (hitAreas.includes('Body')) {
                model.motion('Tap');
            }
            if (hitAreas.includes('Head')) {
                model.expression();
            }
        });
    })();

    // 播放音频
    function talk(model, audio) {
        const audio_link = audio;
        const volume = 1;
        const expression = 3;
        const resetExpression = true;
        const crossOrigin = 'anonymous';

        model.speak(audio_link, {
            volume,
            expression,
            resetExpression,
            crossOrigin,
        });
        model.speak(audio_link);
        model.speak(audio_link, { volume });
        model.speak(audio_link, { expression, resetExpression });
    }

    // 拖动功能
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

    // 点击播放测试音频
    document.getElementById('play').onclick = function () {
        talk(model, '/src/assets/audio/demo.mp3');
    };

    // 点击开始生成音频
    document.getElementById('start').onclick = function () {
        const textValue = text.value.trim();
        if (textValue === '') {
            alert('请输入内容');
            return false;
        }
        document.getElementById('start').disabled = true;
        axios
            .get(
                `http://127.0.0.1:2020/dealAudio?file_name=test.mp3&voice=xiaoxiao&text=${textValue}`
            )
            .then((response) => {
                const audioUrl = response.data + '?v=' + new Date().getTime();
                talk(model, audioUrl);
                document.getElementById('start').disabled = false;
            })
            .catch((error) => {
                console.error('请求接口失败:', error);
                document.getElementById('start').disabled = false;
            });
    };
});
</script>

<style scoped>
#control {
    position: absolute;
    top: 50px;
    left: 50px;
    color: #ffffff;
    font-size: 18px;
}

.label {
    font-size: 32px;
    font-weight: 800;
}
</style>