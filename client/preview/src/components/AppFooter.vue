<template>
  <footer class="app-footer">
    <p>
      © 2025 [HerSophia]. All Rights Reserved. |
      <a href="https://mit-license.org/" target="_blank" rel="noopener noreferrer">开源协议</a>
    </p>
    <p>
      数据来源为爱好者贡献和公开信息整理 (原型阶段使用示例数据).
    </p>
  </footer>
</template>

<script setup lang="ts">
// 目前无需脚本逻辑
</script>

<style scoped>
.app-footer {
  text-align: center;
  margin-top: 40px;
  padding: 20px 15px; /* 增加左右 padding */
  border-top: 1px solid #eee;
  font-size: 0.85em; /* 默认字体 */
  color: #909399;
  line-height: 1.6; /* 增加行高 */
}

.app-footer p {
  margin: 5px 0;
}

.app-footer a {
  color: #409EFF;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}

/* --- 新增媒体查询 --- */
@media (max-width: 767px) {
  .app-footer {
    margin-top: 30px; /* 减小与上方内容的间距 */
    padding: 15px 10px; /* 减小移动端内边距 */
    font-size: 0.8em; /* 减小移动端字号 */
  }
}

@media (max-width: 480px) {
  .app-footer {
    font-size: 0.75em; /* 在更小屏幕上进一步减小字号 */
  }
}
</style>