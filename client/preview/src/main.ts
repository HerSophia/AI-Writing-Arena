import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

// --- ECharts 按需引入 ---
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent // GridComponent is often needed even for pie charts for layout
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from 'vue-echarts'; // 引入 vue-echarts

// 注册 ECharts 必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  PieChart,
  CanvasRenderer
]);
// --- ECharts 结束 ---

import App from './App.vue'
import HomeView from './views/HomeView.vue' // 引入你的首页视图组件

// --- Element Plus ---
// 注意：由于使用了 unplugin-auto-import 和 unplugin-vue-components，
// 你不需要在这里手动 `import ElementPlus from 'element-plus'` 和 `app.use(ElementPlus)`。
// 但是，你仍然需要导入 Element Plus 的 CSS 样式文件。
import 'element-plus/dist/index.css'

// --- 全局样式 (可选) ---
// 如果你有全局的 CSS 文件 (例如 src/assets/main.css), 在这里引入
// import './assets/main.css'

// 1. 创建 Vue 应用实例
const app = createApp(App)

// --- 将 VChart 组件注册为全局组件 ---
// 这样就可以在任何 .vue 文件中直接使用 <v-chart />
app.component('VChart', VChart);
// (可选) 提供 ECharts 主题
app.provide(THEME_KEY, 'light'); // 'light' 或 'dark'

// 2. 创建并使用 Pinia (用于状态管理)
const pinia = createPinia()
app.use(pinia)

// 3. 创建并使用 Vue Router (用于页面导航)
// 定义路由规则
const routes = [
  // 根路径指向 HomeView
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  // 未来如果需要其他页面，可以在这里添加
  // {
  //   path: '/about',
  //   name: 'About',
  //   // 路由懒加载示例
  //   component: () => import('./views/AboutView.vue')
  // }
]

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式 (推荐，需要服务器配置支持，但 GitHub Pages 通过技巧支持)
  // import.meta.env.BASE_URL 会自动获取 vite.config.ts 中配置的 'base' 值
  // 这对于部署到 GitHub Pages 子目录至关重要
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // 挂载路由规则

  // (可选) 配置路由跳转时的滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      // 如果有保存的位置（例如浏览器后退），则恢复该位置
      return savedPosition
    } else {
      // 否则，滚动到页面顶部
      return { top: 0 }
    }
  }
})
app.use(router) // 让 Vue 应用实例使用路由

// 4. 挂载 Vue 应用实例
// 确保在注册完所有插件 (Pinia, Router 等) 之后再挂载
app.mount('#app') // '#app' 对应 index.html 中的 <div id="app"></div>