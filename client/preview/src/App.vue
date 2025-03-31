// src/App.vue
<template>
  <!-- 路由匹配到的组件将在这里渲染 -->
  <router-view />
</template>

<script setup lang="ts">
// 在这个结构下，App.vue 通常不需要额外的脚本逻辑
// 全局状态由 Pinia 管理，页面布局由 HomeView.vue 内部的 el-container 管理
</script>

<style>
/* 全局基础样式，例如重置 body 边距，设置基础字体等 */
body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #303133; /* Element Plus 主要文字颜色 */
  background-color: #f4f4f5; /* Element Plus 基础背景色 */
  min-height: 100vh; /* 确保背景色至少填满视口高度 */
}

/* 可以添加其他全局样式，但要谨慎，避免过度全局化 */
/* 例如 Element Plus Tooltip 的 pre-line 样式可以放在这里或者需要它的组件里 */
.el-tooltip__popper {
  white-space: pre-line;
}
</style>