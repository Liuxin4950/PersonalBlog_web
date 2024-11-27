<template>
    <div class="body">
        <img class="back-img" src="../../assets/image/admin/嘉然.png" alt="">

        <div class="register-container">
            <h2>注册</h2>
            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label for="username">用户名</label>
                    <input type="text" placeholder="请输入用户名" id="username" v-model="username" required />
                </div>
                <div class="form-group">
                    <label for="password">密码</label>
                    <input type="password" placeholder="请输入密码" id="password" v-model="password" required />
                </div>
                <div class="form-group">
                    <label for="email">邮箱</label>
                    <input type="email" placeholder="请输入邮箱" id="email" v-model="email" />
                </div>
                <div class="form-group">
                    <label for="phone">电话</label>
                    <input type="tel" placeholder="请输入电话号码" id="phone" v-model="phone" />
                </div>
                <button type="submit">注册</button>
            </form>
            <p class="login-link">
                已有账号？ <router-link to="/login">登录</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Swal from 'sweetalert2';

const username = ref('');
const password = ref('');
const email = ref('');
const phone = ref('');
const router = useRouter();

const handleRegister = async () => {
    try {
        const response = await axios.post('http://localhost:8080/api/users/register', {
            username: username.value,
            password: password.value,
            email: email.value,
            phone: phone.value
        });

        if (response.data.code === 200) {
            // 注册成功，显示成功消息并跳转到登录页面
            Swal.fire({
                icon: 'success',
                title: '注册成功',
                text: '请登录你的账号'
            }).then(() => {
                router.push('/login');
            });
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        // 注册失败，显示错误信息
        Swal.fire({
            icon: 'error',
            title: '注册失败',
            text: error.response?.data.message || error.message || '无法注册，请稍后重试'
        });
    }
};

</script>

<style scoped>
.body {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, rgba(173, 216, 230, 0.6), rgba(255, 182, 193, 0.6));
    backdrop-filter: blur(100px);
    background-size: cover;
    font-family: "dd";

    /* 使背景图像覆盖整个背景 */
    .back-img {
        height: 100%;
        object-fit: cover;
        position: absolute;
        bottom: 0;
        right: 0;
    }
}

.register-container {
    width: 100%;
    max-width: 500px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    /* 应用模糊效果 */
    background: rgba(255, 255, 255, 0.8);
    /* 半透明白色背景 */
    box-sizing: border-box;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background-color: #369c73;
}

.login-link {
    text-align: center;
    margin-top: 15px;
}
</style>
