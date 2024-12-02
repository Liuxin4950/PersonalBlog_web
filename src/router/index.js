// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/login/Login.vue';
import Register from '../views/login/Register.vue';
import Home from '../views/Home.vue';
import Chat from '../views/Chat.vue';
import About from '../views/About.vue';
import Detailed from '../views/Detailed/Detailed.vue';
import huohuo from '../components/chat/huohuo.vue';
import nahida from '@/components/chat/nahida.vue';
import ollama from '@/components/chat/ollama.vue';
import newDetailed from '@/views/Detailed/newDetailed.vue';
import Info from '@/views/login/Info.vue';
const routes = [
  {
    path: '/',
    redirect: '/home', // 根路径重定向到 /home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { breadcrumb: 'Login' }, // 登录的面包屑
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { breadcrumb: 'Register' },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { breadcrumb: 'Home' }, // 主页的面包屑
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { breadcrumb: 'Chat' },
  },
  {
    path: '/chat/huohuo',
    name: 'Huohuo',
    component: huohuo,
    meta: { breadcrumb: 'Huohuo' },
  },
  {
    path: '/chat/nahida',
    name: 'Nahida',
    component: nahida,
    meta: { breadcrumb: 'Nahida' },
  },
  {
    path: '/chat/ollama',
    name: 'ollama',
    component: ollama,
    meta: { breadcrumb: 'Ollama' },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { breadcrumb: 'About' },
  },
  {
    path: '/article/:id',
    name: 'article',
    component: Detailed,
    meta: { breadcrumb: 'Article' },
  },
  {
    path: '/newArticle/:id',
    name: 'newArticle',
    component: newDetailed,
    meta: { breadcrumb: 'NewArticle' }
  },
  {
    path: '/info/:id',
    name: 'info',
    component: Info,
    meta: { breadcrumb: 'Info' }
  }

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  // 每次路由变化时，滚动到页面顶部
  window.scrollTo(0, 0);
  next();
});

export default router;
