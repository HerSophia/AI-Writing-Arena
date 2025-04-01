// src/components/LLMDetailDialog.vue
<template>
  <el-dialog
    :model-value="visible"
    @update:modelValue="$emit('update:visible', $event)"
    :title="llmData ? `${llmData.llm.name} - 详情` : '加载中...'"
    :width="dialogWidth" 
    top="5vh"
    destroy-on-close
    append-to-body
    class="llm-detail-dialog" 
  >
    <div v-if="llmData && allDimensions.length > 0">
      <!-- @ts-ignore -->
      <el-descriptions :column="currentDescriptionColumn" border>
        <el-descriptions-item label="提供商">{{ llmData.llm.provider }}</el-descriptions-item>
        <el-descriptions-item label="官方网站">
          <el-link
            v-if="providerWebsiteUrl"
            :href="providerWebsiteUrl"
            type="primary"
            target="_blank"
            rel="noopener noreferrer"
            :underline="false"
          >
            访问官网 <el-icon><Link /></el-icon>
          </el-link>
          <span v-else>N/A</span>
        </el-descriptions-item>
        <el-descriptions-item label="版本">{{ llmData.llm.version || '未知' }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="descriptionItemSpan ?? 3">
             {{ llmData.llm.description || '暂无描述' }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">评分维度详情</el-divider>
      <el-row :gutter="20">
        <el-col
          v-for="dimension in scoringDimensions"
          :key="dimension.id"
          :xs="24" :sm="12" :md="8" :lg="6"
          style="margin-bottom: 20px;"
        >
         <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <!-- 折叠按钮：仅在移动端显示 -->
                <el-button
                    v-if="isMobile"  
                    text
                    circle
                    size="small"
                    @click="toggleCardCollapse(dimension.id)"
                    class="collapse-toggle-button"
                    :aria-label="collapsedStates[dimension.id] ? `展开 ${dimension.name}` : `收起 ${dimension.name}`"
                    :aria-expanded="!collapsedStates[dimension.id]"
                    :aria-controls="`dimension-content-${dimension.id}`"
                 >
                    <el-icon>
                        <ArrowRight v-if="collapsedStates[dimension.id]" />
                        <ArrowDown v-else />
                    </el-icon>
                 </el-button>

                <!-- 标题：仅在移动端可点击并显示手型指针 -->
                <span
                    class="card-title"
                    :class="{ 'clickable-title': isMobile }"
                    @click="isMobile ? toggleCardCollapse(dimension.id) : null" 
                 >
                    {{ dimension.name }} ({{ dimension.weight ? `权重: ${dimension.weight}%` : 'N/A' }})
                </span>

                <div class="header-actions">
                    <el-tag v-if="llmData.scores[dimension.id]" :type="getTagType(llmData.scores[dimension.id]?.score)" size="small">
                      分数: {{ llmData.scores[dimension.id]?.score }}
                    </el-tag>
                </div>
              </div>
            </template>

            <!-- 卡片内容：使用 v-show 控制显隐 -->
            <!-- v-show 条件：桌面端始终显示，移动端根据状态显示 -->
            <div
                :id="`dimension-content-${dimension.id}`"
                v-show="!isMobile || !collapsedStates[dimension.id]" 
            >
              <v-chart
                v-if="llmData.score_distributions && llmData.score_distributions[dimension.id]"
                class="chart"
                :option="getDynamicChartOption(dimension, llmData.score_distributions[dimension.id])"
                autoresize
              />
              <div v-else class="no-data-placeholder">暂无分布数据</div>
              <p class="comment">
                <strong>评分说明:</strong>
                <span v-if="llmData.scores[dimension.id]">
                  {{ getScoreDescription(llmData.scores[dimension.id]?.score, dimension.id) || '暂无评分说明' }}
                </span>
                <i v-else> N/A</i>
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-divider content-position="left">附加信息</el-divider>
       <div v-if="hasAdditionalInfo">
          <el-descriptions :column="1" border size="small">
            <template v-for="dimension in additionalDimensions" :key="dimension.id">
                 <el-descriptions-item :label="dimension.name" v-if="llmData.additional_info_comments?.[dimension.id]">
                     {{ llmData.additional_info_comments[dimension.id].comment }}
                 </el-descriptions-item>
            </template>
         </el-descriptions>
      </div>
       <p v-else><i>暂无附加信息。</i></p>

    </div>
    <div v-else>
      <p>数据加载中或选择的模型无效...</p>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'; // 移除了 reactive 如果不再需要 collapsedStates
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';
import type { LlmCombinedEvaluation, Dimension, ScoreDistribution, ScoreDescriptions } from '@/type';
import { getProviderWebsite } from '@/config/providerWebsites';
import { ArrowDown, ArrowRight, Link } from '@element-plus/icons-vue';

const currentDescriptionColumn = computed<number>(() => {
  if (breakpoints.smaller('sm')) { // 对应之前的 'xs'
    return 1;
  } else if (breakpoints.between('sm', 'md')) { // 对应之前的 'sm'
    return 2;
  } else { // 对应之前的 'md' 及以上
    return 3;
  }
});

// 计算描述项应该跨越的列数
const descriptionItemSpan = computed<number>(() => {
    // 始终让描述项占据整行，即等于当前的总列数
    return currentDescriptionColumn.value;
});

// VChart 是全局注册的

// --- Props ---
const props = defineProps<{
  visible: boolean; // 由 v-model 控制
  llmData: LlmCombinedEvaluation | null; // 选中的 LLM 数据 (包含合并后的信息)
  allDimensions: Dimension[]; // 所有维度信息
  scoreDescriptions: ScoreDescriptions;
}>();

// --- Emits ---
const emit = defineEmits(['update:visible']);

// --- Responsive Setup (vueuse) ---
const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('sm');

// --- 计算属性 ---
// 动态 Dialog 宽度
const dialogWidth = computed(() => (isMobile.value ? '95%' : '80%'));

// 筛选出评分维度
const scoringDimensions = computed(() => {
  return props.allDimensions
    .filter(dim => dim.category === 'Scoring')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
});

// 筛选出附加信息维度
const additionalDimensions = computed(() => {
  return props.allDimensions
    .filter(dim => dim.category === 'Additional Info')
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
});

// 检查是否有附加信息评论
const hasAdditionalInfo = computed(() => {
    if (!props.llmData?.additional_info_comments) return false;
    return additionalDimensions.value.some(dim => props.llmData!.additional_info_comments![dim.id]);
});

// 计算官网 URL
const providerWebsiteUrl = computed(() => {
  if (props.llmData?.llm.provider) {
    return getProviderWebsite(props.llmData.llm.provider); // 使用辅助函数
  }
  return null;
});

// --- State for Collapsible Cards ---
const collapsedStates = reactive<{ [key: number]: boolean }>({});

// --- Watcher for Collapsible States ---
// 监听维度和移动状态，初始化折叠状态
watch(
  // 为源 getter 函数添加返回类型注解 : [Dimension[], boolean]
  (): [Dimension[], boolean] => [scoringDimensions.value, isMobile.value],
  // 回调函数类型保持不变
  (newValue: [Dimension[], boolean]) => {
    const [newDimensions, mobile] = newValue;

    if (!Array.isArray(newDimensions)) {
        console.warn("Watcher did not receive an array for dimensions:", newDimensions);
        return;
    }

    newDimensions.forEach((dim: Dimension) => {
      if (collapsedStates[dim.id] === undefined) {
          collapsedStates[dim.id] = mobile;
      }
    });

    const currentIds = new Set(newDimensions.map((d: Dimension) => d.id));
    Object.keys(collapsedStates).forEach(keyStr => {
        const key = parseInt(keyStr, 10);
        if (!currentIds.has(key)) {
            delete collapsedStates[key];
        }
    });
  },
  { immediate: true, deep: true }
);

// --- Methods ---
// 新增：获取条形图配置
const getBarChartOption = (dimension: Dimension, distributionData: ScoreDistribution[])/*: EChartsOption*/ => {
  if (!distributionData || distributionData.length === 0) {
    return {}; // 返回空配置或默认占位符配置
  }
  const total = distributionData.reduce((sum, item) => sum + item.count, 0);
  // 对数据排序可能有助于可视化，例如按分数范围排序
  // const sortedData = [...distributionData].sort((a, b) => /* 你想要的排序逻辑 */);

  // 准备 series 数据，包含颜色
  const seriesData = distributionData.map(item => ({
    value: item.count,
    name: item.range, // name 用于 tooltip 显示
    itemStyle: {
      color: getScoreRangeColor(item.range) // 应用颜色
    }
  }));

  // 为了让 Y 轴标签和数据顺序对应，最好反转一下数据和类目轴
  const yAxisData = distributionData.map(item => item.range).reverse();
  //const reversedSeriesData = [...seriesData].reverse();

  return {
    title: {
      // 移动端标题可以简化或放在顶部
      text: dimension.name,
      subtext: `总评分数: ${total}`,
      left: 'center',
      top: 5,
      textStyle: { fontSize: 14, fontWeight: 'normal' },
      subtextStyle: { fontSize: 12 }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: '{b}: {c}' // {b} 是类目名 (range), {c} 是数值 (count)
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '20%', containLabel: true }, // 稍微调整 top
    xAxis: { type: 'value', boundaryGap: [0, 0.01] },
    yAxis: {
      type: 'category',
      data: yAxisData // 使用反转后的类目
    },
    series: [
      {
        name: dimension.name, // 系列名称
        type: 'bar',
        data: seriesData, // 直接使用带颜色的数据
        //data: reversedSeriesData, // 使用反转后的数据
        label: { show: true, position: 'right', fontSize: 10 },
      }
    ],
    // 移除 legend，因为条形图通常不需要
  };
};

const getPieChartOption = (dimension: Dimension, distributionData: ScoreDistribution[]) => {
  const total = distributionData.reduce((sum, item) => sum + item.count, 0);
  return {
    title: {
      subtext: `总评分数: ${total}`,
      left: 'center',
      top: 5, // 稍微调整一下位置
      textStyle: {
         fontSize: 14,
         fontWeight: 'normal'
      },
       subtextStyle: {
         fontSize: 12
       }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0, // 调整到底部
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      // 图例过多时可以考虑分页或隐藏
      type: 'scroll', // 允许图例滚动
    },
    series: [
      {
        name: dimension.name,
        type: 'pie',
        radius: ['40%', '65%'], // 调整半径以适应可能的空间变化
        center: ['50%', '55%'], // 调整中心位置，为图例留出空间
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: distributionData.map(item => ({ value: item.count, name: item.range })),
        color: ['#F56C6C', '#E6A23C', '#67C23A']
      }
    ]
  };
};

// 辅助函数：根据分数范围获取颜色
const getScoreRangeColor = (range: string): string => {
  // 你可以根据实际的 range 字符串调整这里的逻辑
  // 这是一个示例实现
  if (range.includes('8') || range.includes('9') || range.includes('10') || range.toLowerCase().includes('high') || range.toLowerCase().includes('高')) {
    return '#67C23A'; // 成功/高分 (绿色)
  } else if (range.includes('5') || range.includes('6') || range.includes('7') || range.toLowerCase().includes('medium') || range.toLowerCase().includes('中')) {
    return '#E6A23C'; // 警告/中分 (橙色)
  } else if (range.includes('0') || range.includes('1') || range.includes('2') || range.includes('3') || range.includes('4') || range.toLowerCase().includes('low') || range.toLowerCase().includes('低')) {
    return '#F56C6C'; // 危险/低分 (红色)
  }
  return '#909399'; // 默认颜色 (灰色)
};

// 新增：动态获取图表配置的函数
const getDynamicChartOption = (dimension: Dimension, distributionData: ScoreDistribution[]) => {
  if (isMobile.value) {
    // console.log("Using Bar Chart for:", dimension.name);
    return getBarChartOption(dimension, distributionData);
  } else {
    // console.log("Using Pie Chart for:", dimension.name);
    return getPieChartOption(dimension, distributionData);
  }
};

// 获取标签类型 (复用之前的逻辑)
const getTagType = (score: number | undefined): ('success' | 'warning' | 'danger' | 'info') => {
  if (score === undefined || score === null) return 'info';
  if (score >= 8) return 'success';
  if (score >= 5) return 'warning';
  return 'danger';
};

// 新增/复用：获取评分描述的辅助函数
const getScoreDescription = (score: number | undefined, dimensionId: number): string | undefined => {
  if (score === undefined || score === null) return undefined;
  const roundedScore = Math.round(score);

  // 使用四舍五入后的整数分数进行查找
  return props.scoreDescriptions[String(dimensionId)]?.[String(roundedScore)];
};

const toggleCardCollapse = (dimensionId: number) => {
  if (collapsedStates[dimensionId] !== undefined) {
      collapsedStates[dimensionId] = !collapsedStates[dimensionId];
  } else {
      // 如果状态未定义（理论上不应发生，因为 watch 会初始化），则根据当前状态设置
      collapsedStates[dimensionId] = !isMobile.value; // 如果是移动端，则展开；否则折叠
  }
};

</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.collapse-toggle-button {
    padding: 2px;
    order: -1; /* 按钮在最左边 */
}

.card-title {
    font-weight: bold;
    flex-grow: 1;
    margin-left: 5px;
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    /* 移除默认的 cursor: pointer */
}

/* 仅在移动端为标题添加点击手型 */
.card-title.clickable-title {
  cursor: pointer;
}

.header-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.chart {
  height: 200px;
  width: 100%;
}

.comment { /* 样式保持不变 */
  font-size: 0.9em;
  color: #606266;
  margin-top: 10px;
  line-height: 1.4;
}
.comment strong { color: #303133; }
.no-data-placeholder {
    height: 200px; /* 匹配 chart 高度 */
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
    font-size: 0.9em;
}
.el-dialog__body { padding-top: 10px; }
.el-descriptions { margin-bottom: 20px; }
.el-row { margin-top: 15px; }

/* 响应式调整 */
@media (max-width: 767px) { /* 对应 'sm' 断点 */
  /* .llm-detail-dialog 的宽度已由 dialogWidth 计算属性处理 */
  .el-dialog__body { padding: 10px 15px; }
  .el-divider__text { font-size: 0.95em; }
  .chart {
      /* 如果需要，可以在移动端特定调整高度 */
      /* height: 220px; */
  }
  .no-data-placeholder {
      /* height: 220px; */
  }
}
/* 如果 .llm-detail-dialog 的 width 不生效，可能需要 !important 或更具体的选择器 */
:deep(.llm-detail-dialog) {
    /* 确保能覆盖 Element Plus 的默认宽度 */
}
</style>