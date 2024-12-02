import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: ref([]), // 正确地初始化 messages 为 ref([])，使其成为响应式
  }),
  actions: {
    addMessage(message) {
      console.log('添加消息:', message); // 添加调试日志
      this.messages.push(message); // 将消息添加到 messages 数组
    },
    closeMessage() {
      this.messages = [] // 清空消息
    },
  },
  persist: {
    enabled: true, // 开启持久化
    strategies: [
      {
        key: 'chatStore', // 本地存储的 key 名
        storage: localStorage, // 默认存储在 localStorage
      },
    ],
  },
});
