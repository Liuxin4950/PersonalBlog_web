<template>

    <div class="header">
        <div class="banner-box">
            <div class="banner-title">
                <!-- <div class="h2">Hi! Im LiuXin</div> -->
                <!-- <div class="h3">This is my personal blog</div> -->
                <!-- <div class="banner-href-box">
                    <a href="https://github.com/Liuxin4950?tab=repositories" target="_blank">
                        <div class="banner-href">
                            <img class="fit" src="../../assets/image/icon/github.png" alt="">
                        </div>
                    </a>
                    <a href="">
                        <div class="banner-href">
                            <img class="fit" src="../../assets/image/icon/qq.png" alt="">
                        </div>
                    </a>
                    <a href="">
                        <div class="banner-href">
                            <img class="fit" src="../../assets/image/icon/邮箱-合上.png" alt="">

                        </div>
                    </a>
                    <a href="">
                        <div class="banner-href">
                            <img class="fit" src="../../assets/image/icon/github.png" alt="">

                        </div>
                    </a>


                </div> -->
                <div class="glowing-text">This is my Personal Blog</div>

            </div>
        </div>
        <div>
            <el-carousel :interval="5000" arrow="always" height="100vh">
                <el-carousel-item>
                    <img class="fit" src="../../assets/image/admin/blhx.png" alt="">
                </el-carousel-item>
            </el-carousel>
        </div>

        <div>
            <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
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
.glowing-text {
    font-size: 2em;
    /* 根据需要调整字体大小 */
    font-weight: bold;
    color: #fff;
    text-shadow:
        0 0 3px rgba(163, 215, 255, 0.9),
        0 0 6px rgba(163, 215, 255, 0.7),
        0 0 12px rgba(137, 197, 233, 0.5),
        0 0 24px rgba(110, 179, 211, 0.3),
        0 0 36px rgba(90, 162, 196, 0.1);
    animation: typing 4s steps(2em, end), blink 0.7s step-end infinite;
    white-space: nowrap;
    overflow: hidden;
    border-right: 4px solid #4aa5e2d5;
    line-height: 1.4;
}

@keyframes typing {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

@keyframes blink {

    from,
    to {
        border-color: transparent;
    }

    50% {
        border-color: #4aa5e2d5;
    }
}


.banner-box,
.el-carousel {
    height: 600px;
}

.banner-box {
    width: 100%;
    height: 600px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    display: flex;
    justify-content: center;
    align-items: center;
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

.banner-title .h2 {
    font-size: 65px;
    color: white;

}

.banner-title .h3 {
    font-size: 35px;
    color: white;
}

.banner-href-box {
    margin-top: 20px;
    width: 100%;
    height: 100px;
    transform: translateX(20px);
    display: flex;
    justify-content: center;
    align-items: center;

}

.banner-href {
    margin-right: 2em;
    padding: 10px;
    width: 60px;
    min-width: 60px;
    height: 60px;
    border-radius: 10px;
    background-color: #333;
    transition: .5s;
}

.banner-href:hover {
    background-color: #fff;
}


.el-carousel {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    /* height: calc(100vh - 70px); */
}

.header {
    position: relative;
    /* text-align: center; */
    background: linear-gradient(60deg, rgba(84, 58, 183, 1) 0%, rgba(0, 172, 193, 1) 100%);
    color: white;
}

.waves {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10vh;
    margin-bottom: 0;
    min-height: 100px;
    max-height: 150px;

}

.content {
    position: relative;
    height: 20vh;
    text-align: center;
    background-color: white;
}

.content a {
    margin: 0 5px;
    font-size: 12px;
    color: #333;
}

.content a:hover {
    color: #000;
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

    .banner-title .h2 {
        font-size: 40px;
        color: white;

    }

    .banner-title .h3 {
        font-size: 20px;
        color: white;
    }

    .banner-href-box {
        transform: translateX(0);

    }


    .banner-href {
        margin-right: 1em;
        width: 30px;
        min-width: 30px;
        height: 30px;
        padding: 2px;
    }

    .waves {
        height: 40px;
        min-height: 40px;
    }

    .content {
        height: 30vh;
    }

    h1 {
        font-size: 24px;
    }
}
</style>