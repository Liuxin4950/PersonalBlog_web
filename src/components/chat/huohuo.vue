<template>
    <div class="tool1">
        <!-- 使用 showButtons 来控制按钮显示 -->
        <div class="button1" v-if="showButtons" @mouseenter="mouseOverButtons = true"
            @mouseleave="mouseOverButtons = false">
            <template v-for="(button, index) in buttons" :key="index">
                <button @click="button.action">{{ button.label }}</button>
            </template>
        </div>

        <!-- 人物模型画布 -->
        <canvas id="box1" ref="liveCanvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display/cubism4";

window.PIXI = PIXI;
let app = null;
let model = null;
const liveCanvas = ref(null);
const showButtons = ref(false);  // 控制按钮显示状态
const mouseOverCanvas = ref(false);  // 鼠标是否在 canvas 上
const mouseOverButtons = ref(false); // 鼠标是否在按钮区域

const modelPath = '/live2d/model/huohuo/huohuo.model3.json';

// 固定模型的宽高
const MODEL_WIDTH = 250;
const MODEL_HEIGHT = 400;

// 定义按钮数据
const buttons = [
    { label: "黑脸", action: () => expression('f00') },
    { label: "抱枕", action: () => expression('f01') },
    { label: "空闲", action: () => expression('f02') },
    { label: "白旗", action: () => expression('f03') },
    { label: "护胸", action: () => expression('f04') },
    { label: "白眼", action: () => expression('f05') },
    { label: "睡觉", action: () => motion('sleep') },
    { label: "摇头", action: () => motion('yaotou') },
    { label: "好奇", action: () => motion('haoqi') },
    { label: "瞌睡", action: () => motion('keshui') },
    { label: "灵魂", action: () => motion('linghun') },
    { label: "旗帜", action: () => motion('qizi') },
    { label: "尾巴", action: () => motion('Scene1') },
];

// 加载和渲染 Live2D 模型
onMounted(async () => {
    try {
        app = new PIXI.Application({
            view: liveCanvas.value,
            width: MODEL_WIDTH,
            height: MODEL_HEIGHT,
            resolution: window.devicePixelRatio,
            antialias: true,
            backgroundAlpha: 0,
            powerPreference: 'high-performance',
        });

        app.ticker.stop(); // 禁用自动渲染

        model = await Live2DModel.from(modelPath);
        app.stage.addChild(model);
        model.width = MODEL_WIDTH;
        model.height = MODEL_HEIGHT;
        model.position.set((MODEL_WIDTH - model.width) / 2, (MODEL_HEIGHT - model.height) / 2);

        console.log('模型加载成功');
        renderModel(); // 开始渲染
    } catch (error) {
        console.error('模型加载失败:', error);
    }
});

onBeforeUnmount(() => {
    if (model) {
        model.destroy();
        model = null;
    }
    if (app) {
        app.destroy();
        app = null;
    }
});

// 手动渲染函数
function renderModel() {
    if (app && model) {
        app.renderer.render(app.stage);
        requestAnimationFrame(renderModel);
    }
}

// 鼠标移动事件处理
function onMouseMove(event) {
    const rect = liveCanvas.value.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // 检查鼠标是否在模型区域内
    mouseOverCanvas.value = (
        mouseX >= model.position.x && mouseX <= model.position.x + MODEL_WIDTH &&
        mouseY >= model.position.y && mouseY <= model.position.y + MODEL_HEIGHT
    );

    updateButtonVisibility();
}

// 鼠标离开画布区域时，更新鼠标状态并隐藏按钮
function onMouseLeave() {
    mouseOverCanvas.value = false;
    updateButtonVisibility();
}

// 更新按钮显示状态
function updateButtonVisibility() {
    showButtons.value = mouseOverCanvas.value || mouseOverButtons.value;
}

// 触发模型表情
function expression(type) {
    if (model && model.expression) {
        try {
            model.expression(type);
        } catch (error) {
            console.error(`表情 ${type} 触发失败:`, error);
        }
    }
}

// 触发模型动作
function motion(type) {
    if (model && model.motion) {
        try {
            model.motion(type);
            console.log(`${type} 动作触发成功`);
        } catch (error) {
            console.error(`动作 ${type} 触发失败:`, error);
        }
    }
}
</script>

<style scoped>
#box1 {
    display: block;
    margin: 0 auto;
    width: 250px;
    height: 400px;
}

.button1 {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
    position: absolute;
    top: 0;
    left: 10%;
}

.tool1 {
    width: 250px;
    height: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.tool1 button {
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgb(8, 177, 25);
    font-size: 6px;
    cursor: pointer;
    outline: none;
    transition: .5s;
}

.tool1 button:hover {
    color: rgb(27, 212, 71);
    background-color: rgb(255, 255, 255);
    font-size: 6px;
    cursor: pointer;
    outline: none;
}
</style>
