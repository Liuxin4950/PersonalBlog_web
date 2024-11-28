import { get, post, put, del } from './api';

// 封装上传文件的请求
export const uploadFile = async (formData) => {
    try {
        const response = await post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response;  // 返回响应数据
    } catch (error) {
        console.error('文件上传失败', error);
        throw error;  // 抛出错误以便调用者处理
    }
};
