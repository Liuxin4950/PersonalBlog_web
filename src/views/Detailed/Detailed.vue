<template>
    <banner></banner>
    <main class="content">
        <CurrentPath />
        <div class="main">
            <!-- 文章列表 -->
            <el-card class="home-left" shadow="hover">
                <div @click="reloadPage" class="cw" v-if="article.value === null">
                    <img src="../../assets/image/work/network.png" alt="">
                    <h3>网络错误！为返回数据。</h3>
                    <h3>点击重试。</h3>
                </div>
                <div v-else>
                    <div v-if="loading" class="loading">加载中...</div>
                    <div v-else>
                        <div>
                            <div class="f ac type">
                                <div class="f ac">
                                    <el-image v-if="getCategoryIcon(article.category_id)"
                                        :src="getCategoryIcon(article.category_id)" class="icon" alt="类别图标" />
                                    <h4>{{ article.category_name }}</h4>
                                </div>
                            </div>
                            <h2 class="title">{{ article.title }}</h2>
                            <div class="meta-info">
                                <p class="summary">{{ article.summary }}</p>
                                <div class="category">

                                    <div class="f ac">
                                        <img class="header-avatar" :src="author.image_url" alt="无">
                                        <div>作者: {{ author.username }}</div>
                                    </div>
                                    <span>{{ formatDate(article.created_at) }}</span>
                                </div>
                            </div>
                        </div>
                        <el-image :src="article.image_url" class="article-image" fit="cover" alt="文章封面"
                            style="border-radius: 6px; margin-top: 15px; max-height: 500px; width: 100%;" />
                        <div class="text-content" id="markdown" v-html="articleContent"></div>
                    </div>
                </div>
                <!-- 加载状态或文章详情 -->

            </el-card>
            <div class="home-right">
                <SearchArticles></SearchArticles>

                <PopularArticles :articles="popularList" header-title="热门文章"></PopularArticles>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { marked } from 'marked';
import banner from '@/components/common/banner.vue';
import CurrentPath from '@/components/common/CurrentPath.vue';
import { GetUser } from '@/services/user';
import { getArticleDetail, getPopularArticle } from '@/services/postService';
import jsIcon from '@/assets/image/icon/js.png';
import shIcon from '@/assets/image/icon/sh.png';
import fxIcon from '@/assets/image/icon/fx.png';

// 工具函数
const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
        case 1: return jsIcon;
        case 2: return shIcon;
        case 3: return fxIcon;
        default: return null;
    }
};

// 变量和状态
const route = useRoute();
const article = ref({});
const articleContent = ref('');
const loading = ref(true);
const author = ref({});
const popularList = ref([]);

// 格式化日期
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 数据获取函数
const fetchArticleDetail = async (id) => {
    loading.value = true;
    try {
        // const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
        const response = await getArticleDetail(id);

        if (response.code == 200) {
            article.value = response.data;


            articleContent.value = marked(article.value.content);

            const userResponse = await GetUser(article.value.author_id);
            author.value = userResponse.data;
        }
    } catch (error) {
        console.error('请求文章详情失败:', error);
    } finally {
        loading.value = false;
    }
};

// 加载热门文章
const fetchPopularArticles = async () => {
    try {
        const response = await getPopularArticle();
        popularList.value = response.data;
    } catch (error) {
        console.error('获取热门文章失败:', error);
    }
};

// 初始化数据
onMounted(() => {
    fetchArticleDetail(route.params.id);
    fetchPopularArticles();
});

// 监听路由变化
watch(
    () => route.params.id,
    (newId) => {
        fetchArticleDetail(newId);
    }
);

const reloadPage = () => {
    location.reload();//刷新页面
}

</script>

<style lang="scss" scoped>
.content {
    max-width: 1340px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
}

.main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.el-card {
    margin-bottom: 2em;
}

/* 左边窗口 */
.home-left {
    width: 75%;
    display: flex;
    flex-direction: column;
    font-family: "dd";

    .cw {
        width: 100%;
        height: 100%;
        text-align: center;

        img {
            width: 50%;
        }
    }
}

.home-right {
    width: 25%;
}

.type {
    div {
        background-color: rgba(41, 157, 186, 0.382);
        padding: 0.2em 0.5em;
    }

    .icon {
        width: 30px;
        height: 30px;
        padding: 0.1em;
        object-fit: cover;
        background-color: rgba(255, 255, 255, 0.726);
    }
}

.title {
    margin-top: 0.5em;
    font-size: 2.5em;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.meta-info {
    margin-bottom: 15px;
}

.summary {
    font-size: 1.2em;
    color: #666;
    line-height: 1.6;
    margin: 1em 0;
}

.category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #888;
}

.header-avatar {
    width: 40px;
    height: 40px;
    background-color: #1A759F;
    border-radius: 50%;
    margin-right: .5em;
}

.text-content {
    width: 100%;
    padding: 20px;
    font-family: "Arial", sans-serif;
    font-size: 1em;
    color: #333;
    line-height: 1.8;
}

#markdown {
    max-width: 1300px;
}

/* 在加载状态中添加样式 */
.loading {
    text-align: center;
    font-size: 1.2em;
    color: #888;
    animation: fade-in 0.5s ease-in-out;
}

/* 添加淡入动画 */
@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@media screen and (max-width: 768px) {
    .main {
        flex-wrap: wrap;
    }

    .home-left {
        width: 100%;
    }

    .home-right {
        width: 100%;
    }
}
</style>
