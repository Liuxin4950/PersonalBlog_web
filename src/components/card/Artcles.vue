<template>
    <div class="container">
        <el-card v-for="(item, index) in articles" :key="index">
            <router-link :to="`/article/${item.id}`">
                <div class="home-list">
                    <div class="list-left">
                        <img class="fit" :src="item.image_url" alt="">
                    </div>
                    <div class="list-right">
                        <div>
                            <div class="f ac fb">
                                <div class="f ac">
                                    <img v-if="getCategoryIcon(item.category_id)" class="icon"
                                        :src="getCategoryIcon(item.category_id)" alt="">
                                    <h4 class="type">{{ item.category_name }}</h4>
                                </div>
                                <div v-if="isDel" class="del" @click="confirmDelete(item.id, index)">
                                    删除
                                </div>
                            </div>
                            <h2 class="title">{{ item.title }}</h2>
                            <p>{{ item.summary }}</p>
                        </div>
                        <div class="list-right-bot">
                            <div class="line"></div>
                            <div class="bot f fb ac w">
                                <div class="f">{{ new Date(item.created_at).toLocaleDateString('en-CA') }}</div>
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
</template>

<script setup>
import Swal from 'sweetalert2';
import { deleteArticle } from "@/services/postService";

// 接收父组件传递的 `articles` 和 `isDel`
const props = defineProps({
    articles: {
        type: Array,
        default: () => [],
    },
    isDel: {
        type: Boolean,
        default: false, // 默认不显示删除按钮
    },
});

// 方法：获取不同类别的图标
import jsIcon from "@/assets/image/icon/js.png";
import shIcon from "@/assets/image/icon/sh.png";
import fxIcon from "@/assets/image/icon/fx.png";

function getCategoryIcon(categoryId) {
    if (categoryId === 1) return jsIcon;
    if (categoryId === 2) return shIcon;
    if (categoryId === 3) return fxIcon;
    return null;
}

// 删除文章逻辑
const confirmDelete = async (articleId, index) => {
    // 弹窗确认
    const result = await Swal.fire({
        title: '确认删除这篇文章？',
        text: "删除后无法恢复！",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
    });

    if (result.isConfirmed) {
        try {
            // 调用删除接口
            const res = await deleteArticle(articleId);

            if (res.code === 200) {
                Swal.fire('删除成功', '文章已被删除', 'success');

                // 更新本地文章列表
                props.articles.splice(index, 1);
            } else {
                Swal.fire('删除失败', res.message || '服务器错误', 'error');
            }
        } catch (error) {
            console.error('删除文章失败:', error);
            Swal.fire('删除失败', '网络错误或服务器异常', 'error');
        }
    }
};
</script>



<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
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

    .del {
        color: red;
    }

    .del:hover {
        color: rgb(141, 25, 25);
    }

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
</style>