<template>
    <div class="chat-container">
        <div class="messages">
            <div v-for="(msg, index) in messages" :key="index" class="message">
                <p><strong>{{ msg.role }}:</strong> {{ msg.content }}</p>
            </div>
        </div>
        <div class="input-area">
            <input v-model="userInput" type="text" placeholder="请输入问题..." @keyup.enter="sendMessage" />
            <button @click="sendMessage">发送</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ollama from 'ollama';

// 定义响应式数据
const userInput = ref(''); // 输入框的值
const messages = ref([]);  // 消息数组

// 发送消息的函数
const sendMessage = async () => {
    if (!userInput.value) return; // 防止发送空消息

    // 将用户输入的消息添加到消息数组中
    messages.value.push({ role: 'user', content: userInput.value });
    const message = { role: 'user', content: userInput.value };

    try {
        // 调用 Ollama chat API 并启用流式响应
        const response = ollama.chat({
            model: 'qwen2.5:7b',
            messages: [message],
            stream: true
        });

        // 逐步读取响应流
        for await (const part of response) {
            // 将流中的内容逐步添加到消息数组
            messages.value.push({ role: 'assistant', content: part.message.content });
        }
    } catch (error) {
        console.error('聊天请求出错:', error);
        messages.value.push({ role: 'assistant', content: '出错了，请稍后再试。' });
    } finally {
        userInput.value = ''; // 清空输入框
    }
};
</script>

<style scoped>
.chat-container {
    width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.messages {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 10px;
}

.message {
    padding: 10px;
    margin: 5px 0;
    background-color: #e0e0e0;
    border-radius: 5px;
}

.input-area {
    display: flex;
    gap: 10px;
}

input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 8px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>