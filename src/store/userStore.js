import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Login } from '@/services/user';

export const useUserStore = defineStore('user', () => {
    // 使用 ref 来存储响应式数据
    const userInfo = ref(null); // 这将存储用户信息
    const token = ref(''); // 初始化 token 为一个空字符串，确保不会出错

    // 登录获取用户信息
    const getUserInfo = async ({ username, password }) => {
        try {
            const res = await Login({ username, password });
            if (res && res.data) {
                userInfo.value = res.data;
                // 你可以在这里保存 token 以便全局使用
                setToken(res.data.token); // 假设后端返回的 token 是 res.data.token
            }
        } catch (error) {
            console.error('登录失败', error);
        }
    };

    // 设置用户信息
    const setUserInfo = (info) => {
        console.log("收到的用户信息:", info);
        userInfo.value = info;
    };

    // 清空用户信息
    const clearUserInfo = () => {
        userInfo.value = null;
        token.value = ''; // 清除 token
    };

    // 设置 token
    const setToken = (newToken) => {
        token.value = newToken;
        // 如果你希望持久化 token，也可以存储到 localStorage 或 cookies
        localStorage.setItem('token', newToken);  // 示例：存储 token
    };

    // 获取 token
    const getToken = () => {
        return token.value || localStorage.getItem('token');  // 尝试从 Pinia 和 localStorage 获取
    };

    return {
        userInfo, // 用户信息
        token,    // token
        getUserInfo, // 获取用户信息
        setUserInfo, // 设置用户信息
        clearUserInfo, // 清空用户信息
        setToken,   // 设置 token
        getToken,   // 获取 token
    };
}, {
    persist: {
        enabled: true, // 开启持久化
        strategies: [
            {
                key: 'user', // 本地存储的 key 名
                storage: localStorage, // 默认存储在 localStorage
            },
        ],
    },
});
