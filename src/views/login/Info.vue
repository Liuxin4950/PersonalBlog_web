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
                        <div class="image-preview" v-if="profile.image_url">
                            <img :src="profile.image_url" alt="头像预览" class="preview-image" />
                            <div class="overlay" v-if="isEditing">
                                <label for="image-upload" class="upload-button">更换头像</label>
                                <input id="image-upload" type="file" @change="uploadImage" style="display: none" />
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="isEditing">
                                <label for="image-upload" class="upload-button">更换头像</label>
                                <input id="image-upload" type="file" @change="uploadImage" style="display: none" />
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
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
import { GetUser, putUser } from '@/services/user';
import { uploadFile } from '@/services/uploadService';
import { useUserStore } from '@/store/userStore';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 个人信息数据
const originalProfile = reactive({});
const profile = reactive({
    id: 0,
    username: '测试用户',
    email: 'test@example.com',
    phone: '1234567890',
    image_url: '', // 使用 image_url 而非 imageUrl
});

// 编辑状态
const isEditing = ref(false);

// 获取用户信息
const fetchUserInfo = async (id) => {
    try {
        const res = await GetUser(id);
        const userData = res.data;
        console.log(userData);
        if (userData != null || userData != undefined) {
            userStore.setUserInfo(userData)

        }

        Object.assign(profile, {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            image_url: userData.image_url || '', // 确保返回的头像地址是 image_url
        });

        Object.assign(originalProfile, { ...profile }); // 保存原始数据
    } catch (error) {
        handleError(error, '获取用户信息失败');
    }
};

// 初始化数据
onMounted(() => {
    fetchUserInfo(route.params.id);
});

// 编辑个人信息
const editProfile = () => {
    isEditing.value = true;
};

// 保存个人信息
const saveProfile = async () => {
    try {
        const response = await putUser({
            ...profile,
            image_url: profile.image_url, // 确保传递的是 image_url
        });

        if (response.code === 200) {
            await fetchUserInfo(route.params.id); // 获取最新的用户数据
            showSuccessDialog('个人信息修改成功！', '您的信息已更新');
            isEditing.value = false;
            Object.assign(originalProfile, { ...profile });
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.log(error.response.data);

        handleError(error, "更新错误");
    }
};

// 取消编辑
const cancelEdit = () => {
    isEditing.value = false;
    Object.assign(profile, { ...originalProfile }); // 恢复原始数据
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
        const response = await uploadFile(formData);
        profile.image_url = response.data; // 更新头像 URL
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

// 错误处理函数
const handleError = (error, message) => {
    Swal.fire({
        icon: 'error',
        title: message,
        text: error.response.data.message || '无法更新信息，请稍后重试'
    });
};

// 成功提示弹窗
const showSuccessDialog = (title, text) => {
    Swal.fire({
        icon: 'success',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: '修改完毕，返回首页',
        cancelButtonText: '继续查看',
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            router.push({ name: 'Home' });
        }
    });
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
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.image-preview:hover .overlay {
    opacity: 1;
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
    color: white;
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
    margin-right: 1em;
}

button:hover {
    background-color: #369c73;
}
</style>