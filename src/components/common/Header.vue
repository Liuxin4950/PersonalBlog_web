<template>
  <div class="navbar-container">
    <!-- 导航栏内容 -->
    <nav :class="['navbar', { 'navbar-scrolled': isScrolled }]" ref="navbar">
      <ul class="navbar-list">
        <li class="navbar-item">
          <img class="icon" src="../../assets/image/icon/home.png" alt="Home">
          <router-link to="/home" class="navbar-link" exact-active-class="active-link">Home</router-link>
        </li>

        <li class="navbar-item">
          <img class="icon" src="../../assets/image/icon/聊天.png" alt="Chat">
          <router-link to="/chat" class="navbar-link" exact-active-class="active-link">Chat</router-link>
        </li>

        <li class="navbar-item">
          <img class="icon" src="../../assets/image/icon/关于我们.png" alt="About">
          <router-link to="/about" class="navbar-link" exact-active-class="active-link">About</router-link>
        </li>
        <!-- <li class="navbar-item">
          <img class="icon" src="../../assets/image/icon/关于我们.png" alt="About">
          <router-link to="/info" class="navbar-link" exact-active-class="active-link">Info</router-link>
        </li> -->

        <li class="navbar-item navbar-user-container" @contextmenu.prevent="showMenu">
          <span class="navbar-user">
            {{ currentUser ? currentUser : 'Login In' }}
          </span>
          <img class="header-avatar" :src="currentUserImage" alt="无">
          <div v-if="menuVisible" class="context-menu" ref="contextMenu">
            <ul>
              <li @click="viewProfile">个人信息</li>
              <li @click="logout">退出登录</li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { onMounted, computed, ref, onBeforeUnmount } from 'vue';
import anime from 'animejs/lib/anime.es.js';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useUserStore } from '@/store/userStore';

// 获取路由实例
const router = useRouter();


const user = useUserStore()
const userStore = ref(user.userInfo)
// console.log(userStore.value);


const currentUser = computed(() => userStore.value ? userStore.value.username : null);

const currentUserImage = computed(() => userStore.value ? userStore.value.image_url : null);

const menuVisible = ref(false);
const isScrolled = ref(false);
const navbar = ref(null);
const contextMenu = ref(null);

// 页面挂载时初始化粒子背景
onMounted(() => {
  initScrollListener();

  // 初次加载动画
  anime({
    targets: navbar.value,
    opacity: [0, 1],
    translateY: [-30, 0],
    easing: 'easeOutQuad',
    duration: 800
  });
});

// 页面卸载时移除滚动监听
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

// 初始化滚动监听器
function initScrollListener() {
  window.addEventListener('scroll', handleScroll);
}

// 滚动事件处理，切换导航栏样式
const handleScroll = () => {
  isScrolled.value = window.scrollY > 300;
  if (isScrolled.value) {
    anime({
      targets: navbar.value,
      backgroundColor: ['rgba(255, 255, 255, 0)', 'rgba(135, 206, 235, 0.3)'],
      easing: 'easeInOutQuad',
      duration: 500
    });
  }
};

// 右键显示菜单，淡入效果
const showMenu = (event) => {
  event.preventDefault();
  menuVisible.value = true;

  anime({
    targets: contextMenu.value,
    opacity: [0, 1],
    translateY: [-10, 0],
    easing: 'easeOutQuad',
    duration: 300
  });
};

// 隐藏菜单
const hideMenu = () => {
  if (menuVisible.value) {
    anime({
      targets: contextMenu.value,
      opacity: [1, 0],
      translateY: [0, -10],
      easing: 'easeInQuad',
      duration: 300,
      complete: () => (menuVisible.value = false)
    });
  }
};
// 个人信息
const viewProfile = () => {
  console.log("查询用户id:" + userStore.value.id);
  if (userStore.value.id) {
    // 使用命名路由跳转
    router.push({ name: 'info', params: { id: userStore.value.id } });
    console.log('查看个人信息');
  } else {
    console.error('用户 ID 未定义，无法跳转');
  }
};



// 退出登录
const logout = () => {
  // 清除本地存储中的用户信息
  localStorage.removeItem('user');
  localStorage.removeItem('token'); // 如果有 token 存储的话，记得清除

  // 弹出退出成功提示
  Swal.fire({
    icon: 'success',
    title: '退出成功',
    text: '你已经成功退出登录，请重新登录。',
  });

  // 导航到登录页
  router.push('/login');

  // 打印退出信息以便调试
  console.log('已退出登录');
};

document.addEventListener('click', hideMenu);
</script>

<style lang="scss" scoped>
.navbar-container {
  position: relative;
  width: 100%;
  height: 70px;
  overflow: hidden;
  background-color: rgba(135, 206, 235, 0.3);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
  backdrop-filter: blur(15px);
}

.navbar-scrolled {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.navbar-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1330px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.navbar-item {
  display: flex;
  align-items: center;
  padding: 0 15px;
  position: relative;
}

.navbar-link {
  font-size: 1.3em;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  font-weight: bold;
}

.navbar-link:hover {
  color: #1A759F;

  transform: scale(1.1);
}

.navbar-link.router-link-active {
  font-weight: bold;
  background: linear-gradient(to right, #ff66cc, #4f9ad8, #ffd700, #32cd32);
  -webkit-background-clip: text;
  color: transparent;
  background-size: 400% 100%;
  animation: flowAnimation 3s linear infinite;
}

// 流动
@keyframes flowAnimation {
  0% {
    background-position: 0% 0%;
  }

  50% {
    background-position: 100% 0%;
  }

  100% {
    background-position: 0% 0%;
  }
}

.navbar-user-container {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.navbar-user {
  font-size: 1.2em;
  cursor: pointer;
  padding: 20px;
  transition: color 0.3s ease;
  font-weight: bold;
  background: linear-gradient(to right, #ff6c9d, #07999e, #b17b06, #20af20);
  -webkit-background-clip: text;
  color: transparent;
  background-size: 400% 100%;
  animation: flowAnimation 3s linear infinite;
}

.header-avatar {
  width: 40px;
  height: 40px;
  background-color: #1A759F;
  border-radius: 50%;
  margin-left: 10px;
}

.context-menu {
  position: absolute;
  top: 100%;
  right: 0;
  border-radius: 10px;
  padding: 10px;
  opacity: 0; // 初始设置为透明
  display: flex;
  flex-direction: column;
}

.context-menu ul {
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: rgba(135, 206, 235, 0.3);


}

.context-menu li {
  padding: .5em 1em;
  cursor: pointer;
  font-size: 1.1em;
  transition: background 0.3s ease;
  color: var(--text2-color);
}

.context-menu li:hover {
  color: var(--text-color);

}

@media screen and (max-width: 1300px) {}
</style>
