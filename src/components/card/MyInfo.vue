<template>
    <el-card>
        <div class="profile-container">
            <!-- 个人信息部分 -->
            <div class="profile-info">
                <h2 class="profile-name">RG刘鑫</h2>
                <p class="profile-description">欢迎来到我的个人博客！热爱编程与二次元，梦想做个快乐的开发者 (≧▽≦)</p>
            </div>

            <!-- 社交链接部分 -->
            <div class="banner-href-box">
                <!-- <a href="https://github.com/Liuxin4950?tab=repositories" target="_blank">
                    <div class="banner-href">
                        <img class="fit" src="../../assets/image/icon/github-square.png" alt="GitHub">
                    </div>
                </a> -->
                <a href="">
                    <div class="banner-href">
                        <img class="fit" src="../../assets/image/icon/qq.png" alt="QQ">
                    </div>
                </a>
                <a href="">
                    <div class="banner-href">
                        <img class="fit" src="../../assets/image/icon/邮箱-合上.png" alt="Email">
                    </div>
                </a>
                <a href="">
                    <div class="banner-href">
                        <img class="fit" src="../../assets/image/icon/github.png" alt="GitHub">
                    </div>
                </a>
            </div>
        </div>
    </el-card>
</template>

<script setup>
</script>

<style lang="scss" scoped>
/* 主容器样式，带渐变背景和小纸片划过动画 */
.profile-container {
    padding: 20px;
    background: linear-gradient(135deg, #42b983 0%, #f5576c 25%, #57a8f2 50%, #f6d365 75%);
    /* 绿色、粉色、蓝色、黄色渐变 */
    border-radius: 15px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}

/* 小纸片效果 */
.profile-container::before {
    content: "";
    position: absolute;
    top: -100%;
    left: -100%;
    width: 200%;
    height: 200%;
    background: transparent;
    pointer-events: none;
    z-index: 0;

}


/* 社交链接样式 */
.banner-href-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 10px;
    z-index: 2;
    /* 确保链接显示在遮罩层之上 */
}

.banner-href {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: radial-gradient(circle, #42b983, #ffffff, #57a8f2, #f6d365);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0px 0px 8px rgba(98, 219, 238, 0.8);
}

.banner-href:hover {
    transform: scale(1.15);
    background: radial-gradient(circle, #57a8f2, #ffffff, #42b983, #f6d365);
    box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.9);
}

/* 图片自适应 */
.fit {
    width: 30px;
    height: 30px;
    object-fit: cover;
}
</style>
