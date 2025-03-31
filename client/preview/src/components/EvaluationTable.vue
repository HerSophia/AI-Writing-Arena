<template>
  <!-- 使用 el-scrollbar 包裹表格，确保在内容过长时能独立滚动 -->
  <!-- 或者让 el-table 自身处理滚动 (默认行为) -->
  <el-table :data="tableData" style="width: 100%" v-loading="loading" border stripe>
    <el-table-column prop="llm.name" label="模型名称" min-width="180" fixed="left" sortable :sort-method="(a, b) => a.llm.name.localeCompare(b.llm.name, 'zh-Hans-CN')">
      <template #default="scope">
        <el-tooltip effect="dark" :content="`版本: ${scope.row.llm.version || '未知'}\n描述: ${scope.row.llm.description || '无'}`" placement="top-start">
          <span>{{ scope.row.llm.name }}</span>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column prop="llm.provider" label="提供商" min-width="110" sortable></el-table-column>

    <!-- 新增：总分列 -->
    <el-table-column
      label="总分"
      prop="totalScore"
      min-width="90"
      align="center"
      sortable
      :sort-method="(a, b) => (a.totalScore ?? -1) - (b.totalScore ?? -1)"
      fixed="left"
    >
      <template #header>
         <el-tooltip effect="dark" content="根据各评分维度加权平均计算得出" placement="top">
            <span>总分</span>
          </el-tooltip>
      </template>
      <template #default="scope">
        <span v-if="scope.row.totalScore !== null" :style="{ color: getTotalScoreColor(scope.row.totalScore) }">
          <!-- 保留一位小数 -->
          {{ scope.row.totalScore.toFixed(1) }}
        </span>
        <span v-else>N/A</span>
      </template>
    </el-table-column>

    <!-- 动态展示所有评分维度列 -->
    <el-table-column
      v-for="dimension in scoringDimensions"
      :key="dimension.id"
      :prop="`scores.${dimension.id}.score`"
      :label="dimension.name.split(' ')[0]" 
      min-width="95" 
      align="center"
      sortable
      :sort-method="(a, b) => (a.scores[dimension.id]?.score ?? -1) - (b.scores[dimension.id]?.score ?? -1)"
      >
      <template #header>
         <el-tooltip effect="dark" :content="dimension.name" placement="top">
            <span>{{ dimension.name.split(' ')[0] }}</span>
          </el-tooltip>
      </template>
      <template #default="scope">
        <el-tooltip
          v-if="scope.row.scores && scope.row.scores[dimension.id]"
          class="item"
          effect="dark"
          :content="getScoreDescription(scope.row.scores[dimension.id]?.score, dimension.id) || '暂无评分说明'"
          placement="top">
            <el-tag :type="getTagType(scope.row.scores[dimension.id]?.score)" size="small">
              {{ scope.row.scores[dimension.id]?.score }}
            </el-tag>
        </el-tooltip>
         <el-tag type="info" size="small" v-else>N/A</el-tag>
      </template>
    </el-table-column>


    <el-table-column label="操作" width="100" fixed="right" align="center">
       <template #default="scope">
         <el-button link type="primary" size="small" @click="viewDetails(scope.row)">
           查看详情
         </el-button>
       </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Dimension, ScoreDescriptions,LlmCombinedEvaluation } from '@/type';

// 定义 Props (如果类型定义在外部，可以简化)
const props = defineProps<{
  tableData: LlmCombinedEvaluation[];
  dimensions: Dimension[];
  loading: boolean;
  scoreDescriptions: ScoreDescriptions;
}>();

// 计算出所有需要展示的评分维度 (只显示 Scoring 类别的)
const scoringDimensions = computed(() => {
  return props.dimensions
    .filter(dim => dim.category === 'Scoring')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0)); // 按 display_order 排序
    // .slice(0, 3); // <-- 去掉了 slice 限制
});

// 根据分数给标签添加不同颜色
const getTagType = (score: number | undefined): ('success' | 'warning' | 'danger' | 'info') => {
  if (score === undefined || score === null) return 'info';
  if (score >= 8) return 'success';
  if (score >= 5) return 'warning';
  return 'danger';
};

// 查看详情操作 (目前仅打印)
const emit = defineEmits(['view-details']); // 定义事件
const viewDetails = (row: LlmCombinedEvaluation) => {
  console.log('查看详情:', row.llm.name);
  // 触发事件，将选中的行数据传递给父组件
  emit('view-details', row);
  // alert(`查看模型 "${row.llm.name}" 的详细信息 (功能待实现)`);
};

// 获取评分描述的辅助函数
const getScoreDescription = (score: number | undefined, dimensionId: number): string | undefined => {
  if (score === undefined || score === null || isNaN(score)) {
      return undefined;
  }

  // 四舍五入分数 ---
  const roundedScore = Math.round(score);

  // 使用四舍五入后的整数分数（转为字符串）作为 key 进行查找
  return props.scoreDescriptions[String(dimensionId)]?.[String(roundedScore)];
};

// 新增：根据总分获取颜色
const getTotalScoreColor = (score: number): string => {
    if (score >= 8.5) return '#67C23A'; // 优 (绿色)
    if (score >= 7.0) return '#E6A23C'; // 良 (黄色)
    if (score >= 5.0) return '#F56C6C'; // 中 (橙红色)
    return '#909399'; // 差 (灰色) - 或更深的红色
};

</script>

<style scoped>
.el-table {
  margin-top: 20px;
}

.el-tag {
  cursor: default;
}

/* 给表头标签加一点下划线，提示可悬停 */
.el-table .el-table__header-wrapper th .cell > span > span {
   border-bottom: 1px dashed #ccc;
   cursor: help;
}

/* 优化 tooltip 的换行显示 */
.el-tooltip__popper {
  white-space: pre-line; /* 让 \n 生效 */
}



</style>