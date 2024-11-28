import axios from 'axios';
import { useUserStore } from '@/store/userStore';  // 引入你的 store
import router from '@/router';  // 引入 Vue Router

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:8080/api',  // 后端接口的根地址
    timeout: 5000,  // 请求超时的时间，单位是毫秒
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        const userStore = useUserStore();
        const token = userStore.token;  // 使用可选链（Optional chaining）避免 null 或 undefined
        console.log(token);

        if (token) {
            config.headers['token'] = `${token}`;  // 如果有 token，添加到请求头
        } else {
            // 如果没有 token，清除本地存储的 token 并跳转到登录页面
            console.log("没有 token，跳转到登录页面");
            router.push({ name: 'login' });  // 假设登录页面的 route 名为 'login'
            return Promise.reject('No token, redirecting to login');  // 终止请求
        }
        return config;
    },
    (error) => {
        // 请求错误时的处理
        console.error('请求失败', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 在这里我们直接返回响应的 data
        return response.data;
    },
    (error) => {
        // 错误的响应处理
        console.error('API 请求失败', error);

        // 如果是 token 过期（比如 401 错误），可以做重新登录的处理
        if (error.response && error.response.status === 401) {
            // 清除本地存储的 token
            localStorage.removeItem('token');
            // 使用 Vue Router 跳转到登录页面
            router.push({ name: 'login' });  // 假设登录页面的 route 名为 'login'
        }

        // 根据实际情况可以展示提示消息或做其他处理
        return Promise.reject(error);
    }
);

// 封装 GET 请求
export const get = async (url, params = {}) => {
    try {
        const response = await instance.get(url, { params });
        return response;
    } catch (error) {
        console.error(`GET 请求失败: ${url}`, error);
        throw error;
    }
};

// 封装 POST 请求
export const post = async (url, data = {}) => {
    try {
        const response = await instance.post(url, data);
        return response;
    } catch (error) {
        console.error(`POST 请求失败: ${url}`, error);
        throw error;
    }
};

// 封装 PUT 请求
export const put = async (url, data = {}) => {
    try {
        const response = await instance.put(url, data);
        return response;
    } catch (error) {
        console.error(`PUT 请求失败: ${url}`, error);
        throw error;
    }
};

// 封装 DELETE 请求
export const del = async (url) => {
    try {
        const response = await instance.delete(url);
        return response;
    } catch (error) {
        console.error(`DELETE 请求失败: ${url}`, error);
        throw error;
    }
};
