<template>
    <HoverToolbar class="hoverToolbar" />
    <banner></banner>
    <div class="content">
        <div class="f fd ac p1">
            <p class="flag">偶尔的停顿和修整，对于人生是非常必要的。</p>
            <div class="arrow"></div> <!-- 下方箭头 -->
        </div>
        <!-- 内容区 -->
        <main>
            <CurrentPath></CurrentPath>

            <div class="main">
                <!-- 文章列表 -->
                <div class="home-left">
                    <Artcles :articles="articleList"></Artcles>

                </div>
                <div class="home-right">
                    <MyInfo></MyInfo>
                    <SearchArticles></SearchArticles>
                    <PopularArticles :articles="popularList"></PopularArticles>
                </div>
            </div>


        </main>



    </div>
    <!-- <huohuo id="huohuo"></huohuo> -->
    <nahida class="user-model" />
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getPostList, getPopularArticle } from '../services/postService';  // 引入文章服务模块
import nahida from '@/components/chat/nahida.vue';
// 导入图片资源
import SearchArticles from '@/components/card/SearchArticles.vue';
import Artcles from '@/components/card/Artcles.vue';

const articleList = ref([]);

const popularList = ref();

const getList = async (params) => {
    try {
        // 并行请求两个接口，减少等待时间
        const [postResponse, popularResponse] = await Promise.all([
            getPostList(params),      // 传入 params 以防未来需要参数
            getPopularArticle(),
        ]);

        // 检查请求结果
        if (postResponse.code === 200) {
            articleList.value = postResponse.data;
        } else {
            console.error('获取文章列表失败:', postResponse.message);
        }

        if (popularResponse.code === 200) {
            popularList.value = popularResponse.data;

        } else {
            console.error('获取热门文章列表失败:', popularResponse.message);
        }

    } catch (error) {
        // 捕获请求错误并输出到控制台
        console.error('获取热门文章数据时发生错误:', error);
    }
};

onMounted(() => {
    getList()
})

</script>

<style lang="scss" scoped>
.user-model {
    width: 400px;
    height: 600px;
    z-index: 10;
    position: fixed;
    left: 0;
    bottom: -200px;

}


.flag {
    font-family: "dd"
}

/* 箭头 */
.arrow {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #2599e6;
    /* 箭头的颜色 */
    margin: 10px auto;
    animation: bounce 1s infinite;
    /* 箭头动画 */
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
        /* 初始和结束位置 */
    }

    50% {
        transform: translateY(5px);
        /* 向下移动的距离 */
    }
}
</style>