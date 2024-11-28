import { get, post, put, del } from './api';
// 获取用户信息
export const GetUser = async (id) => {
    try {
        const response = await get(`/users/${id}`);  // 通过 GET 请求获取用户信息
        return response;
    } catch (error) {
        console.error('获取用户信息失败', error);
        throw error;
    }
};
// 登录
export const Login = async (data) => {
    try {
        const response = await post(`/users`, data);  // 通过 GET 请求获取用户信息
        return response;
    } catch (error) {
        console.error('登录失败', error);
        throw error;
    }
};
//修改用户信息
export const putUser = async (data) => {
    try {
        const response = await put(`/users`, data);  // 通过 GET 请求获取用户信息
        return response;
    } catch (error) {
        console.error('修改失败', error);
        throw error;
    }
};
