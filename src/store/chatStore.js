import { defineStore } from 'pinia';

export const useChatStore = defineStore('chat', {
    state: () => ({
      messages: []
    }),
    actions: {
      addMessage(message) {
        console.log('添加消息:', message);  // 添加调试日志
        this.messages.push(message);
      },
      closeMessage(){
        this.messages = []
      }
    },
    persist: {
      key: 'chatStore',
      storage: localStorage,
    },
  });
  