<template>
    <div class="breadcrumb">
        <span v-for="(breadcrumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
            <router-link v-if="breadcrumb.path" :to="breadcrumb.path" class="breadcrumb-link">
                {{ breadcrumb.label }}
            </router-link>
            <span v-else class="breadcrumb-label">{{ breadcrumb.label }}</span>
            <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator"> / </span>
        </span>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const breadcrumbs = computed(() => {
    const matchedRoutes = route.matched;
    let fullPath = '';
    const breadcrumbList = [];

    // 添加 Home 面包屑条件简化
    if (route.name === 'article') {
        breadcrumbList.push({ label: 'Home', path: '/home' });
        breadcrumbList.push({
            label: `Article ${route.params.id}`,
            path: `/article/${route.params.id}`,
        });
    } else {
        matchedRoutes.forEach((routeRecord) => {
            const breadcrumbLabel = routeRecord.meta.breadcrumb || routeRecord.name;

            // 处理文章页标题替换
            const label = routeRecord.name === 'article' ? `Article ${route.params.id}` : breadcrumbLabel;

            fullPath += routeRecord.path;
            breadcrumbList.push({ label, path: fullPath });
        });
    }

    return breadcrumbList;
});
</script>

<style scoped>
.breadcrumb {
    font-size: 1rem;
    /* 调整字体大小 */
    padding: 0.5em 0;
    background: linear-gradient(90deg, #FF6B6B, #FFD93D);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.breadcrumb-item {
    display: inline;
}

.breadcrumb-link {
    font-size: 1.2em;
    /* 适度调整字体大小 */
    color: inherit;
    text-decoration: none;
}

.breadcrumb-separator {
    margin: 0 0.3em;
    color: #FFD93D;
    /* 使分隔符更容易辨识 */
}
</style>
