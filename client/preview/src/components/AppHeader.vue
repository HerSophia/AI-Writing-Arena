// src/components/AppHeader.vue
<template>
  <header class="app-header">
    <!-- 标题 h1 将应用渐变色 -->
    <h1>LLM 创意领域表现评估</h1>

    <!-- 动态副标题 -->
    <div class="dynamic-subtitle">
      <TypedComponent :options="subtitleOptions">
        <span class="typing"></span> <!-- 指定打字效果应用在此 span -->
      </TypedComponent>
    </div>

    <p class="subtitle-links">
      <a href="https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME" target="_blank" rel="noopener noreferrer">GitHub 仓库</a> |
      <el-link type="primary" :underline="false" @click="showMethodology" class="methodology-link">评估方法说明</el-link>
    </p>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElLink } from 'element-plus'; // 引入 ElLink
import { TypedComponent, type TypedOptions } from "typed-vue3";

// 定义要触发的事件
const emit = defineEmits(['show-methodology']);

const showMethodology = () => {
  emit('show-methodology'); // 触发事件
};

// --- 副标题配置 ---
// 你可以修改这些副标题内容
const subtitleStrings = [
  "探索大型语言模型的创作潜力",
  "为小说与角色扮演寻找最佳 AI 伙伴",
  "量化创意写作中的 AI 表现",
  "社区驱动的 LLM 创意评估平台"
];

const subtitleOptions: TypedOptions = {
  strings: subtitleStrings, // 要动态显示的字符串数组
  typeSpeed: 30,           // 打字速度 (ms)
  backSpeed: 30,           // 退格速度 (ms)
  backDelay: 1800,         // 打完后停留多久开始退格 (ms)
  startDelay: 500,         // 延迟多久开始打字 (ms)
  loop: true,              // 是否循环播放
  showCursor: true,        // 是否显示打字光标
  cursorChar: '|',         // 光标字符
  smartBackspace: true,   // 智能退格，只退格不同的部分
  // shuffle: true,        // (可选) 是否随机播放字符串
};

// const githubRepoUrl = "https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME";
// 在模板中可以直接写 URL，或者像这样定义一个变量（如果 URL 复杂或需要动态生成）
</script>

<style scoped>
.app-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 25px 0;
  border-bottom: 1px solid #eee;
}

.app-header h1 {
  margin-bottom: 8px; /* 减小主标题和副标题间距 */
  font-size: 2.2em;
  font-weight: 600;
  background-image: linear-gradient(to right, #5cadff, #0e66be);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

/* --- 副标题样式 --- */
.dynamic-subtitle {
  font-size: 1.1em; /* 副标题字号 */
  color: #888888; /* 灰色 */
  height: 1.5em; /* 预留高度防止文字消失时跳动 */
  min-height: 1.5em; /* 确保至少有这个高度 */
  margin-bottom: 15px; /* 副标题和下方链接的间距 */
}

/* (可选) 定制打字光标样式 */
/* 需要使用 :deep() 选择器，因为光标是子组件内部生成的 */
.dynamic-subtitle :deep(.typed-cursor) {
  color: #aaaaaa; /* 光标颜色 */
  font-weight: 100;
  /* animation-duration: 0.8s; */ /* 调整闪烁速度 */
}

/* Typed.js 默认会给光标添加样式，如果需要可以覆盖 */
/* 例如:
:deep(.dynamic-subtitle .typed-cursor) {
  color: #aaa;
  font-weight: lighter;
}
*/

.subtitle-links {
  font-size: 0.95em;
  color: #606266;
}

.subtitle-links a,
.subtitle-links .el-link {
  color: #409EFF;
  text-decoration: none;
  margin: 0 10px;
  vertical-align: baseline;
}

.subtitle-links a:hover,
.subtitle-links .el-link:hover {
  text-decoration: underline;
}

.methodology-link {
    font-size: 0.95em !important;
}
</style>