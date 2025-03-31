<template>
  <div class="controls">
    <el-button @click="dialogVisible = true">筛选</el-button>

    <el-dialog v-model="dialogVisible" title="筛选选项" width="500">
      <!-- 筛选表单内容 -->
      <el-form :model="filterForm">
        <el-form-item label="模型提供商">
          <el-checkbox-group v-model="filterForm.providers">
            <!-- 选项应动态从数据加载，这里先用占位符 -->
            <el-checkbox label="OpenAI">OpenAI</el-checkbox>
            <el-checkbox label="Anthropic">Anthropic</el-checkbox>
            <el-checkbox label="虚拟公司">虚拟公司</el-checkbox>
            <el-checkbox label="Google">Google (占位)</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="逻辑评分范围">
           <el-slider
              v-model="filterForm.logicScoreRange"
              range
              :min="1"
              :max="10"
              show-stops>
            </el-slider>
        </el-form-item>
        <!-- 可以添加更多维度的筛选条件 -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetFilters">重置</el-button>
          <el-button type="primary" @click="applyFilters">
            应用筛选
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
//import { ElMessage } from 'element-plus'; // 如果需要提示

const dialogVisible = ref(false);

// 定义筛选表单的数据结构
interface FilterForm {
  providers: string[];
  logicScoreRange: [number, number]; // 例如逻辑评分范围
  // 可以添加其他筛选字段
}

// 初始化筛选表单
const initialFilterState: FilterForm = {
  providers: [],
  logicScoreRange: [1, 10],
};
const filterForm = reactive<FilterForm>({ ...initialFilterState });

// 定义emit事件，用于通知父组件筛选条件已更新
const emit = defineEmits(['apply-filters']);

const applyFilters = () => {
  console.log('应用筛选:', JSON.parse(JSON.stringify(filterForm))); // 深拷贝以防响应式问题
  // 触发事件，将筛选条件传递给父组件
  emit('apply-filters', JSON.parse(JSON.stringify(filterForm)));
  dialogVisible.value = false;
  // ElMessage.success('筛选已应用'); // 可选提示
};

const resetFilters = () => {
  Object.assign(filterForm, initialFilterState); // 重置回初始状态
  console.log('重置筛选');
  // 重置也需要通知父组件
  emit('apply-filters', JSON.parse(JSON.stringify(filterForm)));
  // dialogVisible.value = false; // 可以选择重置后是否关闭弹窗
  // ElMessage.info('筛选已重置'); // 可选提示
};

// TODO: 动态加载筛选选项 (例如 providers 列表)
// 可以在父组件获取数据后，通过 props 传递给这个组件，或者这个组件自己获取/定义
</script>

<style scoped>
.controls {
  display: inline-block; /* 让按钮并排 */
  margin-right: 10px; /* 与排序按钮隔开 */
}
.dialog-footer {
  text-align: right;
}
.el-form-item {
  margin-bottom: 15px;
}
.el-slider {
  margin-left: 5px; /* 给 slider 一点左边距 */
}
</style>