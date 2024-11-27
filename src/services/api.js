import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:8080/api',  // 后端接口的根地址
    timeout: 5000,  // 请求超时的时间，单位是毫秒
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 在每次请求之前执行（比如设置 token）
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
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
        // 根据实际情况可以展示提示消息或者重定向到登录页等
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
