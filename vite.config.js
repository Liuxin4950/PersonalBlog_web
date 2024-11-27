// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default defineConfig({
  plugins: [vue(),
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // 配置别名 @ 指向 src 目录
    }
  },
  server: {
    port: 520, // 确保你选择的端口未被占用
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/style/mixin.scss" as *;
        `,
      },
    },
  },

});
