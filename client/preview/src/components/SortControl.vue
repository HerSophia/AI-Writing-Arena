<template>
  <div class="controls">
    <el-button @click="dialogVisible = true">排序</el-button>

    <el-dialog v-model="dialogVisible" title="排序选项" width="400">
      <el-form :model="sortForm">
        <el-form-item label="排序字段">
          <el-select v-model="sortForm.field" placeholder="请选择排序字段">
            <el-option label="模型名称 (Name)" value="name"></el-option>
            <el-option label="逻辑评分 (Logic)" value="logicScore"></el-option>
            <el-option label="文笔评分 (Style)" value="styleScore"></el-option>
             <el-option label="默认排序" value="default"></el-option>
            <!-- 应该动态生成或根据实际数据决定 -->
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-radio-group v-model="sortForm.order" :disabled="sortForm.field === 'default'">
            <el-radio label="ascending">升序</el-radio>
            <el-radio label="descending">降序</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetSort">重置</el-button>
          <el-button type="primary" @click="applySort">
            应用排序
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';

const dialogVisible = ref(false);

// 定义排序表单的数据结构
interface SortForm {
  field: string; // 排序字段名 (例如 'name', 'logicScore', 'default')
  order: 'ascending' | 'descending'; // 排序顺序
}

// 初始化排序表单
const initialSortState: SortForm = {
  field: 'default', // 默认不排序或按原始数据顺序
  order: 'ascending',
};
const sortForm = reactive<SortForm>({ ...initialSortState });

// 监听排序字段变化，如果是'default'，则禁用排序方式选择
watch(() => sortForm.field, (newField) => {
  if (newField === 'default') {
    sortForm.order = 'ascending'; // 可以设为任意值，因为不会用到
  }
});

// 定义emit事件
const emit = defineEmits(['apply-sort']);

const applySort = () => {
  console.log('应用排序:', JSON.parse(JSON.stringify(sortForm)));
  emit('apply-sort', JSON.parse(JSON.stringify(sortForm)));
  dialogVisible.value = false;
};

const resetSort = () => {
  Object.assign(sortForm, initialSortState);
  console.log('重置排序');
  emit('apply-sort', JSON.parse(JSON.stringify(sortForm)));
  // dialogVisible.value = false;
};

// TODO: 动态生成排序字段选项
</script>

<style scoped>
.controls {
  display: inline-block;
}
.dialog-footer {
  text-align: right;
}
.el-form-item {
  margin-bottom: 15px;
}
.el-select {
    width: 100%; /* 让下拉框撑满 */
}
</style>