// src/components/Pagination.vue (或者你的分页组件路径)
<template>
  <div class="pagination-container" v-if="totalItems > 0">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalItems"
      :page-sizes="[5, 10, 20, 50, 100]" 
      layout="total, sizes, prev, pager, next, jumper" 
      background
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ElPagination } from 'element-plus';

// @ts-ignore TS6133: props is used in the template
const props = defineProps<{
  currentPage: number;
  pageSize: number;
  totalItems: number;
}>();

console.log('Pagination props:', props);

// 同时 emit page-change 和 size-change 事件
const emit = defineEmits(['page-change', 'size-change']);

const handleCurrentChange = (newPage: number) => {
  emit('page-change', newPage);
};

// 启用 handleSizeChange 函数
const handleSizeChange = (newSize: number) => {
  console.log(`PaginationControl emitting size-change: ${newSize}`); // 添加日志
  emit('size-change', newSize); // 发射 size-change 事件
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center; /* 默认居中 */
  margin-top: 25px;
  padding: 15px 0;
  overflow-x: auto; /* 添加轻微的水平滚动以防万一 */
  -webkit-overflow-scrolling: touch; /* iOS 优化滚动 */
}

/* 针对 Element Plus 分页组件内部结构的样式调整 */
/* 使用 :deep() 穿透 scoped 限制 */
.pagination-container :deep(.el-pagination) {
  /* 在小屏幕上允许换行 */
  flex-wrap: wrap;
  /* 垂直方向居中对齐换行后的元素 */
  align-items: center;
  /* 调整整体的左右间距，使其在小屏幕上不紧贴边缘 */
  padding: 0 5px;
  /* 让分页元素在换行后也居中显示 */
  justify-content: center;
  /* 减小元素之间的默认间距 */
  gap: 5px 8px; /* 垂直间距 5px, 水平间距 8px */
}

/* --- 媒体查询：针对小屏幕优化 --- */
@media (max-width: 767px) {
  .pagination-container {
    margin-top: 20px; /* 减小与上方内容的间距 */
    padding: 10px 0;
  }

  /* 可以在更小的屏幕上隐藏不那么重要的部分，例如 Jumper */
  /*
  .pagination-container :deep(.el-pagination__jump) {
    display: none;
  }
  */

  /* 或者隐藏 Sizes 选择器 */
  /*
  .pagination-container :deep(.el-pagination__sizes) {
    display: none;
  }
  */

  /* 调整分页器数字按钮的大小或间距 */
  .pagination-container :deep(.el-pager li),
  .pagination-container :deep(.el-pagination button) {
     min-width: 28px; /* 减小按钮最小宽度 */
     height: 28px; /* 减小按钮高度 */
     /* padding: 0 4px; */ /* 减小内边距 */
     line-height: 28px;
  }

   /* 调整 Total 文本的右边距，让它给换行元素更多空间 */
   /*
   .pagination-container :deep(.el-pagination__total) {
      margin-right: 10px; 
   }
   */
}

/* 针对非常小的屏幕，可以进一步简化 */
@media (max-width: 480px) {
   /* 同时隐藏 Jumper 和 Sizes */
   .pagination-container :deep(.el-pagination__jump) {
     display: none;
   }

   /* 强制 Total 元素单独一行或给更多空间 */
   /*
   .pagination-container :deep(.el-pagination__total) {
      flex-basis: 100%; 
      text-align: center; 
      margin-bottom: 8px; 
      margin-right: 0; 
   }
   */
   .pagination-container :deep(.el-pagination) {
       gap: 5px; /* 进一步减小间距 */
   }
}
</style>