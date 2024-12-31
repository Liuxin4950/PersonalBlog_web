<template>
    <div class="login-body">
        <!-- 背景动画 -->
        <div class="background-gradient"></div>

        <!-- 登录表单容器 -->
        <div class="container">
            <div class="login-container" ref="loginContainer">
                <img src="@/assets/image/banner/ht.jpg" class="fit" alt="">
            </div>

            <div class="login-container" ref="loginContainer">
                <!-- 登录标题 -->
                <h2>{{ isLogin ? '登录' : '注册' }}</h2>

                <!-- 登录/注册表单 -->
                <form @submit.prevent="handleSubmit">
                    <!-- 用户名 -->
                    <div class="form-group">
                        <label for="username">用户名</label>
                        <input type="text" id="username" placeholder="请输入用户名" v-model="username" required />
                    </div>

                    <!-- 密码 -->
                    <div class="form-group">
                        <label for="password">密码</label>
                        <input type="password" id="password" placeholder="请输入密码" v-model="password" required />
                    </div>

                    <!-- 注册时特有的输入框 -->
                    <div v-show="!isLogin">
                        <div class="form-group">
                            <label for="email">邮箱</label>
                            <input type="email" id="email" placeholder="请输入邮箱" v-model="email" />
                        </div>
                        <div class="form-group">
                            <label for="phone">电话</label>
                            <input type="tel" id="phone" placeholder="请输入电话号码" v-model="phone" />
                        </div>
                    </div>

                    <!-- 提交按钮 -->
                    <button type="submit">{{ isLogin ? '登录' : '注册' }}</button>
                </form>

                <!-- 切换登录和注册 -->
                <p class="toggle-link">
                    {{ isLogin ? '还没有账号？' : '已有账号？' }}
                    <a @click="toggleAuth">{{ isLogin ? '注册' : '登录' }}</a>
                </p>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUserStore } from '@/store/userStore';
import anime from 'animejs/lib/anime.es.js';
// 统一管理仓库

const isLogin = ref(true);
const username = ref('');
const password = ref('');
const email = ref('');
const phone = ref('');
const router = useRouter();
const userStore = useUserStore();

const toggleAuth = () => {
    isLogin.value = !isLogin.value;
    username.value = '';
    password.value = '';
    email.value = '';
    phone.value = '';
    animateForm();
};
//动画效果
// 动画效果：控制登录/注册容器宽度变化
const animateForm = () => {
    // 切换容器宽度（400px -> 500px）
    anime({
        targets: '.login-container',
        width: isLogin.value ? '400px' : '500px',
        opacity: [0, 1],
        easing: 'easeOutElastic',
        duration: 800,
    });

    // 输入框和按钮动画
    anime({
        targets: '.form-group',
        opacity: [0, 1],
        translateZ: [-10, 0],
        easing: 'easeOutElastic',
        delay: anime.stagger(100),
        duration: 400,
    });

    anime({
        targets: 'button',
        opacity: [0, 1],
        scale: [0.7, 1],
        easing: 'easeOutElastic',
        duration: 800,
    });
};


const handleSubmit = async () => {
    console.log("触发登录请求成功");

    try {
        const endpoint = isLogin.value
            ? 'http://47.108.63.126:8080/api/users/login'
            : 'http://47.108.63.126:8080/api/users/register';

        const payload = {
            username: username.value,
            password: password.value,
        };

        if (!isLogin.value) {
            payload.email = email.value;
            payload.phone = phone.value;
        }
        console.log("发送请求信息:");
        //取得用户信息
        const response = await axios.post(endpoint, payload);
        console.log(response);

        if (response.data.code === 200) {
            if (isLogin.value) {
                console.log("Login页面提示：获取到用户信息:");

                console.log(response.data.data.token);
                //存储用户信息
                userStore.setUserInfo(response.data.data);
                //存储token
                userStore.setToken(response.data.data.token)

                Swal.fire({
                    icon: 'success',
                    title: '登录成功',
                    text: '欢迎回来！'
                }).then(() => {
                    router.push('/');
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: '注册成功',
                    text: '请登录你的账号'
                }).then(() => {
                    isLogin.value = true;
                    animateForm();  // 切换后添加动画
                });
            }
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: isLogin.value ? '登录失败' : '注册失败',
            text: error.response?.data.message || error.message || '操作失败，请稍后重试'
        });
    }
};

// 页面加载时，添加动画效果
onMounted(() => {
    // 默认动画效果
    animateForm();
});
</script>

<style scoped>
.login-body {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    color: #fff;
}

.background-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(30, 30, 50, 0.8), rgba(50, 50, 100, 0.6), rgba(80, 10, 60, 0.5), rgba(0, 0, 50, 0.7));
    background-size: 300% 300%;
    z-index: -1;
    animation: gradientFlow 12s ease infinite;
}

@keyframes gradientFlow {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.container {
    width: 700px;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    /* 确保居中 */
}

.login-container {
    width: 400px;
    padding: 30px 15px;
    backdrop-filter: blur(10px);
    box-sizing: border-box;
    transition: width 0.8s ease-out;
    /* 增加过渡效果 */
}

/* 保证当切换状态时，容器宽度动画效果生效 */
.login-container.show {
    width: 500px;
    /* 注册时容器宽度增大 */
}


h2 {
    font-size: 2.5em;
    text-align: left;
    margin-bottom: 20px;
    color: #ff8c00;
}

.form-group {
    margin-bottom: 20px;
    opacity: 0;
    transform: translateX(-50px);
    transition: transform 0.3s ease, opacity 0.3s ease;
    color: #000;
}

.form-group label {
    font-size: 1.1em;
    color: #ff8c00;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 2px solid #ff8c00;
    border-radius: 10px;
    font-size: 16px;
    background: transparent;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.form-group input:focus {
    color: #000;
    border-color: #ba74ff;
    box-shadow: 0 0 8px rgba(255, 140, 0, 0.7);
    transform: scale(1.01);
}

button {
    width: 100%;
    padding: 12px;
    background-color: #8000ff;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
}

button:hover {
    background-color: #ff8c00;
    transform: scale(1.1) rotate(5deg);
}

.toggle-link {
    text-align: center;
    margin-top: 20px;
    color: #ff8c00;
    cursor: pointer;
}

.toggle-link a {
    color: #ff8c00;
    text-decoration: underline;
}
</style>