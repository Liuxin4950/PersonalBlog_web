// store/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null, // 当前用户信息
    }),
    actions: {
        setUser(user) {
            this.user = user; // 设置当前用户
        },
        clearUser() {
            this.user = null; // 清除用户信息
        },
    },
});
