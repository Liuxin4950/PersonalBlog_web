<template>
    <div class="content">
        <div class="create-article">
            <h1>创建新文章</h1>
            <form @submit.prevent="submitArticle">
                <!-- 选择作者和分类 -->
                <div>
                    <label for="authorId">作者:</label>
                    <input v-model="article.username" type="text" id="authorId" required />
                </div>

                <div>
                    <label for="categoryId">分类:</label>
                    <select v-model="article.categoryId" id="categoryId" required>
                        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name
                            }}</option>
                    </select>
                </div>

                <!-- 文章标题 -->
                <div>
                    <label for="title">文章标题:</label>
                    <input v-model="article.title" type="text" id="title" required />
                </div>
                <!-- 文章摘要 -->
                <div>
                    <label for="summary">文章摘要:</label>
                    <textarea v-model="article.summary" id="summary"></textarea>
                </div>

                <!-- Markdown 编辑器 -->
                <div>
                    <label for="content">文章内容 (Markdown 格式):</label>
                    <textarea v-model="article.content" id="content"></textarea>
                </div>



                <!-- 文章状态 -->
                <div>
                    <label for="status">文章状态:</label>
                    <select v-model="article.status" id="status" required>
                        <option value="draft">草稿</option>
                        <option value="published">已发布</option>
                        <option value="archived">已归档</option>
                    </select>
                </div>

                <!-- 图片上传 -->
                <div class="image-upload">
                    <label for="imageUrl" class="upload-label">文章封面图:</label>


                    <!-- 自定义上传按钮 -->
                    <label for="image-but" class="upload-button">选择图片</label>
                    <input id="image-but" type="file" @change="uploadImage" style="display: none;" />

                    <!-- 图片上传成功信息 -->
                    <div v-if="imageUrl" class="upload-success">
                        封面图上传成功:
                        <!-- 显示图片预览 -->
                        <div class="image-preview">
                            <img :src="imageUrl" alt="封面图预览" class="preview-image" />
                        </div>

                        <a :href="imageUrl" target="_blank">查看图片</a>
                    </div>
                </div>


                <!-- 提交按钮 -->
                <div>
                    <button class="submit-but" type="submit">提交文章</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import axios from 'axios'; // 导入 axios
import { createArticle } from '../../services/postService';
import { uploadFile } from '@/services/uploadService';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router'; // 引入 useRouter
import { useUserStore } from '@/store/userStore';
const router = useRouter(); // 获取路由实例
const userStore = useUserStore();

// 检查数据是否存在并将其转换为 JSON 格式
const usersJson = userStore.userInfo;
// 初始化文章数据
const article = ref({
    username: usersJson.username,
    authorId: usersJson.id,
    categoryId: '',
    title: '',
    content: '',
    summary: '',
    status: 'draft',
    imageUrl: ''
});

const categories = ref([
    { id: 1, name: '技术' },
    { id: 2, name: '生活' },
    { id: 3, name: '分享' }
]);

const imageUrl = ref('');

// 图片上传
const uploadImage = async (event) => {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);

    try {
        const response = await uploadFile(formData);
        imageUrl.value = response.data; // 服务器返回的图片 URL
        console.log(response.data);
        if (imageUrl.value) {
            Swal.fire({
                icon: 'success',
                title: '图片上传成功！',
                text: '请进行下一步吧'
            });
        }
    } catch (error) {
        console.error('图片上传失败', error);
        Swal.fire({
            icon: 'error',
            title: '图片上传失败',
            text: '请检查您的网络连接或稍后再试'
        });
    }
};

const submitArticle = async () => {
    try {
        const response = await createArticle({
            author_id: article.value.authorId,
            category_id: article.value.categoryId,
            title: article.value.title,
            content: article.value.content,
            summary: article.value.summary,
            status: article.value.status,
            image_url: imageUrl.value
        });

        console.log(response.data);

        if (response.code === 200) {
            Swal.fire({
                icon: 'success',
                title: '图片上传成功！',
                text: '请进行下一步吧',
                showCancelButton: true,  // 显示取消按钮
                confirmButtonText: '查看发布文章',  // 确认按钮文本
                cancelButtonText: '返回发布',  // 取消按钮文本
            }).then((result) => {
                if (result.isConfirmed) {
                    // 点击 "查看发布文章" 时的处理逻辑
                    console.log('查看发布文章');
                    // 使用 Vue Router 进行跳转
                    router.push({ name: 'article', params: { id: response.data.id } }); // 替换 123 为具体文章 ID
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // 点击 "返回发布" 时的处理逻辑
                    console.log('返回发布');
                }
            });

            // 清空表单
            article.value = {
                username: usersJson.username,
                authorId: usersJson.id,
                categoryId: '',
                title: '',
                content: '',
                summary: '',
                status: 'draft',
                imageUrl: ''
            };
            imageUrl.value = "";
        }
    } catch (error) {
        console.error('提交失败', error);
        Swal.fire({
            icon: 'error',
            title: '提交失败',
            text: '请检查您的网络连接或稍后再试'
        });
    }
};
</script>

<style scoped>
.content {
    max-width: 1300px;
    /* 最大宽度为 1300px */
    width: 100%;
    /* 默认宽度为 100%，即占满屏幕 */
    padding: 1em;
    /* 直接使用 100vh 更加简洁 */
    font-family: "dd";
    margin: 0 auto;
    /* 居中对齐 */
}


.create-article {
    background-color: #fff;
}

/* 表单样式 */
form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 120px;

}

/* 图片预览 */
img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 10px;
}

/* 表单字段样式 */
form div {
    display: flex;
    flex-direction: column;
}

label {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 8px;
    font-weight: 500;
}

/* 输入框和选择框样式 */
input[type="number"],
input[type="text"],
textarea,
select {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.3s ease;
}

input[type="number"]:focus,
input[type="text"]:focus,
textarea:focus,
select:focus {
    border-color: #4caf50;
}

#content {
    height: 400px;
}


.image-upload {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.upload-label {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
}

.image-preview {
    max-width: 300px;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 10px;
}

.preview-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
}

.upload-button {
    width: 300px;
    display: inline-block;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.upload-button:hover {
    background-color: #45a049;
}

.upload-success {
    color: #4caf50;
    font-size: 0.9rem;
}

.upload-success a {
    color: #4caf50;
    text-decoration: none;
}

.upload-success a:hover {
    text-decoration: underline;
}


/* 按钮样式 */
button {
    width: 100%;
    padding: 12px;
    background-color: #4caf50;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #45a049;
}

/* 链接样式 */
a {
    color: #4caf50;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>
