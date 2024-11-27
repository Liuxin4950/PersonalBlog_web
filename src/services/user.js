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