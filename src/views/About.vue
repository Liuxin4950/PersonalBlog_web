<template>
  <div class="box">
    <!-- 内容区 -->
    <main>
      <h1>我的发布</h1>

      <div class="main">
        <!-- 文章列表 -->
        <div class="home-left">
          <Artcles :articles="articleList" :isDel="true" />

        </div>
        <div class="home-right">
          <SearchArticles></SearchArticles>
        </div>
      </div>
    </main>

  </div>

</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getPostList } from '../services/postService';  // 引入文章服务模块
import Artcles from '@/components/card/Artcles.vue';
import { useUserStore } from '@/store/userStore';
const userStore = useUserStore();
const articleList = ref([]);


const getList = async (params) => {
  try {
    const postResponse = await getPostList();

    if (postResponse.code === 200) {
      console.log(postResponse.data);

      // 获取当前用户 ID
      const currentUserId = userStore.userInfo.id;

      // 筛选出 author_id 与当前用户 ID 相同的帖子
      const filteredPosts = postResponse.data.filter(
        (post) => post.author_id === currentUserId
      );

      // 将筛选结果赋值给 articleList
      articleList.value = filteredPosts;

    } else {
      console.error('获取文章列表失败:', postResponse.message);
    }
  } catch (error) {
    // 捕获请求错误并输出到控制台
    console.error('获取文章数据时发生错误:', error);
  }

};

onMounted(() => {
  getList()
})

</script>

<style scoped lang="scss">
.box {
  width: 1300px !important;
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
  width: 72.5%;
  display: flex;
  flex-direction: column;
}

.home-right {
  width: 25%;
}
</style>
