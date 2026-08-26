<template>
  <div class="home">
    <!-- 顶部导航 -->
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
          <a href="#features">核心功能</a>
          <a href="#scenes">空间场景</a>
          <a href="#" @click.prevent="goDetail()">关于我们</a>
        </nav>
        <button class="btn-primary nav-cta" @click="goDetail()">立即体验</button>
      </div>
    </header>

    <!-- 首屏 Hero -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="hero-badge">
            <i></i> 全场景绿植搭配 · 园林空间设计
          </span>
          <h1 class="hero-title">
            每个空间，<br />皆有<span>风禾绿意</span>
          </h1>
          <p class="hero-sub">
            风禾千寻，一站式覆盖家庭、室内、商业全空间绿植设计需求。从方案灵感到 AI
            智能设计，从植物识别到养护管理，让每一寸空间都生机盎然。
          </p>
          <div class="hero-actions">
            <button class="btn-primary btn-lg" @click="goDetail('ai')">开始智能设计</button>
            <button class="btn-ghost btn-lg" @click="scrollToFeatures">浏览方案灵感</button>
          </div>
          <div class="hero-users">
            <span class="users-label">服务对象</span>
            <span class="user-chip">普通用户</span>
            <span class="user-chip">绿植爱好者</span>
            <span class="user-chip">小微商户</span>
            <span class="user-chip">园艺设计师</span>
          </div>
        </div>

        <div class="hero-visual">
          <div class="float-leaf leaf-1" aria-hidden="true"></div>
          <div class="float-leaf leaf-2" aria-hidden="true"></div>
          <div class="plant-card">
            <div class="plant-card-head">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="tag">AI 生成方案</span>
            </div>
            <div class="plant-illustration">
              <svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
                <path class="pot" d="M70 148h60l-6 34H76l-6-34z" />
                <path class="stem" d="M100 148c0-28 0-52 0-60" stroke-linecap="round" stroke-width="5" />
                <path class="leaf l3" d="M100 96C82 96 70 84 70 68c0-16 13-28 30-28 18 0 30 13 30 30 0 14-12 26-30 26z" />
                <path class="leaf l4" d="M100 118c-14 0-24-10-24-23 0-12 10-21 24-21 13 0 23 9 23 21 0 13-10 23-23 23z" />
                <path class="leaf l5" d="M100 78c10-14 26-20 40-16" stroke-linecap="round" stroke-width="4" />
              </svg>
            </div>
            <div class="plant-card-foot">
              <span class="foot-title">清新北欧客厅</span>
              <span class="foot-desc">龟背竹 · 琴叶榕 · 常春藤</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据条 -->
    <section class="stats">
      <div class="stat">
        <span class="stat-num">3</span>
        <span class="stat-label">全空间场景</span>
      </div>
      <div class="stat">
        <span class="stat-num">6</span>
        <span class="stat-label">核心功能</span>
      </div>
      <div class="stat">
        <span class="stat-num">4</span>
        <span class="stat-label">服务人群</span>
      </div>
      <div class="stat">
        <span class="stat-num">∞</span>
        <span class="stat-label">绿意灵感</span>
      </div>
    </section>

    <!-- 核心功能 -->
    <section id="features" class="features">
      <div class="section-head">
        <span class="section-eyebrow">一站式解决方案</span>
        <h2 class="section-title">六大能力，装点每个空间</h2>
        <p class="section-desc">点击任意功能卡片，查看详细能力介绍</p>
      </div>
      <div class="feature-grid">
        <article
          v-for="f in features"
          :key="f.id"
          class="feature-card"
          @click="goDetail(f.id)"
        >
          <div class="feature-icon" v-html="f.icon"></div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-desc">{{ f.desc }}</p>
          <span class="feature-more">
            查看详情
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </article>
      </div>
    </section>

    <!-- 空间场景 -->
    <section id="scenes" class="scenes">
      <div class="section-head">
        <span class="section-eyebrow">空间场景</span>
        <h2 class="section-title">家庭 · 室内 · 商业，全覆盖</h2>
        <p class="section-desc">不再是单一的阳台、庭院工具，风禾千寻适配每一种生活与经营场景</p>
      </div>
      <div class="scene-grid">
        <div class="scene-card scene-family" @click="goDetail('space')">
          <span class="scene-icon">🏡</span>
          <h3>家庭空间</h3>
          <p>阳台、客厅、卧室的绿植软装搭配，打造会呼吸的家。</p>
        </div>
        <div class="scene-card scene-indoor" @click="goDetail('space')">
          <span class="scene-icon">🪴</span>
          <h3>室内空间</h3>
          <p>办公、书房等室内环境的空气净化与美学绿意方案。</p>
        </div>
        <div class="scene-card scene-biz" @click="goDetail('space')">
          <span class="scene-icon">🏬</span>
          <h3>商业空间</h3>
          <p>门店、展厅、餐厅等商业场景的绿植景观设计定制。</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-inner">
        <h2>准备好了吗？</h2>
        <p>让风禾千寻，为你的每一个空间注入绿意。</p>
        <button class="btn-light btn-lg" @click="goDetail()">了解更多</button>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="brand">
          <span class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 4c-8 0-14 3-14 9 0 4 3 7 7 7 6 0 7-5 7-16z" />
              <path d="M4 21c3-5 8-8 13-10" />
            </svg>
          </span>
          <span class="brand-name">风禾千寻</span>
        </div>
        <p class="footer-slogan">每个空间，皆有风禾绿意</p>
        <p class="footer-copy">© 2026 风禾千寻 · 全场景绿植搭配与园林空间设计</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goDetail = (feature?: string) => {
  router.push({ path: '/about', query: feature ? { feature } : {} })
}

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

const features = [
  {
    id: 'inspiration',
    title: '方案灵感',
    desc: '精选海量绿植搭配与空间设计方案，随时为你的灵感充电。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.7 1.3 1.4 1.5 2.5h5c.2-1.1.7-1.8 1.5-2.5A6 6 0 0 0 12 3z"/></svg>'
  },
  {
    id: 'space',
    title: '空间绿植搭配',
    desc: '家庭、室内、商业全空间适配，智能匹配最合适的绿植组合。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>'
  },
  {
    id: 'ai',
    title: 'AI 智能设计',
    desc: '输入空间需求，AI 一键生成专属绿植搭配与摆放方案。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.4z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/><path d="M5 3l.6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6z"/></svg>'
  },
  {
    id: 'identify',
    title: '植物识别',
    desc: '拍照即识，秒速掌握植物名称、习性与养护要点。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-8 0-14 3-14 9 0 4 3 7 7 7 6 0 7-5 7-16z"/><path d="M4 21c3-5 8-8 13-10"/></svg>'
  },
  {
    id: 'care',
    title: '养护管理',
    desc: '浇水、施肥、光照智能提醒，让每一株植物被温柔照顾。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/></svg>'
  },
  {
    id: 'designer',
    title: '设计师定制',
    desc: '专业园艺设计师一对一服务，量身定制高端绿植方案。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>'
  }
]
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--fh-bg);
  color: var(--fh-ink);
  overflow-x: hidden;
}

/* ---------- 导航 ---------- */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid var(--fh-line);
}
.nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 28px;
  display: flex;
  align-items: center;
  gap: 40px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
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
.brand-mark svg {
  width: 20px;
  height: 20px;
}
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
.nav-links a:hover {
  color: var(--fh-primary-deep);
}
.nav-cta {
  margin-left: 8px;
}

/* ---------- 按钮 ---------- */
.btn-primary {
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, var(--fh-primary), var(--fh-primary-deep));
  border-radius: 12px;
  font-weight: 600;
  transition: transform 0.15s, box-shadow 0.2s;
  box-shadow: 0 8px 20px rgba(46, 126, 72, 0.28);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(46, 126, 72, 0.36);
}
.nav-cta.btn-primary {
  padding: 10px 20px;
  font-size: 14px;
}
.btn-ghost {
  border: 1px solid var(--fh-line);
  cursor: pointer;
  color: var(--fh-ink);
  background: #fff;
  border-radius: 12px;
  font-weight: 600;
  transition: border-color 0.2s, transform 0.15s;
}
.btn-ghost:hover {
  border-color: var(--fh-primary);
  transform: translateY(-2px);
}
.btn-lg {
  padding: 14px 28px;
  font-size: 16px;
}
.btn-light {
  border: none;
  cursor: pointer;
  color: var(--fh-primary-deep);
  background: #fff;
  border-radius: 14px;
  font-weight: 700;
  transition: transform 0.15s;
}
.btn-light:hover {
  transform: translateY(-2px);
}

/* ---------- Hero ---------- */
.hero {
  position: relative;
  padding: 72px 0 84px;
  background: linear-gradient(180deg, #f2f9f2 0%, var(--fh-bg) 100%);
}
.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(600px 320px at 85% 15%, rgba(62, 142, 90, 0.14), transparent 70%),
    radial-gradient(500px 300px at 8% 80%, rgba(231, 161, 60, 0.12), transparent 70%);
  pointer-events: none;
}
.hero-inner {
  position: relative;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 28px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  align-items: center;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid var(--fh-line);
  color: var(--fh-primary-deep);
  font-size: 13px;
  font-weight: 600;
  box-shadow: var(--fh-shadow);
}
.hero-badge i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--fh-primary);
  box-shadow: 0 0 0 4px rgba(62, 142, 90, 0.16);
}
.hero-title {
  margin: 22px 0 20px;
  font-size: 52px;
  line-height: 1.18;
  font-weight: 800;
  letter-spacing: 0.5px;
}
.hero-title span {
  color: var(--fh-primary-deep);
  background: linear-gradient(135deg, var(--fh-primary), #1c4a2e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-sub {
  font-size: 17px;
  line-height: 1.8;
  color: var(--fh-ink-2);
  max-width: 520px;
}
.hero-actions {
  display: flex;
  gap: 14px;
  margin-top: 28px;
}
.hero-users {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 30px;
}
.users-label {
  font-size: 13px;
  color: var(--fh-ink-3);
  margin-right: 2px;
}
.user-chip {
  font-size: 13px;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--fh-mint);
  color: var(--fh-primary-deep);
  font-weight: 600;
}

/* 视觉卡片 */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
}
.plant-card {
  width: 300px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 30px 60px rgba(30, 80, 45, 0.16);
  padding: 20px 20px 22px;
  transform: rotate(2deg);
  transition: transform 0.3s;
}
.plant-card:hover {
  transform: rotate(0deg) translateY(-6px);
}
.plant-card-head {
  display: flex;
  align-items: center;
  gap: 6px;
}
.plant-card-head .dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #d9e6dc;
}
.plant-card-head .dot:nth-child(1) {
  background: #e78c8c;
}
.plant-card-head .dot:nth-child(2) {
  background: #e7c26c;
}
.plant-card-head .dot:nth-child(3) {
  background: #8cd0a0;
}
.plant-card-head .tag {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  color: var(--fh-primary-deep);
  background: var(--fh-mint);
  padding: 4px 10px;
  border-radius: 999px;
}
.plant-illustration {
  margin: 8px auto 4px;
  width: 220px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #f4faf4, #e9f4ea);
  border-radius: 18px;
}
.plant-illustration svg {
  width: 100%;
  height: 100%;
}
.plant-illustration .pot {
  fill: #e7a13c;
}
.plant-illustration .stem {
  stroke: #3e8e5a;
}
.plant-illustration .leaf {
  stroke: #3e8e5a;
  fill: #5faf78;
}
.plant-card-foot {
  margin-top: 12px;
  text-align: left;
}
.foot-title {
  display: block;
  font-weight: 700;
  font-size: 15px;
}
.foot-desc {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: var(--fh-ink-3);
}
.float-leaf {
  position: absolute;
  border-radius: 60% 40% 60% 40%;
  background: linear-gradient(135deg, #5faf78, #3e8e5a);
  opacity: 0.7;
}
.leaf-1 {
  width: 54px;
  height: 34px;
  top: -22px;
  right: 20px;
  transform: rotate(28deg);
  animation: float 5s ease-in-out infinite;
}
.leaf-2 {
  width: 40px;
  height: 26px;
  bottom: 30px;
  left: -8px;
  transform: rotate(-18deg);
  background: linear-gradient(135deg, #8ed4a1, #5faf78);
  animation: float 6s ease-in-out infinite reverse;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(28deg);
  }
  50% {
    transform: translateY(-14px) rotate(28deg);
  }
}
@keyframes float2 {
  0%,
  100% {
    transform: translateY(0) rotate(-18deg);
  }
  50% {
    transform: translateY(-12px) rotate(-18deg);
  }
}
.leaf-2 {
  animation-name: float2;
}

/* ---------- 数据条 ---------- */
.stats {
  max-width: 1120px;
  margin: -30px auto 0;
  padding: 0 28px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.stat {
  background: #fff;
  border-radius: var(--fh-radius);
  box-shadow: var(--fh-shadow);
  padding: 26px 20px;
  text-align: center;
}
.stat-num {
  display: block;
  font-size: 32px;
  font-weight: 800;
  color: var(--fh-primary-deep);
}
.stat-label {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  color: var(--fh-ink-2);
}

/* ---------- 通用 section ---------- */
.features,
.scenes {
  max-width: 1120px;
  margin: 0 auto;
  padding: 88px 28px 0;
}
.section-head {
  text-align: center;
  margin-bottom: 48px;
}
.section-eyebrow {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  color: var(--fh-primary);
  letter-spacing: 2px;
  margin-bottom: 12px;
}
.section-title {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.5px;
}
.section-desc {
  margin-top: 14px;
  font-size: 15px;
  color: var(--fh-ink-2);
}

/* ---------- 功能卡片 ---------- */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature-card {
  background: #fff;
  border: 1px solid var(--fh-line);
  border-radius: var(--fh-radius);
  padding: 30px 26px;
  cursor: pointer;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
}
.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(62, 142, 90, 0.4);
  box-shadow: 0 24px 44px rgba(30, 80, 45, 0.12);
}
.feature-icon {
  width: 54px;
  height: 54px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  color: var(--fh-primary-deep);
  background: var(--fh-mint);
  margin-bottom: 20px;
}
.feature-icon :deep(svg) {
  width: 28px;
  height: 28px;
}
.feature-title {
  font-size: 19px;
  font-weight: 700;
}
.feature-desc {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--fh-ink-2);
  min-height: 48px;
}
.feature-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  font-size: 14px;
  font-weight: 700;
  color: var(--fh-primary);
}
.feature-more svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}
.feature-card:hover .feature-more svg {
  transform: translateX(4px);
}

/* ---------- 场景 ---------- */
.scene-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.scene-card {
  border-radius: var(--fh-radius);
  padding: 34px 28px;
  cursor: pointer;
  color: #fff;
  position: relative;
  overflow: hidden;
  transition: transform 0.22s;
}
.scene-card:hover {
  transform: translateY(-8px);
}
.scene-family {
  background: linear-gradient(150deg, #4d9a67, #2c6e44);
}
.scene-indoor {
  background: linear-gradient(150deg, #5aa98a, #2f6e5a);
}
.scene-biz {
  background: linear-gradient(150deg, #7fae62, #4a7d3f);
}
.scene-icon {
  font-size: 38px;
}
.scene-card h3 {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 700;
}
.scene-card p {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.92;
}

/* ---------- CTA ---------- */
.cta {
  max-width: 1120px;
  margin: 88px auto 0;
  padding: 0 28px;
}
.cta-inner {
  background: linear-gradient(135deg, #2c6e44, #1c4a2e);
  border-radius: 28px;
  padding: 60px 40px;
  text-align: center;
  color: #fff;
}
.cta-inner h2 {
  font-size: 34px;
  font-weight: 800;
}
.cta-inner p {
  margin-top: 12px;
  font-size: 16px;
  opacity: 0.9;
}
.cta-inner .btn-light {
  margin-top: 26px;
}

/* ---------- 页脚 ---------- */
.footer {
  margin-top: 88px;
  background: #14271a;
  color: #d7e6d9;
}
.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 44px 28px;
  text-align: center;
}
.footer .brand {
  justify-content: center;
}
.footer .brand-name {
  color: #fff;
}
.footer-slogan {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #b9dcc0;
}
.footer-copy {
  margin-top: 8px;
  font-size: 13px;
  color: #7d9982;
}

/* ---------- 响应式 ---------- */
@media (max-width: 860px) {
  .hero-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-copy {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-sub {
    max-width: none;
  }
  .hero-actions {
    justify-content: center;
  }
  .hero-users {
    justify-content: center;
  }
  .feature-grid,
  .scene-grid {
    grid-template-columns: 1fr 1fr;
  }
  .nav-links {
    display: none;
  }
}
@media (max-width: 600px) {
  .hero-title {
    font-size: 38px;
  }
  .feature-grid,
  .scene-grid,
  .stats {
    grid-template-columns: 1fr;
  }
  .stats {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
