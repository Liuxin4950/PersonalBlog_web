import { get, post, put, del } from './api';

// 获取文章列表
export const getPostList = async (params = {}) => {
    try {
        const response = await get('/posts', params);  // 通过 GET 请求获取文章列表
        return response;
    } catch (error) {
        console.error('获取文章列表失败', error);
        throw error;
    }
};

// 获取文章详情
export const getArticleDetail = async (id) => {
    try {
        const response = await get(`/posts/${id}`);  // 获取特定 ID 的文章详情
        return response;
    } catch (error) {
        console.error('获取文章详情失败', error);
        throw error;
    }
};

// 创建文章
export const createArticle = async (data) => {
    try {
        const response = await post('/posts', data);  // 通过 POST 请求创建文章
        return response;
    } catch (error) {
        console.error('创建文章失败', error);
        throw error;
    }
};

// 编辑文章
export const updateArticle = async (id, data) => {
    try {
        const response = await put(`/posts/${id}`, data);  // 编辑文章
        return response;
    } catch (error) {
        console.error('编辑文章失败', error);
        throw error;
    }
};

// 删除文章
export const deleteArticle = async (id) => {
    try {
        const response = await del(`/posts/${id}`);  // 删除文章
        return response;
    } catch (error) {
        console.error('删除文章失败', error);
        throw error;
    }
};
//获取热门文章
export const getPopularArticle = async () => {
    try {
        const response = await get(`/posts/popular`);  // 热门文章
        return response;
    } catch (error) {
        console.error('热门文章获取失败', error);
        throw error;
    }
};

//搜索文章
export const getSearchArticles = async (text) => {
    try {
        const response = await get('/posts/search?searchTerm=' + text)
        return response

    } catch (error) {
        console.error('搜索文章失败！', error);
        throw error;
    }
}

