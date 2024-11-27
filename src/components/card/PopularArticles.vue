<template>
    <el-card>
        <template #header>{{ headerTitle }}</template>
        <div class="popular-content">

            <div class="popular-list">
                <router-link :to="`/article/${item.id}`" v-for="(item, index) in articles" :key="index">
                    <div class="popular-box">
                        <div class="popular-box-image">
                            <img class="fit" :src="item.image_url" alt="这是图片">
                        </div>
                        <div class="popular-box-text">
                            <h4>{{ item.title }}</h4>
                            <p>{{ formatDate(item.created_at) }}</p>
                        </div>
                    </div>
                </router-link>

            </div>
        </div>
    </el-card>
</template>

<script setup>

// 定义组件的 props，支持外部传入数据
const props = defineProps({
    articles: {
        type: Array,
        default: () => [],
        required: false, // 可以去掉 required 或者根据需求设为 true
    },
    headerTitle: {
        type: String,
        default: '热门文章',
        required: false, // 如果总是传递，可以移除 default 和设置 required: true
    },
});


// 格式化日期的辅助函数
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-CA');
}
</script>

<style scoped>
.popular-content {
    width: 100%;
    height: 100%;

    .popular-list {
        .popular-box:hover {
            background-color: var(--text-hover);
        }

        .popular-box {
            width: 100%;
            height: 70px;
            padding: 0.3em;
            display: flex;
            transition: .5s ease-in;
            border-radius: .5em;

            .popular-box-image {
                width: 28%;
                height: 100%;
                border: 1px solid #aaa;
                border-radius: .5em;
                overflow: hidden;
            }

            .popular-box-text {
                width: 72%;
                height: 100%;
                padding-left: 1em;

                h4 {
                    display: block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 0.5em;
                }
            }
        }
    }
}
</style>
