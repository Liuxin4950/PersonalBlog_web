<template>
    <div class="header">
        <div class="banner-box">
            <div class="banner-title">
                <div class="glowing-text">This is my Personal Blog</div>
            </div>
        </div>

        <div>
            <el-carousel :interval="5000" arrow="always" height="100vh">
                <el-carousel-item>
                    <img class="fit" src="@/assets/image/banner/blhx.png" alt="banner image" loading="lazy" />
                </el-carousel-item>
                <el-carousel-item>
                    <img class="fit" src="@/assets/image/banner/wlcy.jpg" alt="banner image" loading="lazy" />
                </el-carousel-item>
                <el-carousel-item>
                    <img class="fit" src="@/assets/image/banner/world.png" alt="banner image" loading="lazy" />
                </el-carousel-item>
                <el-carousel-item>
                    <img class="fit" src="@/assets/image/banner/sczz.png" alt="banner image" loading="lazy" />
                </el-carousel-item>
                <el-carousel-item>
                    <img class="fit" src="@/assets/image/banner/dj.jpg" alt="banner image" loading="lazy" />
                </el-carousel-item>
            </el-carousel>
        </div>

        <div class="wave-container">
            <svg class="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none">
                <defs>
                    <path id="gentle-wave"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g class="parallax">
                    <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
                    <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                    <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                    <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
                </g>
            </svg>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
:root {
    --primary-color: rgba(84, 58, 183, 1);
    --secondary-color: rgba(0, 172, 193, 1);
    --wave-opacity-high: rgba(255, 255, 255, 0.7);
    --wave-opacity-medium: rgba(255, 255, 255, 0.5);
    --wave-opacity-low: rgba(255, 255, 255, 0.3);
}

.el-carousel {
    width: 100%;
    height: 600px;
}

.header {
    width: 100% !important;
    position: relative;
    background: linear-gradient(60deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
}

.banner-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9;
}

.banner-title {
    width: 30%;
    height: 200px;
    transform: translateY(-50px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.glowing-text {
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 3px var(--wave-opacity-high), 0 0 6px var(--wave-opacity-medium),
        0 0 12px var(--wave-opacity-low), 0 0 24px var(--primary-color);
    white-space: nowrap;
    overflow: hidden;
    line-height: 1.4;
}

.waves {
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 10vh;
    min-height: 100px;
    max-height: 150px;
}

.parallax>use {
    animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.parallax>use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
}

.parallax>use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
}

.parallax>use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
}

.parallax>use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
}

@keyframes move-forever {
    0% {
        transform: translate3d(-90px, 0, 0);
    }

    100% {
        transform: translate3d(85px, 0, 0);
    }
}

@media (max-width: 768px) {
    .banner-title {
        width: 80%;
    }

    .banner-title .glowing-text {
        font-size: 1.5rem;
    }

    .waves {
        height: 40px;
        min-height: 40px;
    }
}
</style>