<template>
    <div class="about">
        <h1>This is an about page</h1>

        <div>
            <el-button>默认按钮</el-button>
            <el-button type="primary">主要按钮</el-button>
            <el-button type="success">成功按钮</el-button>
            <el-button type="info">信息按钮</el-button>
            <el-button type="warning">警告按钮</el-button>
        </div>

        <p>识别结果: {{ recognitionResult }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            recognitionResult: '', // 保存语音识别结果
            recognition: null, // WebkitSpeechRecognition 实例
            keywords: ['小王', '小黑'], // 关键词列表
        };
    },
    methods: {
        /**
         * 初始化语音识别功能
         */
        initSpeechRecognition() {
            if ('webkitSpeechRecognition' in window) {
                const recognition = new window.webkitSpeechRecognition();
                recognition.lang = 'zh-CN'; // 设置语言为中文
                recognition.continuous = true; // 持续监听
                recognition.interimResults = false; // 禁止临时结果

                // 监听识别结果
                recognition.addEventListener('result', this.handleRecognitionResult);

                // 处理语音结束
                recognition.addEventListener('end', this.handleRecognitionEnd);

                // 设置到实例中
                this.recognition = recognition;
                this.recognition.start(); // 开始监听
            } else {
                console.error('您的浏览器不支持 Web Speech API');
            }
        },
        /**
         * 处理语音识别结果
         * @param {SpeechRecognitionEvent} event
         */
        handleRecognitionResult(event) {
            const results = event.results;
            const transcript = results[results.length - 1][0].transcript.trim().toLowerCase();

            console.log('识别结果:', transcript);

            // 匹配关键词
            if (this.keywords.some((keyword) => transcript.includes(keyword))) {
                this.recognitionResult = transcript;
            }
        },
        /**
         * 处理语音识别结束事件，自动重启
         */
        handleRecognitionEnd() {
            console.log('识别结束，重新启动监听...');
            if (this.recognition) {
                this.recognition.start();
            }
        },
        /**
         * 停止语音识别
         */
        stopRecognition() {
            if (this.recognition) {
                this.recognition.stop();
            }
        },
    },
    mounted() {
        this.initSpeechRecognition(); // 初始化语音识别
    },
    beforeDestroy() {
        this.stopRecognition(); // 页面销毁时停止识别
    },
};
</script>

<style scoped>
.about {
    padding: 20px;
}
</style>