// src/components/LLMDetailDialog.vue
<template>
  <el-dialog
    :model-value="visible"
    @update:modelValue="$emit('update:visible', $event)"
    :title="llmData ? `${llmData.llm.name} - 详情` : '加载中...'"
    width="80%"
    top="5vh"
    destroy-on-close
    append-to-body
  >
    <div v-if="llmData && allDimensions.length > 0">
      <!-- 修改 el-descriptions 的列数，以便更好地布局 -->
      <el-descriptions :column="3" border>
        <el-descriptions-item label="提供商">{{ llmData.llm.provider }}</el-descriptions-item>

        <!-- 新增：官方网站 -->
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

        <!-- 描述现在需要跨越整个宽度 -->
        <el-descriptions-item label="描述" :span="3">{{ llmData.llm.description || '暂无描述' }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">评分维度详情</el-divider>

      <!-- ... 评分维度卡片部分保持不变 ... -->
      <el-row :gutter="20">
        <el-col
          v-for="dimension in scoringDimensions"
          :key="dimension.id"
          :xs="24" :sm="12" :md="8" :lg="6"
          style="margin-bottom: 20px;"
        >
         <!-- ... el-card 内容 ... -->
         <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>{{ dimension.name }}</span>
                <el-tag v-if="llmData.scores[dimension.id]" :type="getTagType(llmData.scores[dimension.id]?.score)" size="small">
                  分数: {{ llmData.scores[dimension.id]?.score }}
                </el-tag>
              </div>
            </template>
            <v-chart
              v-if="llmData.score_distributions && llmData.score_distributions[dimension.id]"
              class="chart"
              :option="getPieChartOption(dimension, llmData.score_distributions[dimension.id])"
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
          </el-card>
        </el-col>
      </el-row>

      <el-divider content-position="left">附加信息</el-divider>
      <!-- ... 附加信息部分保持不变 ... -->
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
import { computed } from 'vue';
import type { LlmCombinedEvaluation, Dimension, ScoreDistribution, ScoreDescriptions } from '@/type'; // 需要更新类型定义
import { getProviderWebsite } from '@/config/providerWebsites';

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

// --- Computed Properties ---
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


// --- Methods ---
// 生成 ECharts 饼图配置
const getPieChartOption = (dimension: Dimension, distributionData: ScoreDistribution[]) => {
  const total = distributionData.reduce((sum, item) => sum + item.count, 0);
  return {
    title: {
      // text: dimension.name, // 标题放卡片头了
      subtext: `总评分数: ${total}`,
      left: 'center',
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
      formatter: '{b} : {c} ({d}%)' // 显示 名称 : 数量 (百分比)
    },
    legend: {
      orient: 'horizontal', // 水平显示图例
      bottom: 'bottom', // 放在底部
      // data: distributionData.map(item => item.range) // 图例项
       icon: 'circle', // 图例标记形状
       itemWidth: 8,
       itemHeight: 8
    },
    series: [
      {
        name: dimension.name, // 系列名称
        type: 'pie',
        radius: ['40%', '70%'], // 饼图半径 [内半径, 外半径] -> 环形图
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 5, // 圆角
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          show: false, // 不在图上显示标签
          position: 'center'
        },
        emphasis: { // 高亮状态下的样式
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false // 不显示引导线
        },
        data: distributionData.map(item => ({ value: item.count, name: item.range })),
        // 可以为不同范围定义颜色
         color: ['#F56C6C', '#E6A23C', '#67C23A'] // 红、黄、绿 (对应 差、中、优)
      }
    ]
  };
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

</script>

<style scoped>
.chart {
  height: 200px; /* 给图表一个固定的高度 */
  width: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.comment {
  font-size: 0.9em;
  color: #606266;
  margin-top: 10px;
  line-height: 1.4;
}
.comment strong {
    color: #303133;
}
.no-data-placeholder {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
    font-size: 0.9em;
}
.el-dialog__body {
  padding-top: 10px; /* 减少标题和内容的间距 */
}
.el-descriptions {
  margin-bottom: 20px;
}
.el-row {
    margin-top: 15px;
}
</style>