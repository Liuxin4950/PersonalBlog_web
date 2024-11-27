<template>
    <div class="profile-container">
        <h2>个人信息</h2>
        <div class="profile-info">
            <div class="left-column">
                <div class="form-group">
                    <label for="username">用户名:</label>
                    <input type="text" id="username" v-model="profile.username" :readonly="!isEditing" />
                </div>
                <div class="form-group">
                    <label for="email">邮箱:</label>
                    <input type="email" id="email" v-model="profile.email" :readonly="!isEditing" />
                </div>
                <div class="form-group">
                    <label for="phone">电话号码:</label>
                    <input type="tel" id="phone" v-model="profile.phone" :readonly="!isEditing" />
                </div>
            </div>
            <div class="right-column">
                <div class="form-group">
                    <label>当前头像:</label>
                    <div class="image-container">
                        <div class="image-preview" v-if="profile.imageUrl">
                            <img :src="profile.imageUrl" alt="头像预览" class="preview-image" />
                            <div class="overlay" v-if="isEditing">
                                <label for="image-upload" class="upload-button">更换头像</label>
                                <input id="image-upload" type="file" @change="uploadImage" style="display: none;" />
                            </div>
                        </div>
                        <div v-else>


                            <div class="" v-if="isEditing">
                                <label for="image-upload" class="upload-button">更换头像</label>
                                <input id="image-upload" type="file" @change="uploadImage" style="display: none;" />
                            </div>
                            <div v-else>暂无头像</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="action-buttons">
            <button v-if="!isEditing" @click="editProfile">编辑信息</button>
            <button v-if="isEditing" @click="saveProfile">保存更改</button>
            <button v-if="isEditing" @click="cancelEdit">取消</button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import { GetUser } from '@/services/user';
const route = useRoute();

const router = useRouter();
// 个人信息数据
const originalProfile = reactive({}); // 用于存储原始数据
const profile = reactive({
    id: 0,
    username: '测试用户', // 初始化测试数据
    email: 'test@example.com',
    phone: '1234567890',
    imageUrl: '', // 头像 URL
});

// 获取用户信息并更新 profile
const getInfo = async (id) => {
    try {
        const res = await GetUser(id);
        const userData = res.data;
        // 将 userData 转换为 JSON 字符串并存储到 localStorage
        localStorage.setItem('user', JSON.stringify(userData));


        // 处理返回的数据，将 image_url 转换为 imageUrl
        profile.id = userData.id
        profile.username = userData.username;
        profile.email = userData.email;
        profile.phone = userData.phone;
        profile.imageUrl = userData.image_url || ''; // 如果为 null，赋值为空字符串

        // 保存原始数据用于取消编辑时恢复
        Object.assign(originalProfile, { ...profile });
    } catch (error) {
        console.error('获取用户信息失败:', error);
    }
};

onMounted(() => {
    getInfo(route.params.id);
});

// 编辑状态控制
const isEditing = ref(false);

// 编辑个人信息
const editProfile = () => {
    isEditing.value = true;
};
const saveProfile = async () => {
    try {
        // 调用后端接口保存更改
        const response = await axios.put('http://localhost:8080/api/users/update', {
            ...profile,
            image_url: profile.imageUrl, // 将 imageUrl 转换为 image_url
        });
        console.log(response.data);

        if (response.data.code === 200) {
            // 数据更新成功，获取最新的用户数据
            await getInfo(route.params.id); // 确保更新后获取最新的数据

            Swal.fire({
                icon: 'success',
                title: '个人信息修改成功！',
                text: '您的信息已更新',
                showCancelButton: true,  // 显示取消按钮
                confirmButtonText: '修改完毕，返回首页',  // 确认按钮文本
                cancelButtonText: '继续查看',  // 取消按钮文本
                reverseButtons: true,  // 让按钮顺序反转
            }).then((result) => {
                if (result.isConfirmed) {
                    // 点击了“修改完毕，返回首页”按钮，跳转到首页
                    router.push({ name: 'Home' });  // 使用命名路由进行跳转
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // 点击了“继续查看”按钮，不做跳转
                    console.log('继续查看个人信息');
                }
            });

            isEditing.value = false;
            // 更新原始数据为当前已保存的数据
            Object.assign(originalProfile, { ...profile });
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: '更新失败',
            text: error.response?.data.message || error.message || '无法更新信息，请稍后重试',
        });
    }
};



// 取消编辑
const cancelEdit = () => {
    isEditing.value = false;
    // 恢复为原始数据
    Object.assign(profile, { ...originalProfile });
};

// 图片上传
const uploadImage = async (event) => {
    if (event.target.files.length === 0) {
        Swal.fire({
            icon: 'error',
            title: '未选择文件',
            text: '请先选择一张图片',
        });
        return;
    }

    const formData = new FormData();
    formData.append('image', event.target.files[0]);

    try {
        const response = await axios.post('http://localhost:8080/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        profile.imageUrl = response.data.data; // 更新头像 URL
        Swal.fire({
            icon: 'success',
            title: '头像上传成功！',
            text: '头像已更新',
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: '头像上传失败',
            text: '请检查您的网络连接或稍后再试',
        });
    }
};

</script>

<style scoped>
.profile-container {
    max-width: 1300px;
    margin: 0 auto;
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.profile-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}

.left-column,
.right-column {
    width: 48%;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 1.2em;
    color: #333;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.image-container {
    position: relative;
    display: flex;
    justify-content: center;
}

.image-preview {
    position: relative;
    width: 100%;
    height: 240px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* 半透明蒙层 */
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.image-preview:hover .overlay {
    opacity: 1;
    /* 悬浮时显示 */
}

.upload-button {
    display: inline-block;
    padding: 12px 18px;
    background-color: #ff6f91;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s;
}

.upload-button:hover {
    background-color: #ff4977;
}

.action-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
}

button {
    padding: 12px 25px;
    font-size: 1.1em;
    cursor: pointer;
    border: none;
    border-radius: 8px;
    background-color: #42b983;
    color: white;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #369c73;
}
</style>