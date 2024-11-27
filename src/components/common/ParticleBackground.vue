<template>
    <div>
        <vue-particles id="tsparticles" :options="particlesOption" />
    </div>
</template>

<script setup lang="ts">
const particlesOption = {
    background: {
        color: {
            value: '#ffffff' // 深蓝背景色，更符合二次元风格
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
            },
        },
        modes: {
            bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40
            },
            push: {
                quantity: 4
            },
            repulse: {
                distance: 200,
                duration: 0.4
            }
        }
    },
    particles: {
        color: {
            value: ['#FF007F', '#FFD700', '#00BFFF', '#DA70D6'], // 明亮的粉色、黄色、蓝色和紫色
        },
        links: {
            color: '#ffffff',
            distance: 120,
            enable: true,
            opacity: 0.6,
            width: 2
        },
        move: {
            direction: 'none',
            enable: true,
            outModes: 'bounce',
            random: true,
            speed: 8,
            straight: false
        },
        number: {
            density: {
                enable: true,
                value_area: 800
            },
            value: 100
        },
        opacity: {
            value: 0.7,
            random: true
        },
        shape: {
            type: ['circle', 'star'], // 可以尝试星形和圆形粒子
        },
        size: {
            value: { min: 1, max: 6 }
        }
    },
    detectRetina: true
}
</script>
