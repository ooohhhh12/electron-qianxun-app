<template>
  <el-container class="main-layout">
    <!-- 侧边栏 -->
    <el-aside :width="collapse ? '64px' : '210px'" class="aside">
      <div class="logo" @click="router.push('/home')">
        <el-icon :size="24" color="#fff"><Promotion /></el-icon>
        <span v-if="!collapse" class="logo-text">风禾千寻</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :default-openeds="openedMenus"
        :collapse="collapse"
        :collapse-transition="false"
        router
        background-color="var(--el-bg-color-overlay)"
        text-color="var(--el-text-color-regular)"
        active-text-color="var(--el-color-primary)"
      >
        <template v-for="item in menuTree" :key="item.path">
          <!-- 无子菜单：直接渲染 -->
          <el-menu-item v-if="!item.children || item.children.length === 0" :index="item.path">
            <el-icon><component :is="resolveIcon(item.icon)" /></el-icon>
            <template #title>{{ item.name }}</template>
          </el-menu-item>
          <!-- 有子菜单：用 el-sub-menu -->
          <el-sub-menu v-else :index="item.path">
            <template #title>
              <el-icon><component :is="resolveIcon(item.icon)" /></el-icon>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.path" :index="child.path">
              {{ child.name }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>

    <!-- 主区域 -->
    <el-container>
      <!-- 顶部 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="collapse = !collapse">
            <Fold v-if="!collapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="parentTitle">{{ parentTitle }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32">A</el-avatar>
              <span class="username">admin</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <WindowControls />
        </div>
      </el-header>

      <!-- 内容 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { DataAnalysis, User, Goods, Wallet, Setting, Fold, Expand, Promotion } from "@element-plus/icons-vue";
import { useAuth } from "@renderer/hooks/useAuth";
import WindowControls from "@renderer/components/WindowControls.vue";

const route = useRoute();
const router = useRouter();

const { menuTree, logout } = useAuth();

const collapse = ref(false);
const activeMenu = computed(() => route.path);

// —— 图标注册表：把接口返回的 icon 字符串映射到组件 ——
const iconMap: Record<string, any> = {
  DataAnalysis,
  User,
  Goods,
  Wallet,
  Setting,
};
const resolveIcon = (iconName: string) => iconMap[iconName] || DataAnalysis;

// —— 面包屑：当前页面标题 & 父级菜单标题 ——
const { currentTitle, parentTitle, openedMenus } = computed(() => {
  const path = route.path;
  let parent = "";
  let child = "";
  const opened: string[] = [];

  for (const top of menuTree.value) {
    if (top.path === path) {
      child = top.name;
      break;
    }
    if (top.children) {
      const found = top.children.find((c) => c.path === path);
      if (found) {
        parent = top.name;
        child = found.name;
        opened.push(top.path);
        break;
      }
    }
  }
  return { currentTitle: child, parentTitle: parent, openedMenus: opened };
});

const handleCommand = async (cmd: string) => {
  if (cmd === "logout") {
    await ElMessageBox.confirm("确认退出登录？", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    });
    await logout();
  }
};
</script>

<style scoped>
.main-layout {
  height: 100vh;
  background-color: var(--el-bg-color);
}

.aside {
  background-color: var(--el-bg-color-overlay);
  border-right: 1px solid var(--el-border-color-lighter);
  transition: width 0.2s;
  overflow: hidden;
}

.logo {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
  cursor: pointer;
  transition: opacity 0.2s;
}
.logo:hover {
  opacity: 0.9;
}
.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  white-space: nowrap;
}

.aside :deep(.el-menu) {
  border-right: none;
}

.aside :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

/* header */
.header {
  background-color: var(--el-bg-color-overlay);
  border-bottom: 1px solid var(--el-border-color-lighter);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
  /* 无边框窗口：顶部栏中间空白区域可拖拽 */
  -webkit-app-region: drag;
}
/* 可交互元素禁止拖拽，保证点击生效 */
.header-left,
.header-right {
  -webkit-app-region: no-drag;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: var(--el-text-color-regular);
}
.collapse-btn:hover {
  color: var(--el-color-primary);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--el-text-color-primary);
}
.username {
  font-size: 14px;
}

/* content */
.main-content {
  padding: 20px;
  background-color: var(--el-fill-color-lighter);
  overflow-y: auto;
}
</style>
