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
  justify-content: center; /* 居中显示分页 */
  margin-top: 25px;
  padding: 15px 0;
}
</style>