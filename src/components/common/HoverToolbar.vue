<template>
    <div class="floating-toolbar">
        <!-- 只有当 user 和 user.id 存在时，才渲染 router-link -->
        <router-link v-if="user && user.id" :to="`/newArticle/${user.id}`">
            <div class="button" @click="createPost">
                <img class="fit" src="../../assets/image/icon/tianjia.png" alt="" />
            </div>
        </router-link>

        <div class="button" @click="searchPost">
            <img class="fit" src="../../assets/image/icon/搜索.png" alt="" />
        </div>
        <div class="button" @click="scrollToTop">
            <img class="fit" src="../../assets/image/icon/返回顶部.png" alt="" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/store/userStore';

let user = ref(null); // 默认值为 null

// 在组件加载时获取本地存储的用户信息
onMounted(() => {
    const userStore = useUserStore();

    if (userStore) {
        user.value = userStore.userInfo; // 设置为响应式数据
    }
});

const createPost = () => {
    if (user.value) {
        console.log('获取到的用户信息:', user.value);
        console.log('用户 ID:', user.value.id); // 假设 user 对象中有 id 字段
    } else {
        console.log('没有找到用户信息，请先登录');
    }

    // 发布文章逻辑
    console.log("发布文章");
};

const searchPost = () => {
    // 搜索文章逻辑
    console.log("搜索文章");
};

const scrollToTop = () => {
    // 回到顶部逻辑
    console.log("回到顶部");
    window.scrollTo(0, 0);
};
</script>

<style scoped>
.floating-toolbar {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-radius: 8px;
    z-index: 1000;
}

.button {
    width: 60px;
    height: 60px;
    padding: 10px;
    font-size: 14px;
    color: #333;
    background-color: #fefefe;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s;
}

.button:hover {
    background-color: #e0e0e0;
}
</style>
