<template>
  <el-container direction="vertical">
    <!-- 监听来自 AppHeader 的事件 -->
    <AppHeader @show-methodology="methodologyDialogVisible = true" />

    <el-main class="main-content">
      <div class="controls-container">
        <!-- 假设 FilterControl 和 SortControl 已更新为接收 props -->
        <FilterControl
          @apply-filters="handleApplyFilters"
          :providers="allProviders"
        />
        <el-button
          :icon="Refresh"
          circle
          @click="loadData"
          :loading="loading"
          title="刷新数据"
        ></el-button>
      </div>

      <EvaluationTable
        :table-data="paginatedData"
        :dimensions="allDimensions"
        :loading="loading"
        :score-descriptions="scoreDescriptions"
        @view-details="handleViewDetails"
        @sort-change="handleApplySort"
      />

      <PaginationControl
        :current-page="currentPage"
        :page-size="pageSize"
        :total-items="totalItems"
        @page-change="handlePageChange"
        @size-change="handlePageSizeChange"
      />
    </el-main>

    <AppFooter />

    <!-- 详情弹窗 -->
    <LLMDetailDialog
      v-if="detailDialogVisible"
      v-model:visible="detailDialogVisible"
      :llm-data="selectedLlmData"
      :all-dimensions="allDimensions"
      :score-descriptions="scoreDescriptions"
    />

    <!-- 评估方法说明弹窗 -->
    <el-dialog
      v-model="methodologyDialogVisible"
      title="评估方法说明"
      width="60%"
      top="10vh"
      append-to-body
      destroy-on-close
    >
      <MethodologyExplanation />
      <!-- 放入说明组件 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="methodologyDialogVisible = false"
            >我明白了</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 添加一个加载状态或错误提示 (可选) -->
    <div v-if="isLoading">正在加载公告信息...</div>
    <div v-if="loadError" style="color: red">加载公告失败: {{ loadError }}</div>

    <!-- 公告对话框 -->
    <!-- 确保传递的数据是响应式的 ref -->
    <AnnouncementDialog
      v-if="!isLoading && !loadError"
      v-model:visible="showAnnouncementDialog"
      :announcements="announcementData"
      :changelog="changelogData"
      :storage-key="announcementStorageKey"
    />
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import AppHeader from "@/components/AppHeader.vue";
import FilterControl from "@/components/FilterControl.vue";
//import SortControl from '@/components/SortControl.vue';
import EvaluationTable from "@/components/EvaluationTable.vue";
import PaginationControl from "@/components/PaginationControl.vue";
import AppFooter from "@/components/AppFooter.vue";
import LLMDetailDialog from "@/components/LLMDetailDialog.vue"; // 确保已导入
import MethodologyExplanation from "@/components/MethodologyExplanation.vue"; // <-- 导入说明组件
import AnnouncementDialog from "@/components/AnnouncementDialog.vue";
import {
  ElMessage,
  ElButton,
  ElContainer,
  ElMain,
  ElDialog,
} from "element-plus"; // 显式导入需要的 Element Plus 组件
import { Refresh } from "@element-plus/icons-vue";
import type {
  LlmBasicInfo,
  Dimension,
  EvaluationData,
  LlmCombinedEvaluation,
  FilterSettings,
  SortSettings,
  ScoreDescriptions,
} from "@/type"; // 依赖 @/types.ts

// --- 固定权重定义 (确保总和为 100) ---
const dimensionWeights: { [key: string]: number } = {
  "1": 20, // 逻辑 (Logic)
  "2": 30, // 文笔 (Writing Style)
  "3": 20, // 遵循能力 (Adherence)
  "4": 10, // 发散能力 (Creativity)
  "5": 5, // 语料广度 (Knowledge)
  "6": 10, // 流畅度/多样性 (Fluency)
  "7": 5, // 一致性/合理性 (Coherence)
};
// --- 权重定义结束 ---

// --- 响应式状态 ---
const loading = ref(false);
const allDimensions = ref<Dimension[]>([]); // <-- 取消注释
const allLlmInfo = ref<LlmBasicInfo[]>([]);
const allEvaluations = ref<EvaluationData[]>([]);
const scoreDescriptions = ref<ScoreDescriptions>({});
// FilterSettings 和 SortSettings 作为接口使用，具体状态在子组件或此处根据需要定义
const currentFilter = ref<FilterSettings>({
  providers: [],
  logicScoreRange: [1, 10],
}); // 用于存储筛选条件
const currentSort = ref<SortSettings>({ field: "default", order: "ascending" }); // 用于存储排序条件
const currentPage = ref(1);
const pageSize = ref(20);
const detailDialogVisible = ref(false);
const selectedLlmData = ref<LlmCombinedEvaluation | null>(null);
const methodologyDialogVisible = ref(false); // <-- 控制方法说明弹窗

// --- 计算属性 ---

// 1. 合并 LLM 信息和评估数据，并计算总分
const combinedData = computed((): LlmCombinedEvaluation[] => {
  const scoringDimensionIds = allDimensions.value
    .filter((dim) => dim.category === "Scoring")
    .map((dim) => String(dim.id)); // 获取所有评分维度的 ID (字符串)

  return allLlmInfo.value.map((llmInfo) => {
    const evaluation = allEvaluations.value.find(
      (e) => e.llm_id === llmInfo.id
    );
    const scores = evaluation?.scores ?? {};

    let weightedSum = 0;
    let totalWeightUsed = 0;

    // 计算加权平均分
    scoringDimensionIds.forEach((dimId) => {
      const weight = dimensionWeights[dimId];
      const scoreDetail = scores[dimId];

      // 确保维度有权重定义且该模型有评分
      if (weight !== undefined && scoreDetail?.score !== undefined) {
        weightedSum += scoreDetail.score * weight;
        totalWeightUsed += weight;
      }
    });

    // 计算总分，如果 totalWeightUsed 为 0 则为 null
    const totalScore =
      totalWeightUsed > 0 ? weightedSum / totalWeightUsed : null;

    return {
      llm: llmInfo,
      scores: scores,
      score_distributions: evaluation?.score_distributions,
      additional_info_comments: evaluation?.additional_info_comments,
      totalScore: totalScore, // 添加计算出的总分
    };
  });
});

// 1.5 获取所有提供商 (用于筛选)
const allProviders = computed(() => {
  const providers = new Set(allLlmInfo.value.map((llm) => llm.provider));
  return Array.from(providers);
});

// 2. 应用筛选 (基于 combinedData) <-- 修改这里
const filteredData = computed(() => {
  let data = combinedData.value; // <-- 源头改为 combinedData

  // 应用提供商筛选
  if (currentFilter.value.providers.length > 0) {
    data = data.filter((item) =>
      currentFilter.value.providers.includes(item.llm.provider)
    );
  }

  // 逻辑评分范围筛选 (假设逻辑是 id 1)
  const [minScore, maxScore] = currentFilter.value.logicScoreRange ?? [1, 10];
  if (minScore > 1 || maxScore < 10) {
    data = data.filter((item) => {
      const logicScore = item.scores["1"]?.score; // 假设逻辑维度 ID 为 '1'
      return (
        logicScore !== undefined &&
        logicScore >= minScore &&
        logicScore <= maxScore
      );
    });
  }

  // ... 可以添加更多筛选逻辑 ...

  return data;
});

// 3. 应用排序
const sortedData = computed(() => {
  const data = [...filteredData.value];
  const { field, order } = currentSort.value;

  if (field === "default") return data;

  data.sort((a, b) => {
    let valA: string | number | null = ""; // 允许 null
    let valB: string | number | null = ""; // 允许 null
    let comparison = 0;

    if (field === "name") {
      valA = a.llm.name.toLowerCase();
      valB = b.llm.name.toLowerCase();
    } else if (field === "provider") {
      valA = a.llm.provider.toLowerCase();
      valB = b.llm.provider.toLowerCase();
    } else if (field === "totalScore") {
      // <-- 处理总分排序
      valA = a.totalScore ?? -1; // 将 null 视为最低分
      valB = b.totalScore ?? -1;
    } else {
      // 按维度分数排序
      valA = a.scores[field]?.score ?? -1;
      valB = b.scores[field]?.score ?? -1;
    }

    // 执行比较
    if (typeof valA === "string" && typeof valB === "string") {
      comparison = valA.localeCompare(valB, "zh-Hans-CN");
    } else if (typeof valA === "number" && typeof valB === "number") {
      comparison = valA - valB;
    }
    // 可以增加对 null 的处理，虽然这里用 -1 替代了

    return order === "descending" ? comparison * -1 : comparison;
  });

  return data;
});

// 4. 当前页显示的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  // console.log(`Paginating: page=${currentPage.value}, size=${pageSize.value}, start=${start}, end=${end}`); // 调试日志
  return sortedData.value.slice(start, end);
});

// 5. 总条目数 (用于分页)
const totalItems = computed(() => filteredData.value.length);

// --- 方法 ---

const baseUrl = import.meta.env.BASE_URL; // 获取配置的 base URL
// 确保 baseUrl 结尾有斜杠，路径开头没有斜杠，以正确拼接
const joinPath = (base: string, path: string) => {
  const ensuredBase = base.endsWith("/") ? base : `${base}/`;
  const ensuredPath = path.startsWith("/") ? path.substring(1) : path;
  return `${ensuredBase}${ensuredPath}`;
};

// 加载所有数据
const loadData = async () => {
  loading.value = true;
  scoreDescriptions.value = {}; // 清空旧数据
  try {
    const [dimRes, llmRes, evalRes, descRes] = await Promise.all([
      fetch(joinPath(baseUrl, "data/dimensions.json")),
      fetch(joinPath(baseUrl, "data/llms.json")),
      fetch(joinPath(baseUrl, "data/evaluations.json")),
      fetch(joinPath(baseUrl, "data/score_descriptions.json")), // 确保文件名无误
    ]);

    if (!dimRes.ok || !llmRes.ok || !evalRes.ok || !descRes.ok) {
      // <-- 检查新请求
      throw new Error("Failed to load one or more data files.");
    }

    allDimensions.value = await dimRes.json();
    allLlmInfo.value = await llmRes.json();
    allEvaluations.value = await evalRes.json();
    scoreDescriptions.value = await descRes.json(); // <-- 存储评分描述

    console.log("所有数据加载成功");
    currentPage.value = 1;
  } catch (error) {
    console.error("加载数据失败:", error);
    ElMessage.error("加载示例数据失败！");
    allDimensions.value = [];
    allLlmInfo.value = [];
    allEvaluations.value = [];
    scoreDescriptions.value = {}; // 清空
  } finally {
    loading.value = false;
  }
};

// 处理筛选更新
const handleApplyFilters = (newFilters: FilterSettings) => {
  console.log("HomeView received filters:", newFilters);
  // 更新当前筛选状态
  currentFilter.value = { ...currentFilter.value, ...newFilters };
  currentPage.value = 1;
};

// 处理排序更新
const handleApplySort = (newSortFromChild: {
  field: string;
  order: "ascending" | "descending";
}) => {
  console.log("HomeView received sort from child:", newSortFromChild);

  let sortFieldKey = newSortFromChild.field;

  // 检查是否是特殊字段或总分
  if (
    sortFieldKey !== "name" &&
    sortFieldKey !== "provider" &&
    sortFieldKey !== "default" &&
    sortFieldKey !== "总分"
  ) {
    const dimensionToSort = allDimensions.value.find((d) =>
      d.name.startsWith(newSortFromChild.field)
    );
    if (dimensionToSort && dimensionToSort.category === "Scoring") {
      sortFieldKey = String(dimensionToSort.id);
    } else {
      console.warn(
        `无法找到与 "${newSortFromChild.field}" 匹配的评分维度进行排序，将使用默认排序。`
      );
      sortFieldKey = "default";
    }
  } else if (sortFieldKey === "总分") {
    // 如果子组件传来的是中文“总分”
    sortFieldKey = "totalScore"; // 转换为内部使用的键
  }

  currentSort.value = { field: sortFieldKey, order: newSortFromChild.order };
  console.log("Applied sort state:", currentSort.value);
  currentPage.value = 1;
};

// 处理页码变化
const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  // window.scrollTo({ top: document.querySelector('.main-content')?.offsetTop || 0, behavior: 'smooth' });
};

// --- 新增：处理每页条数变化 ---
const handlePageSizeChange = (newSize: number) => {
  console.log(`HomeView received size-change: ${newSize}`); // 添加日志
  pageSize.value = newSize; // 更新 pageSize
  currentPage.value = 1; // 重置到第一页
};

// 处理点击查看详情
const handleViewDetails = (rowData: LlmCombinedEvaluation) => {
  selectedLlmData.value = rowData;
  detailDialogVisible.value = true;
};

const loadAnnouncementsAndChangelog = async () => {
  isLoading.value = true;
  loadError.value = null;
  try {
    // 使用 Promise.all 并行加载
    const [announcementsResponse, changelogResponse] = await Promise.all([
      fetch(joinPath(baseUrl, "/assets/announcements.json")), // 注意路径相对于 public 目录
      fetch(joinPath(baseUrl,"/assets/changelog.json")), // 注意路径相对于 public 目录
    ]);

    if (!announcementsResponse.ok) {
      throw new Error(`无法加载公告: ${announcementsResponse.statusText}`);
    }
    if (!changelogResponse.ok) {
      throw new Error(`无法加载更新日志: ${changelogResponse.statusText}`);
    }

    // 解析 JSON 数据
    const announcements = await announcementsResponse.json();
    const changelog = await changelogResponse.json();

    // 更新 ref (确保类型正确，如果需要可以添加验证)
    announcementData.value = announcements as string[];
    changelogData.value = changelog as ChangelogEntry[];
  } catch (error: any) {
    console.error("加载公告/日志数据失败:", error);
    loadError.value = error.message || "未知错误";
  } finally {
    isLoading.value = false;
  }
};

const checkIfShowAnnouncement = () => {
  try {
    const hasSeen = localStorage.getItem(announcementStorageKey);
    if (!hasSeen) {
      // 如果 localStorage 中没有记录，或者记录不是 'true' (根据你的存储逻辑)
      showAnnouncementDialog.value = true; // 则显示对话框
    } else {
      console.log(`用户已设置 '${announcementStorageKey}'，不再自动弹出公告。`);
    }
  } catch (e) {
    console.error("无法读取 localStorage:", e);
    // 在无法访问 localStorage 的情况下，可以选择总是显示或总是不显示
    showAnnouncementDialog.value = true; // 例如，保险起见，显示出来
  }
};

// --- State ---
const showAnnouncementDialog = ref(false);
const announcementStorageKey = "hasSeenLatestAnnouncement_v1.2.1"; // 更改 key 强制显示新公告
const isLoading = ref(true); // 新增加载状态
const loadError = ref<string | null>(null); // 新增错误状态

// --- 数据 Refs (初始化为空数组) ---
const announcementData = ref<string[]>([]);
// 定义 Changelog 条目类型 (如果已在别处定义，可导入)
interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}
const changelogData = ref<ChangelogEntry[]>([]);

// --- Lifecycle Hooks ---
onMounted(async () => {
  await loadAnnouncementsAndChangelog(); // 等待数据加载完成
  if (!loadError.value) {
    // 仅在加载成功时检查是否需要显示
    checkIfShowAnnouncement();
  }
});

// --- 生命周期 ---
onMounted(() => {
  loadData();
  checkIfShowAnnouncement();
});
</script>

<style scoped>
.main-content {
  padding: 20px; /* 默认内边距 */
  max-width: 1400px; /* 默认最大宽度 */
  margin: 0 auto;
  box-sizing: border-box; /* 确保 padding 不会增加总宽度 */
  width: 100%; /* 确保占满父容器 */
}
.controls-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center; /* 垂直居中 */
  flex-wrap: wrap; /* 允许换行 */
}

/* --- 新增媒体查询 --- */
@media (max-width: 767px) {
  .main-content {
    padding: 10px; /* 减小移动端内边距 */
    max-width: none; /* 取消最大宽度限制 */
  }

  .controls-container {
    flex-direction: column; /* 改为垂直堆叠 */
    align-items: stretch; /* 让子元素宽度填满 */
    gap: 15px; /* 调整堆叠时的间距 */
  }

  /* 让 FilterControl 和按钮宽度自动 */
  .controls-container > :deep(.el-button), /* 如果 FilterControl 是根 div，可能不需要 :deep() */
  .controls-container > :deep(div) {
    /* 假设 FilterControl 是一个 div */
    width: 100%; /* 让它们占满容器宽度 */
    box-sizing: border-box;
  }
  /* 刷新按钮可能需要单独调整，让它不占满整行 */
  .controls-container > .el-button[title="刷新数据"] {
    width: auto; /* 恢复自动宽度 */
    align-self: flex-start; /* 可以让它靠右 */
    /* 或者 align-self: center; 居中 */
  }

  /* 也可以考虑让分页控件的布局在移动端更紧凑 */
  /* (这个样式可能需要在 PaginationControl.vue 中调整，或者在这里用 :deep() 覆盖) */

  :deep(.pagination-container .el-pagination) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 5px;
  }
  :deep(.pagination-container .el-pagination__total) {
    margin-right: auto;
  }
}
</style>