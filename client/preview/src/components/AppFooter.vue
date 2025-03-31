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
  padding: 20px 0;
  border-top: 1px solid #eee;
  font-size: 0.85em;
  color: #909399; /* Element Plus Secondary Text Color */
}

.app-footer p {
  margin: 5px 0;
}

.app-footer a {
  color: #409EFF; /* Element Plus Primary Color */
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>