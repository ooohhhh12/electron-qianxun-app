<template>
  <div class="scenes">
    <!-- 顶部导航（与 Home / About 同风格） -->
    <header class="nav">
      <div class="nav-inner">
        <div class="brand">
          <span class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 4c-8 0-14 3-14 9 0 4 3 7 7 7 6 0 7-5 7-16z" />
              <path d="M4 21c3-5 8-8 13-10" />
            </svg>
          </span>
          <span class="brand-name">风禾千寻</span>
        </div>
        <nav class="nav-links">
          <router-link to="/home">首页</router-link>
          <router-link to="/main/dashboard">核心功能</router-link>
          <router-link to="/scenes" class="active">空间场景</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
      <div class="nav-win-controls">
        <WindowControls />
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <span class="hero-eyebrow">SPACES · 空间场景</span>
        <h1 class="hero-title">你的每一寸空间，<br/>都值得绿意盎然</h1>
        <p class="hero-sub">
          从家庭客厅到办公室角落，从小店橱窗到私人庭院，
          风禾千寻为不同场景打造最适配的绿植搭配与空间设计方案。
        </p>
        <div class="hero-actions">
          <button class="btn-primary" @click="filter = ''">浏览全部场景</button>
          <button class="btn-ghost" @click="goHome">返回首页</button>
        </div>
      </div>
      <div class="hero-orb orb-1"></div>
      <div class="hero-orb orb-2"></div>
      <div class="hero-orb orb-3"></div>
    </section>

    <!-- 筛选 tabs -->
    <section class="filter-bar">
      <div class="filter-inner">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="chip"
          :class="{ active: filter === cat.value }"
          @click="filter = cat.value"
        >
          {{ cat.label }}
        </button>
      </div>
    </section>

    <!-- 场景卡片网格 -->
    <section class="grid">
      <div
        v-for="scene in filteredScenes"
        :key="scene.title"
        class="scene-card"
        @click="onPick(scene)"
      >
        <div class="scene-visual" :style="{ background: scene.gradient }">
          <div class="scene-emoji">{{ scene.emoji }}</div>
          <div class="scene-badge">{{ scene.area }}</div>
        </div>
        <div class="scene-body">
          <h3 class="scene-title">{{ scene.title }}</h3>
          <p class="scene-desc">{{ scene.desc }}</p>
          <div class="scene-footer">
            <span class="scene-temp">{{ scene.season }}</span>
            <span class="scene-arrow">查看方案 →</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部 CTA -->
    <section class="cta">
      <div class="cta-inner">
        <h2>没找到合适的场景？</h2>
        <p>上传一张你的空间照片，AI 为你生成专属绿植搭配方案</p>
        <button class="btn-primary" @click="goAI">开启 AI 智能设计</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import WindowControls from "@renderer/components/WindowControls.vue";

interface Scene {
  title: string;
  desc: string;
  emoji: string;
  area: string;
  season: string;
  category: string;
  gradient: string;
}

const router = useRouter();
const filter = ref("");

const categories = [
  { label: "全部", value: "" },
  { label: "家庭空间", value: "home" },
  { label: "办公空间", value: "office" },
  { label: "商业空间", value: "shop" },
  { label: "户外庭院", value: "outdoor" },
];

const scenes: Scene[] = [
  { title: "清新北欧客厅", desc: "龟背竹 + 琴叶榕 + 常春藤，打造柔和自然光感", emoji: "🌿", area: "15–25㎡", season: "四季皆宜", category: "home", gradient: "linear-gradient(135deg, #a8d5a2 0%, #6bb56a 100%)" },
  { title: "禅意日式茶室", desc: "赤松 + 观音莲 + 苔玉，静谧中见生机", emoji: "🌳", area: "8–15㎡", season: "四季皆宜", category: "home", gradient: "linear-gradient(135deg, #8cb89b 0%, #4f8b6a 100%)" },
  { title: "温馨卧室角落", desc: "虎皮兰 + 多肉组合，夜间释放氧气助眠", emoji: "🌱", area: "3–6㎡", season: "四季皆宜", category: "home", gradient: "linear-gradient(135deg, #c5e1b6 0%, #86b074 100%)" },
  { title: "书香气书房", desc: "文竹 + 发财树 + 绿萝藤，陪你度过阅读时光", emoji: "📚", area: "6–10㎡", season: "四季皆宜", category: "home", gradient: "linear-gradient(135deg, #b8d4a8 0%, #5d9462 100%)" },
  { title: "阳光阳台花园", desc: "矮牵牛 + 铁线莲 + 月季，花开三季不间断", emoji: "🌻", area: "4–12㎡", season: "春/夏/秋", category: "home", gradient: "linear-gradient(135deg, #f0d68a 0%, #d69e4a 100%)" },
  { title: "现代办公室工位", desc: "多肉拼盘 + 空气凤梨 + 水培绿萝，养眼又好养", emoji: "🪴", area: "桌面", season: "四季皆宜", category: "office", gradient: "linear-gradient(135deg, #a6cfa0 0%, #589860 100%)" },
  { title: "开放办公区", desc: "琴叶榕 + 龟背竹 + 尤加利，让团队呼吸更自由", emoji: "🏢", area: "50–100㎡", season: "四季皆宜", category: "office", gradient: "linear-gradient(135deg, #9dc69c 0%, #4d8658 100%)" },
  { title: "玻璃幕墙大堂", desc: "大型橡皮树 + 散尾葵 + 龙血树，气势与格调并存", emoji: "🌴", area: "80–200㎡", season: "四季皆宜", category: "office", gradient: "linear-gradient(135deg, #88c39a 0%, #3f7b55 100%)" },
  { title: "文艺咖啡店", desc: "绿萝垂吊 + 多肉墙 + 香草盆栽，治愈每位顾客", emoji: "☕", area: "30–60㎡", season: "四季皆宜", category: "shop", gradient: "linear-gradient(135deg, #d7c5a0 0%, #9e8b5a 100%)" },
  { title: "精品服装店", desc: "白色花艺 + 尤加利叶 + 琴叶榕，衬托服饰质感", emoji: "🛍️", area: "20–40㎡", season: "四季皆宜", category: "shop", gradient: "linear-gradient(135deg, #e8ddc0 0%, #b3a27a 100%)" },
  { title: "餐饮店面橱窗", desc: "吊盆绿萝 + 多肉组 + 花艺插条，路过即被吸引", emoji: "🍃", area: "橱窗位", season: "四季皆宜", category: "shop", gradient: "linear-gradient(135deg, #b7d79f 0%, #64955d 100%)" },
  { title: "新中式庭院", desc: "松 + 竹 + 梅 + 小景石，一步一景皆成画", emoji: "🏯", area: "30–80㎡", season: "四季皆有景", category: "outdoor", gradient: "linear-gradient(135deg, #a0c9a0 0%, #4a8252 100%)" },
  { title: "简约现代露台", desc: "绣球 + 凌霄 + 多肉花坛，夜晚灯光下自成风景", emoji: "🌙", area: "20–50㎡", season: "春/夏/秋", category: "outdoor", gradient: "linear-gradient(135deg, #b8d4b4 0%, #55895e 100%)" },
  { title: "小型私人花园", desc: "月季 + 绣球 + 迷迭香，花香满园四季有别", emoji: "🌸", area: "40–100㎡", season: "春/夏/秋", category: "outdoor", gradient: "linear-gradient(135deg, #e4b6c8 0%, #b36a87 100%)" },
];

const filteredScenes = computed(() =>
  filter.value ? scenes.filter((s) => s.category === filter.value) : scenes
);

const onPick = (scene: Scene) => {
  ElMessage.info(`「${scene.title}」方案详情开发中，敬请期待`);
};

const goHome = () => router.push("/home");
const goAI = () => router.push("/main/dashboard");
</script>

<style scoped>
.scenes {
  min-height: 100vh;
  background: var(--fh-bg);
  color: var(--fh-ink);
  overflow-x: hidden;
}

/* ---------- 导航（与 Home 风格一致）---------- */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--fh-line);
  -webkit-app-region: drag;
}
.nav-links { -webkit-app-region: no-drag; }
.nav-win-controls {
  -webkit-app-region: no-drag;
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  z-index: 60;
}
.nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  gap: 40px;
}
@media (max-width: 1280px) {
  .nav-inner { padding-right: 170px; }
}

.brand { display: flex; align-items: center; gap: 10px; }
.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #fff;
  background: linear-gradient(135deg, var(--fh-primary), var(--fh-primary-deep));
  box-shadow: 0 6px 16px rgba(46, 126, 72, 0.35);
}
.brand-mark svg { width: 20px; height: 20px; }
.brand-name {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 28px;
  margin-left: auto;
}
.nav-links a {
  color: var(--fh-ink-2);
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-links a:hover { color: var(--fh-primary-deep); }
.nav-links a.active {
  color: var(--fh-primary-deep);
  position: relative;
}
.nav-links a.active::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--fh-primary-deep);
  border-radius: 2px;
}

/* ---------- 按钮 ---------- */
.btn-primary {
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, var(--fh-primary), var(--fh-primary-deep));
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 24px;
  font-size: 15px;
  transition: transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 8px 20px rgba(46, 126, 72, 0.28);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(46, 126, 72, 0.36);
}
.btn-ghost {
  border: 1px solid var(--fh-line);
  cursor: pointer;
  color: var(--fh-ink);
  background: #fff;
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 24px;
  font-size: 15px;
  transition: border-color 0.2s, transform 0.15s;
}
.btn-ghost:hover {
  border-color: var(--fh-primary);
  transform: translateY(-2px);
}

/* ---------- Hero ---------- */
.hero {
  position: relative;
  overflow: hidden;
  padding: 96px 28px 72px;
  background: linear-gradient(180deg, #eff7ef 0%, var(--fh-bg) 100%);
}
.hero-inner {
  max-width: 1120px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.hero-eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--fh-primary-deep);
  letter-spacing: 2px;
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(46, 126, 72, 0.08);
  margin-bottom: 20px;
}
.hero-title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: var(--fh-ink);
}
.hero-title span, .hero-title em {
  color: var(--fh-primary-deep);
  font-style: normal;
  background: linear-gradient(135deg, var(--fh-primary), var(--fh-primary-deep));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-sub {
  margin-top: 18px;
  font-size: 17px;
  color: var(--fh-ink-2);
  max-width: 580px;
  line-height: 1.7;
}
.hero-actions {
  margin-top: 32px;
  display: flex;
  gap: 12px;
}

/* 背景装饰圆球 */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.45;
  z-index: 1;
}
.orb-1 {
  width: 280px; height: 280px;
  background: radial-gradient(circle, #bde5b8 0%, transparent 70%);
  top: -40px; right: -60px;
}
.orb-2 {
  width: 180px; height: 180px;
  background: radial-gradient(circle, #f0e7a8 0%, transparent 70%);
  bottom: -20px; right: 20%;
}
.orb-3 {
  width: 120px; height: 120px;
  background: radial-gradient(circle, #c9e7e5 0%, transparent 70%);
  top: 40%; right: 10%;
}

/* ---------- 筛选 Tabs ---------- */
.filter-bar {
  position: sticky;
  top: 56px;
  z-index: 40;
  background: var(--fh-bg);
  border-bottom: 1px solid var(--fh-line);
  padding: 16px 28px;
}
.filter-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.chip {
  border: 1px solid var(--fh-line);
  background: #fff;
  color: var(--fh-ink-2);
  font-size: 14px;
  font-weight: 500;
  padding: 8px 18px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.2s;
}
.chip:hover {
  color: var(--fh-primary-deep);
  border-color: var(--fh-primary);
}
.chip.active {
  background: linear-gradient(135deg, var(--fh-primary), var(--fh-primary-deep));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(46, 126, 72, 0.25);
}

/* ---------- 卡片网格 ---------- */
.grid {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 28px 56px;
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
.scene-card {
  background: #fff;
  border: 1px solid var(--fh-line);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s;
  display: flex;
  flex-direction: column;
}
.scene-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(46, 126, 72, 0.15);
  border-color: var(--fh-primary);
}
.scene-visual {
  position: relative;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.scene-emoji {
  font-size: 56px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
  transition: transform 0.3s;
}
.scene-card:hover .scene-emoji {
  transform: scale(1.15) rotate(-4deg);
}
.scene-badge {
  position: absolute;
  bottom: 10px;
  left: 12px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(6px);
  color: var(--fh-primary-deep);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
}
.scene-body { padding: 18px 20px 20px; flex: 1; display: flex; flex-direction: column; }
.scene-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--fh-ink);
  margin-bottom: 6px;
}
.scene-desc {
  font-size: 13.5px;
  color: var(--fh-ink-2);
  line-height: 1.6;
  flex: 1;
}
.scene-footer {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12.5px;
}
.scene-temp { color: var(--fh-ink-3); }
.scene-arrow {
  color: var(--fh-primary-deep);
  font-weight: 600;
  transition: transform 0.2s;
}
.scene-card:hover .scene-arrow { transform: translateX(3px); }

/* ---------- 底部 CTA ---------- */
.cta {
  padding: 60px 28px 80px;
  background: linear-gradient(180deg, var(--fh-bg) 0%, #f2f9f2 100%);
  text-align: center;
}
.cta-inner {
  max-width: 560px;
  margin: 0 auto;
}
.cta-inner h2 {
  font-size: 26px;
  font-weight: 700;
  color: var(--fh-ink);
  margin-bottom: 10px;
}
.cta-inner p {
  color: var(--fh-ink-2);
  font-size: 15px;
  margin-bottom: 24px;
  line-height: 1.6;
}
</style>
