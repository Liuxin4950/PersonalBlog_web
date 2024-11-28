import { createApp } from 'vue';
import './style.css';
import './assets/css/index.css';
import '@/assets/css/font.css'
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' //引入持久化插件
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import Swal from 'sweetalert2'//用来做提示
import Particles from '@tsparticles/vue3'//粒子特效
import { loadFull } from 'tsparticles'
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate) //将插件添加到 pinia 实例上
app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.use(Particles, {
  init: async (engine) => {
    await loadFull(engine) // you can load the full tsParticles library from "tsparticles" if you need it
    // loadSlim 轻量级的
    // await loadSlim(engine) // or you can load the slim version from "tsparticles-slim" if don't need Shapes or Animations
  }
})

// 设置全局导航守卫(每次导航发生前执行)
router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user');

  if (!user && to.path !== '/login' && to.path !== '/register') {
    // 显示提示信息
    Swal.fire({
      icon: 'warning',
      title: '需要登录',
      text: '请先登录以访问此页面',
    }).then(() => {
      // 提示框关闭后，重定向到登录页面
      next('/login');
    });
  } else {
    // 如果已登录或是访问登录/注册页面，则放行
    next();
  }
});

app.mount('#app');
