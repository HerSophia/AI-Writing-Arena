import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => { // <-- 改成接收参数的函数
  // command 的值是 'serve' (开发) 或 'build' (构建)
  // mode 的值是 'development' 或 'production' 等

  const isBuild = command === 'build'; // 判断是否是构建命令

  return { // <-- 返回配置对象
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: path.resolve(__dirname, 'src/types/auto-imports.d.ts'),
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: path.resolve(__dirname, 'src/types/components.d.ts'),
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },

    // --- Conditionally set the base option ---
    base: isBuild ? '/AI-Writing-Arena/' : '/', // <-- 关键改动：只在构建时设置 base

    build: {
      outDir: 'dist',
    },
    server: {
      port: 3000,
    }
  }
})