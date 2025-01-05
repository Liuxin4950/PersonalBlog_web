<template>
  <div>
    <!-- 粒子特效 -->
    <ParticleBackground></ParticleBackground>

    <!-- 只有在非登录和注册页面显示Header -->
    <Header v-if="showHeader" />

    <!-- 所有路由页面显示的区域 -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '../components/common/Header.vue';

// 获取当前路由信息
const route = useRoute();

// 计算属性，根据当前路由决定是否显示Header
const showHeader = computed(() => {
  // 判断是否在登录或注册页面
  return route.path !== '/login' && route.path !== '/register';
});


</script>

<style scoped>
.content {
  width: 100%;
  height: 100vh;
  margin: 0 auto;
}
</style>
