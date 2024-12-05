import { get, post, put, del } from './api';

export const GenerateAudioUrl = async (data) => {
    try {
        const response = await post('/tts', data);  // 通过 POST 请求创建文章
        return response;
    } catch (error) {
        console.error('创建文章失败', error);
        throw error;
    }
};
