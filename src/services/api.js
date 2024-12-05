import axios from 'axios';
import { useUserStore } from '@/store/userStore';  // 引入你的 store
import router from '@/router';  // 引入 Vue Router

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:8080/api',  // 后端接口的根地址
    timeout: 30000,  // 请求超时的时间，单位是毫秒
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        console.log("------------------已进入请求拦截器------------------");

        const userStore = useUserStore();
        const token = userStore.token;//从仓库获取token的值
        if (token) {
            console.log("我有token,添加token成功！");
            config.headers['token'] = `${token}`;  // 如果有 token，添加到请求头
        } else {
            console.log("没有 token，跳转到登录页面");
            router.push({ name: 'login' });
            return Promise.reject('没有 token，跳转到登录页面');  // 终止请求
        }
        console.log("------------------已退出请求拦截器------------------");
        console.log("");

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
        return response.data;
    },
    (error) => {
        console.error('API 请求失败', error);
        console.log("报错状态码:", error.response.status);
        if (error.response) {
            const status = error.response.status;
            switch (status) {
                case 401:
                    console.log("警告！token过期！");
                    router.push({ name: 'login' });
                    break;
                case 403:
                    console.error('您没有权限访问此资源！');
                    break;
                case 404:
                    console.error('请求的资源不存在！');
                    break;
                case 500:
                    console.error('服务器开小差了，请稍后再试！');
                    break;
                default:
                    console.error(`请求错误，状态码：${status}`);
            }
        }
        //2.请求超时
        if (error.code === 'ECONNABORTED') {
            console.error('请求超时，请稍后重试！');
        } else if (!error.response) {
            console.error('网络未连接，请检查网络设置！');
        }

        //3.链接重置
        if (error.code === 'ERR_CONNECTION_RESET') {
            console.error('服务器已断开，请稍后重试！');
        } else if (!error.response) {
            console.error('网络未连接，请检查网络设置！');
        }
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
