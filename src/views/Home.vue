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
                    <el-card v-for="(item, index) in articleList" :key="index">
                        <router-link :to="`/article/${item.id}`">
                            <div class="home-list">
                                <div class="list-left">
                                    <img class="fit" :src="item.image_url" alt="">
                                </div>
                                <div class="list-right">
                                    <div>
                                        <div class="f ac">
                                            <!-- 动态选择图标 -->
                                            <img v-if="getCategoryIcon(item.category_id)" class="icon"
                                                :src="getCategoryIcon(item.category_id)" alt="">
                                            <h4 class="type">{{ item.category_name }}</h4>
                                        </div>
                                        <h2 class="title">{{ item.title }}</h2>
                                        <p>{{ item.summary }}</p>
                                    </div>

                                    <div class="list-right-bot">
                                        <div class="line"></div>
                                        <div class="bot f fb ac w">
                                            <div class="f">{{ new Date(item.created_at).toLocaleDateString('en-CA') }}
                                            </div>
                                            <div class="f ac">
                                                <div class="f ac">
                                                    <img class="icon" src="../assets/image/icon/guankan.png" alt="">
                                                    {{ item.view_count }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </router-link>

                    </el-card>
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
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getPostList, getPopularArticle } from '../services/postService';  // 引入文章服务模块
import huohuo from '@/components/chat/huohuo.vue';
// 导入图片资源
import jsIcon from "@/assets/image/icon/js.png";
import shIcon from "@/assets/image/icon/sh.png";
import fxIcon from "@/assets/image/icon/fx.png";
import SearchArticles from '@/components/card/SearchArticles.vue';
// 计算函数来动态返回不同类别的图标路径
function getCategoryIcon(categoryId) {
    if (categoryId === 1) return jsIcon;
    if (categoryId === 2) return shIcon;
    if (categoryId === 3) return fxIcon;
    return null; // 无匹配的情况下不显示图标
}

const articleList = ref();
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

// 你可以在模板或组件的生命周期函数中调用 getList()


onMounted(() => {
    getList()
})

</script>

<style lang="scss" scoped>
#huohuo {
    width: 250px;
    height: 400px;
    position: fixed;
    bottom: 0;
    left: 0;
}

.flag {
    font-family: "sh" !important
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

// 页面内容

.content {
    max-width: 1300px;
    height: calc(100vh - 70px);
    margin: 0 auto;
}


main {
    width: 100%;
    position: relative;


}

.main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

}

.el-card {
    margin-bottom: 2em;
}

/* 左边窗口 */
.home-left {
    width: 68%;
    display: flex;
    flex-direction: column;
}

/* 每个卡片内部排序 */
.home-list {
    display: flex;
    justify-content: space-between;
}

.home-list .list-left {
    width: 44%;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;

}

.home-list:hover .fit {
    transform: scale(1.05);

}

.home-list .list-right {
    width: 54%;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h4 {
        font-size: .9em;
        color: var(--text3-color);
        font-weight: 400;
        font-family: "dd";

        text-shadow: 0 0 1px rgba(255, 0, 0, 0.2);
    }

    .title {
        color: #37475c;
        line-height: 24px;
        text-shadow: #d0cdcd 0.031em 0.031em 0.051em;
        font-size: 1.2em;
        font-weight: inherit;
        font-family: "dd";
        margin-top: 10px;
        /* 允许多行显示 */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 1;
        /* 添加标准属性 */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        color: var(--text1-color);
    }

    .title:hover {
        color: var(--text3-color);
    }

    p {
        color: #6c757a;
        display: inline-block;
        margin-top: 10px;
        display: inline-block;
        width: 100%;
        /* 允许多行显示 */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        /* 添加标准属性 */
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }

}

// 下半部分
// .list-right-bot {}

.bot {
    .f {
        color: #777 !important;
        font-family: "dd";
        font-size: .8em;
    }
}

.bot>div {
    margin-top: 5px;


}

.bot .icon {
    transform: translateY(-3px);
}



.home-right {
    width: 30%;
}

.banner-href-box {
    margin-top: 20px;
    width: 100%;
    height: 100px;
    transform: translateX(20px);
    display: flex;
    justify-content: center;
    align-items: center;

}

.banner-href {
    margin-right: 2em;
    padding: 10px;
    width: 60px;
    min-width: 60px;
    height: 60px;
    border-radius: 10px;
    background-color: #62dbeeb1;
    transition: .5s;
}

.banner-href:hover {
    background-color: #fff;
}













.hoverToolbar {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 1000;
}

@media screen and (max-width: 1000px) {
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