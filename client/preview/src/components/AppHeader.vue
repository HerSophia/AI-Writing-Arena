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
      <a href="https://github.com/HerSophia/AI-Writing-Arena" target="_blank" rel="noopener noreferrer">GitHub 仓库</a> |
      <el-link type="primary" :underline="false" @click="showMethodology" class="methodology-link">评估方法说明</el-link>
    </p>
  </header>
</template>

<script setup lang="ts">
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
  padding: 25px 15px; /* 增加左右 padding */
  border-bottom: 1px solid #eee;
}

.app-header h1 {
  margin-bottom: 8px;
  font-size: 2.2em; /* 默认字体 */
  font-weight: 600;
  background-image: linear-gradient(to right, #5cadff, #0e66be);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  line-height: 1.2; /* 增加行高防止文字截断 */
}

.dynamic-subtitle {
  font-size: 1.1em; /* 默认字体 */
  color: #888888;
  height: 1.5em;
  min-height: 1.5em;
  margin-bottom: 15px;
}

.dynamic-subtitle :deep(.typed-cursor) {
  color: #aaaaaa;
  font-weight: 100;
}

.subtitle-links {
  font-size: 0.95em; /* 默认字体 */
  color: #606266;
  line-height: 1.6; /* 增加行高方便点击 */
}

.subtitle-links a,
.subtitle-links .el-link {
  color: #409EFF;
  text-decoration: none;
  margin: 0 8px; /* 默认间距 */
  vertical-align: baseline;
  display: inline-block; /* 确保 margin 生效 */
}

.subtitle-links a:hover,
.subtitle-links .el-link:hover {
  text-decoration: underline;
}

.methodology-link {
    font-size: inherit !important; /* 继承父级 .subtitle-links 的字号 */
}

/* --- 新增媒体查询 --- */
@media (max-width: 767px) {
  .app-header {
    padding: 20px 10px; /* 减小移动端上下内边距 */
    margin-bottom: 20px; /* 减小与下方内容的间距 */
  }

  .app-header h1 {
    font-size: 1.8em; /* 减小移动端主标题字号 */
  }

  .dynamic-subtitle {
    font-size: 1em; /* 减小移动端副标题字号 */
    height: auto; /* 高度自适应 */
    min-height: 1.5em; /* 保留最小高度 */
  }

  .subtitle-links {
    font-size: 0.9em; /* 减小移动端链接字号 */
  }
  /* 可以考虑让链接换行显示 */
  /*
  .subtitle-links a,
  .subtitle-links .el-link {
     display: block; 
     margin: 5px auto; 
     text-align: center;
  }
  .subtitle-links span { 
     display: none; // 隐藏分隔符 "|"
  }
  */
}

/* 针对更小的屏幕，可以进一步减小字体 */
@media (max-width: 480px) {
   .app-header h1 {
     font-size: 1.6em;
   }
   .dynamic-subtitle {
     font-size: 0.9em;
   }
    .subtitle-links {
      font-size: 0.85em;
   }
}
</style>