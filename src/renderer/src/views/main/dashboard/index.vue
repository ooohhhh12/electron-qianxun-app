<template>
  <div class="dashboard">
    <!-- 指标卡片 -->
    <el-row :gutter="16">
      <el-col :xs="12" :sm="8" :md="6" v-for="item in metrics" :key="item.label">
        <el-card shadow="hover" class="metric-card">
          <div class="metric-label">
            {{ item.label }}
            <el-tooltip content="说明" placement="top">
              <el-icon class="help-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
          <div class="metric-value">{{ item.value }}</div>
          <div class="metric-trend" :class="item.trendClass">
            <el-icon><component :is="item.trendIcon" /></el-icon>
            {{ item.trend }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-card shadow="hover" class="chart-card">
      <template #header>
        <div class="chart-header">
          <span class="chart-title">用户趋势</span>
          <el-radio-group v-model="activeTab" size="small">
            <el-radio-button label="pv">PV</el-radio-button>
            <el-radio-button label="uv">UV</el-radio-button>
            <el-radio-button label="register">注册用户</el-radio-button>
            <el-radio-button label="pay">付费用户</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="chart-placeholder">
        <div class="chart-bars">
          <div class="chart-bar" v-for="(v, i) in chartData" :key="i" :style="{ height: v + '%' }"></div>
        </div>
        <div class="chart-x">
          <span v-for="i in 7" :key="i">09-0{{ i }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { QuestionFilled, Bottom, Minus } from "@element-plus/icons-vue";

const activeTab = ref("pv");

const metrics = [
  { label: "PV", value: "32", trend: "86.03% 环比下降", trendClass: "down", trendIcon: Bottom },
  { label: "UV", value: "9", trend: "30.77% 环比下降", trendClass: "down", trendIcon: Bottom },
  { label: "注册用户数", value: "1", trend: "环比持平", trendClass: "flat", trendIcon: Minus },
  { label: "付费用户数", value: "0", trend: "100.00% 环比下降", trendClass: "down", trendIcon: Bottom },
  { label: "支付转化率", value: "0.00%", trend: "环比持平", trendClass: "flat", trendIcon: Minus },
  { label: "新用户付费人数", value: "0", trend: "环比持平", trendClass: "flat", trendIcon: Minus },
  { label: "新用户消费转化率", value: "0.00%", trend: "环比持平", trendClass: "flat", trendIcon: Minus },
  { label: "ARPU", value: "¥ 0.00", trend: "100.00% 环比下降", trendClass: "down", trendIcon: Bottom },
];

const chartData = ref([72, 58, 45, 80, 38, 25, 52]);
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-card {
  margin-bottom: 16px;
  border-radius: 8px;
}
.metric-card :deep(.el-card__body) {
  padding: 18px 20px;
}
.metric-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}
.help-icon {
  font-size: 14px;
  color: var(--el-text-color-placeholder);
  cursor: help;
}
.metric-value {
  font-size: 28px;
  font-weight: 700;
  margin: 8px 0 6px;
  color: var(--el-text-color-primary);
}
.metric-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
}
.metric-trend.down {
  color: #e74c3c;
}
.metric-trend.up {
  color: #27ae60;
}
.metric-trend.flat {
  color: var(--el-text-color-secondary);
}

.chart-card {
  border-radius: 8px;
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.chart-placeholder {
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex: 1;
  padding: 10px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  border-left: 1px solid var(--el-border-color-lighter);
  padding-left: 8px;
}
.chart-bar {
  flex: 1;
  min-height: 4px;
  background: linear-gradient(180deg, var(--el-color-primary), var(--el-color-primary-light-5));
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}
.chart-x {
  display: flex;
  gap: 16px;
  padding-left: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  flex: 1;
}
.chart-x span {
  flex: 1;
  text-align: center;
}
</style>
