<template>
  <div class="app">
    <!-- 这里是加载动画显示逻辑 -->
    <Loading class="loading" v-if="isLoading" />
    <Index />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Index from './views/Index.vue';
import { useRouter } from 'vue-router';
const router = useRouter()

watch(() => router.currentRoute.value, () => {
  isLoading.value = true; // 显示加载动画
  setTimeout(() => {
    isLoading.value = false; // 隐藏加载动画
  }, 1000); // 动画持续时间
});

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1000);
});
</script>

<style scoped>
.loading {
  opacity: 1;
  animation: op 1s ease-out forwards;
  background-color: rgba(255, 255, 255, 1);
}

@keyframes op {
  0% {
    opacity: 1;
    background-color: rgba(255, 255, 255, 1);
  }

  70% {
    opacity: 1;
    background-color: rgba(255, 255, 255, 1);
  }

  100% {
    opacity: 0;
    background-color: rgba(255, 255, 255, 0);
  }
}
</style>
