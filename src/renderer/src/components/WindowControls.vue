<template>
  <div class="win-controls">
    <!-- 固定（置顶） -->
    <el-tooltip :content="alwaysOnTop ? '取消置顶' : '固定窗口'" placement="bottom">
      <el-button class="ctrl-btn" :class="{ active: alwaysOnTop }" circle size="small" @click="onToggleTop">
        <el-icon><Promotion /></el-icon>
      </el-button>
    </el-tooltip>

    <!-- 最小化 -->
    <el-tooltip content="收起" placement="bottom">
      <el-button class="ctrl-btn" circle size="small" @click="onMinimize">
        <el-icon><Minus /></el-icon>
      </el-button>
    </el-tooltip>

    <!-- 最大化 / 还原 -->
    <el-tooltip :content="isMaximized ? '还原' : '全屏'" placement="bottom">
      <el-button class="ctrl-btn" circle size="small" @click="onToggleMax">
        <el-icon v-if="isMaximized"><CopyDocument /></el-icon>
        <el-icon v-else><FullScreen /></el-icon>
      </el-button>
    </el-tooltip>

    <!-- 关闭 -->
    <el-tooltip content="关闭" placement="bottom">
      <el-button class="ctrl-btn close" circle size="small" @click="onClose">
        <el-icon><Close /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Minus, FullScreen, Close, CopyDocument, Promotion } from "@element-plus/icons-vue";

const isMaximized = ref(false);
const alwaysOnTop = ref(false);

const onMinimize = () => {
  electron.ipcRenderer.invoke("win-minimize");
};

const onToggleMax = () => {
  electron.ipcRenderer.invoke("win-toggle-max");
};

const onClose = () => {
  electron.ipcRenderer.invoke("win-close");
};

const onToggleTop = () => {
  electron.ipcRenderer.invoke("win-toggle-top");
};

const updateMaxState = (maximized: boolean) => {
  isMaximized.value = maximized;
};

const updateTopState = (top: boolean) => {
  alwaysOnTop.value = top;
};

onMounted(() => {
  // 组件挂载时监听事件
  electron.ipcRenderer.on("win-maximized", (_e, v) => updateMaxState(v));
  electron.ipcRenderer.on("win-top-changed", (_e, v) => updateTopState(v));
});

onBeforeUnmount(() => {
  // 组件卸载时移除事件监听
  electron.ipcRenderer.removeListener("win-maximized", updateMaxState);
  electron.ipcRenderer.removeListener("win-top-changed", updateTopState);
});
</script>

<style scoped>
.win-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ctrl-btn {
  width: 28px;
  height: 28px;
  background: transparent !important;
  border: none !important;
  color: var(--el-text-color-regular);
  transition:
    color 0.2s,
    background 0.2s;
}
.ctrl-btn:hover {
  color: var(--el-color-primary);
  background: var(--el-fill-color-light) !important;
}
.ctrl-btn.active {
  color: var(--el-color-primary);
}
.ctrl-btn.close:hover {
  color: #fff;
  background: #e74c3c !important;
}
.ctrl-btn :deep(.el-icon) {
  font-size: 14px;
}
</style>
