<template>
  <el-card shadow="hover" class="page-card">
    <template #header>
      <div class="page-header">
        <span>商品列表</span>
      </div>
    </template>
    <el-empty description="商品列表待开发"></el-empty>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped>
.page-card { border-radius: 8px; }
.page-header { font-size: 16px; font-weight: 600; }
</style>
