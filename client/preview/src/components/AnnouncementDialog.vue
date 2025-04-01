<template>
  <el-dialog
    :model-value="visible"
    @update:modelValue="$emit('update:visible', $event)"
    title="公告与更新日志"
    width="70%"
    :before-close="handleBeforeClose"
    append-to-body
    class="announcement-dialog"
    destroy-on-close
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane label="最新公告" name="announcements">
        <div class="tab-content">
          <div v-if="announcements && announcements.length > 0">
            <ul>
              <li v-for="(item, index) in announcements" :key="`ann-${index}`">
                <!-- 假设公告是简单字符串，如果结构复杂请调整 -->
                <p>{{ item }}</p>
              </li>
            </ul>
          </div>
          <el-empty v-else description="暂无最新公告"></el-empty>
        </div>
      </el-tab-pane>

      <el-tab-pane label="更新日志" name="changelog">
        <div class="tab-content">
          <div v-if="changelog && changelog.length > 0">
            <div
              v-for="entry in changelog"
              :key="entry.version"
              class="changelog-entry"
            >
              <h4>
                <code>{{ entry.version }}</code>
                <span class="changelog-date"> - {{ entry.date }}</span>
              </h4>
              <ul>
                <li
                  v-for="(change, idx) in entry.changes"
                  :key="`change-${idx}`"
                >
                  {{ change }}
                </li>
              </ul>
            </div>
          </div>
          <el-empty v-else description="暂无更新日志"></el-empty>
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <span class="dialog-footer">
        <el-checkbox
          v-model="dontShowAgain"
          label="不再自动弹出"
          size="large"
          style="margin-right: 15px"
        />
        <el-button type="primary" @click="handleClose">我知道了</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ElDialog,
  ElTabs,
  ElTabPane,
  ElEmpty,
  ElCheckbox,
  ElButton,
} from "element-plus"; // 导入 Element Plus 组件

// 定义 Changelog 条目类型 (根据你的实际数据结构调整)
interface ChangelogEntry {
  version: string;
  date: string; // 格式如 'YYYY-MM-DD'
  changes: string[];
}

// --- Props ---
const props = defineProps<{
  visible: boolean; // 由 v-model 控制
  announcements?: string[]; // 公告列表 (简单字符串数组)
  changelog?: ChangelogEntry[]; // 更新日志列表
  storageKey?: string; // 用于 localStorage 的键名，判断是否不再显示
}>();

// --- Emits ---
const emit = defineEmits(["update:visible"]);

// --- State ---
const activeTab = ref("announcements"); // 默认显示公告
const dontShowAgain = ref(false); // “不再显示”复选框状态

// --- Methods ---
const handleClose = () => {
  if (dontShowAgain.value && props.storageKey) {
    try {
      // 可以存储 'true' 或一个版本号/时间戳，用于更复杂的逻辑
      localStorage.setItem(props.storageKey, "true");
    } catch (e) {
      console.error("无法写入 localStorage:", e);
      // 可以在这里给用户一个提示
    }
  }
  emit("update:visible", false); // 关闭对话框
};

// el-dialog 的 before-close 钩子，处理点击关闭图标或按 ESC 的情况
const handleBeforeClose = (done: () => void) => {
  // 如果希望点击关闭图标时也检查 "不再显示"，可以在这里调用 handleClose
  // 但通常用户的意图是本次关闭，所以直接调用 done() 关闭即可
  // 如果需要和按钮行为一致：
  // handleClose(); // 这会触发 emit('update:visible', false)，done() 就不需要了
  // return; // 阻止默认的 done() 调用

  // 简单处理：直接关闭
  done();
};
</script>

<style scoped>
.tab-content {
  max-height: 60vh; /* 限制内容最大高度 */
  overflow-y: auto; /* 超出时显示滚动条 */
  padding: 0 10px; /* 左右留点空隙 */
}

.changelog-entry {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.changelog-entry:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.changelog-entry h4 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 1.1em;
}

.changelog-date {
  font-size: 0.9em;
  color: #888;
  font-weight: normal;
}

.changelog-entry ul,
.tab-content ul {
  padding-left: 20px; /* 列表缩进 */
  margin-top: 5px;
}

.changelog-entry li,
.tab-content li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end; /* 按钮靠右 */
  align-items: center; /* 垂直居中 */
}

/* 可以根据需要调整对话框样式 */
.announcement-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>