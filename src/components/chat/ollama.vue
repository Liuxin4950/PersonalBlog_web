<template>
    <div class="app">
        <div class="rote">
            你好
        </div>
        <div class="roto" v-if="!isSupported">
            浏览器不支持
            <a href="https://caniuse.com/mdn-api_speechrecognition" target="_blank">more details</a>
        </div>
        <div v-else>
            <header>
                <h1> 语音识别 </h1>
                <i class="header-icon fas fa-microphone-alt"></i>
            </header>
            <main>
                <div class="mic-buttons">
                    <button v-if="!isListening" @click="start">
                        Speak
                    </button>
                    <button v-if="isListening" class="orange" @click="stop">
                        Stop
                    </button>
                </div>
                <h2> 翻译 </h2>
                <p v-if="error">{{ error }}</p>
                <div v-else>
                    <textarea v-model="result" class="text-transcript" cols="30" rows="10">  </textarea>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue'

export function useSpeechRecognition({ lang = 'zh-CN', continuous = true, interimResults = true }) {
    const isListening = ref(false)
    const isFinal = ref(false)
    const result = ref('')
    const error = ref('')

    // 初始化 web speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    // 检查浏览器是否支持
    const isSupported = Boolean(SpeechRecognition)
    // 创建构造函数
    const recognition = isSupported ? new SpeechRecognition() : null

    // 设置开始监听函数
    const start = () => {
        if (recognition && !isListening.value) {
            isListening.value = true
            recognition.start() // 启动语音识别
        }
    }

    // 停止监听
    const stop = () => {
        if (recognition && isListening.value) {
            isListening.value = false
            recognition.stop() // 停止语音识别
        }
    }

    // 检查浏览器是否支持
    if (isSupported) {
        recognition.continuous = continuous
        recognition.interimResults = interimResults
        recognition.lang = lang

        recognition.onstart = () => {
            isFinal.value = false
        }

        // 获得响应结果
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => {
                    isFinal.value = result.isFinal
                    return result[0]
                })
                .map(result => result.transcript)
                .join('')

            result.value = transcript
            error.value = undefined
        }

        // 错误处理
        recognition.onerror = (event) => {
            error.value = 'Speech recognition error detected: ' + event.error
        }

        recognition.onend = () => {
            isListening.value = false
        }

        watch(isListening, () => {
            if (isListening.value) recognition.start()
            else recognition.stop()
        })
    }

    // 返回需要的状态和方法
    return {
        isSupported,
        isListening,
        isFinal,
        result,
        error,
        start,
        stop
    }
}
</script>

<style scoped>
@keyframes rote {
    from {
        transform: rotate(0);
        background-color: aqua;
    }

    to {
        transform: rotate(360deg);
        background-color: blueviolet;

    }
}

.rote {
    width: 500px;
    height: 500px;
    background-color: blueviolet;
    transform: rotate(0);
    animation: rote 1s ease infinite reverse;
}

.app {
    padding: 20px;
}

.mic-buttons button {
    margin: 10px;
}

.orange {
    background-color: orange;
}

.text-transcript {
    width: 100%;
}
</style>
