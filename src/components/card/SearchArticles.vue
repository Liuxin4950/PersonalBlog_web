<template>
    <el-card class="search-article-card">
        <div class="search-article">
            <!-- 搜索框 -->
            <div class="search-bar">
                <input v-model="searchTerm" @keyup.enter="search" type="text" placeholder="请输入搜索关键词"
                    class="search-input" />
                <button @click="search" class="search-button">搜索</button>
            </div>

            <!-- 搜索结果显示 -->
            <div v-if="articles && articles.length > 0" class="search-results">
                <h3>搜索结果：</h3>
                <ul class="articles-list">
                    <li v-for="article in articles" :key="article.id" class="article-item">
                        <!-- 文章图片 -->
                        <div class="article-image-container">
                            <img v-if="article.image_url" :src="article.image_url" alt="文章图片" class="article-image" />
                        </div>

                        <!-- 文章内容 -->
                        <div class="article-content">
                            <h4 class="article-title">{{ article.title }}</h4>
                            <p class="article-summary">{{ article.summary }}</p>
                            <!-- 点击文章跳转到详细页面 -->
                            <router-link :to="{ name: 'article', params: { id: article.id } }" class="detail-link">
                                查看详情
                            </router-link>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- 没有结果时的提示 -->
            <div v-else-if="searched && (!articles || articles.length === 0)" class="no-results">
                <p>没有找到相关的文章。</p>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { ref } from 'vue';
import { getSearchArticles } from '@/services/postService';

// 用于存储搜索关键词
const searchTerm = ref('');
// 用于存储搜索结果
const articles = ref([]);
// 用于判断是否进行过搜索
const searched = ref(false);

// 执行搜索
const search = async () => {
    if (!searchTerm.value.trim()) {
        // 如果搜索词为空，则不执行搜索
        return;
    }

    try {
        // 调用搜索文章的 API
        const result = await getSearchArticles(searchTerm.value);
        console.log(result);

        // 如果 API 调用成功但返回的数据为空，也要处理
        articles.value = result.data || [];
        searched.value = true;
    } catch (error) {
        console.error('搜索文章时出错：', error);
        // 搜索失败时，将 articles 设置为空数组
        articles.value = [];
    }
};
</script>

<style scoped>
/* 主容器 */
.search-article-card {
    max-width: 1000px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* 搜索框样式 */
.search-bar {
    width: 100%;
    display: flex;
    justify-content: center;
}

.search-input {
    width: 100%;
    max-width: 500px;
    padding: .5em;
    border-radius: .4em;
    border: 1px solid #ccc;
    margin-right: 10px;
    box-sizing: border-box;
}

.search-button {
    min-width: 50px;
    padding: 1em .5em;
    border-radius: .4em;
    background-color: #42b983;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

.search-button:hover {
    background-color: #36a174;
}

/* 搜索结果样式 */
/* 搜索结果样式 */
.search-results {
    margin-top: 20px;
}

.articles-list {
    width: 100%;
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.article-item {
    display: flex;
    /* 使用 Flex 布局 */
    align-items: center;
    /* 垂直居中 */
    padding: 15px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
}

/* 文章图片样式 */
.article-image {
    width: 120px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 15px;
    /* 右边留空，用于与内容分隔 */
}

/* 文章内容样式 */
/* 父容器的布局 */
.article-content {
    flex: 1;
    /* 占据剩余空间 */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    /* 允许内容缩小，防止撑开布局 */
}


/* 标题样式 */
.article-title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    /* 显示的行数 */
    -webkit-box-orient: vertical;
    flex-grow: 1;
    /* 允许标题区域扩展 */
    min-width: 0;
    /* 允许内容缩小，不限制最小宽度 */
    max-width: 100%;
    /* 确保标题不会超出容器 */
}



/* 摘要样式 */
.article-summary {
    font-size: 0.9em;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* 显示的行数 */
    -webkit-box-orient: vertical;
    line-height: 1.5em;
    max-height: 3em;
    /* 1.5em * 显示的行数 */
}

/* 查看详情链接样式 */
.detail-link {
    text-align: right;
    font-size: 0.9em;
    color: #42b983;
    text-decoration: none;
    transition: color 0.3s;
}

.detail-link:hover {
    color: #36a174;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .article-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .article-image {
        margin-bottom: 10px;
        width: 100%;
        max-height: 150px;
    }
}
</style>