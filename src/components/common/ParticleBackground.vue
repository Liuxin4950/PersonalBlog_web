<template>
    <div>
        <vue-particles id="tsparticles" :options="particlesOption" />
    </div>
</template>

<script setup lang="ts">
const particlesOption = {
    background: {
        color: {
            value: 'radial-gradient(circle, #1A237E, #000051)' // 深蓝渐变背景
        }
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: 'push'
            },
            onHover: {
                enable: true,
                mode: 'repulse'
            }
        },
        modes: {
            bubble: {
                distance: 250,
                duration: 2,
                opacity: 0.9,
                size: 6
            },
            push: {
                quantity: 4
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        },
    },
    particles: {
        color: {
            value: ['#7DF9FF', '#FF6EC7', '#FFD700', '#A020F0']
        },
        links: {
            // 设置连接线颜色，可以是黑色或彩色
            color: '#000000', // 黑色连接线
            // color: ['#FF6EC7', '#FFD700', '#A020F0'], // 彩色连接线（改为多彩）
            distance: 120,
            enable: true,
            opacity: 0.6,
            width: 1
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: 'bounce',
            random: false,
            speed: { min: 2, max: 5 },
            straight: false
        },
        number: {
            density: {
                enable: true,
                value_area: 1000
            },
            value: 120
        },
        opacity: {
            value: { min: 0.3, max: 0.8 },
            animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.3,
                sync: false
            }
        },
        shape: {
            type: ['circle', 'star', 'polygon', 'image'],
            options: {
                polygon: {
                    sides: 6 // 添加六边形
                },
                image: [
                    {
                        src: 'https://example.com/image1.png', // 替换为实际图片链接
                        width: 100,
                        height: 100
                    },
                    {
                        src: 'https://example.com/image2.png',
                        width: 150,
                        height: 150
                    }
                ]
            }
        },
        size: {
            value: { min: 2, max: 5 },
            animation: {
                enable: true,
                speed: 2,
                minimumValue: 1,
                sync: false
            }
        },
        rotate: {
            value: 0,
            direction: 'random',
            animation: {
                enable: true,
                speed: 5
            }
        }
    },
    detectRetina: true
}
</script>