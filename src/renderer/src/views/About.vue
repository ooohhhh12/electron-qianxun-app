<template>
  <div class="about">
    <!-- 顶部导航 -->
    <header class="nav">
      <div class="nav-inner">
        <button class="back" @click="goHome">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          返回首页
        </button>
        <div class="brand">
          <span class="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 4c-8 0-14 3-14 9 0 4 3 7 7 7 6 0 7-5 7-16z" />
              <path d="M4 21c3-5 8-8 13-10" />
            </svg>
          </span>
          <span class="brand-name">风禾千寻</span>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <span class="hero-eyebrow">关于我们 · ABOUT US</span>
        <h1 class="hero-title">每个空间，皆有风禾绿意</h1>
        <p class="hero-sub">
          风禾千寻是一款全场景绿植搭配与园林空间设计 APP，区别于单一阳台、庭院工具类软件，
          覆盖家庭、室内、商业全空间绿植设计需求。为普通用户、绿植爱好者、小微商户、园艺设计师，
          提供一站式绿植解决方案。
        </p>
      </div>
    </section>

    <!-- 选中功能详情 -->
    <section v-if="activeFeature" class="detail">
      <div class="detail-card">
        <span class="detail-badge">正在查看</span>
        <div class="detail-icon" v-html="activeFeature.icon"></div>
        <div class="detail-body">
          <h2>{{ activeFeature.title }}</h2>
          <p>{{ activeFeature.desc }}</p>
          <p class="detail-extra">{{ activeFeature.extra }}</p>
        </div>
        <button class="btn-primary" @click="goHome">体验此功能</button>
      </div>
    </section>

    <!-- 品牌故事 -->
    <section class="story">
      <div class="section-head">
        <span class="section-eyebrow">品牌理念</span>
        <h2 class="section-title">为什么是风禾千寻？</h2>
      </div>
      <div class="story-grid">
        <div class="story-card">
          <span class="story-num">01</span>
          <h3>全场景覆盖</h3>
          <p>不止于阳台与庭院，家庭、室内、商业空间一网打尽，让绿意无处不在。</p>
        </div>
        <div class="story-card">
          <span class="story-num">02</span>
          <h3>AI 赋能设计</h3>
          <p>AI 智能设计引擎，将空间尺寸、光照、风格转化为可落地的绿植搭配方案。</p>
        </div>
        <div class="story-card">
          <span class="story-num">03</span>
          <h3>一站式服务</h3>
          <p>从灵感、搭配、识别、养护到设计师定制，闭环解决每一个绿植需求。</p>
        </div>
      </div>
    </section>

    <!-- 全部服务 -->
    <section class="services">
      <div class="section-head">
        <span class="section-eyebrow">核心服务</span>
        <h2 class="section-title">六大能力一览</h2>
      </div>
      <div class="service-grid">
        <article
          v-for="f in features"
          :key="f.id"
          class="service-card"
          :class="{ active: activeFeature && activeFeature.id === f.id }"
          @click="selectFeature(f.id)"
        >
          <div class="service-icon" v-html="f.icon"></div>
          <div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
          </div>
        </article>
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
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goHome = () => router.push({ path: '/' })

const features = [
  {
    id: 'inspiration',
    title: '方案灵感',
    desc: '精选海量绿植搭配与空间设计方案，随时为你的灵感充电。',
    extra: '覆盖北欧、日式、极简、新中式等多种风格，每日更新高质量实景案例，帮助你快速找到心仪的绿植布置灵感。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.7 1.3 1.4 1.5 2.5h5c.2-1.1.7-1.8 1.5-2.5A6 6 0 0 0 12 3z"/></svg>'
  },
  {
    id: 'space',
    title: '空间绿植搭配',
    desc: '家庭、室内、商业全空间适配，智能匹配最合适的绿植组合。',
    extra: '根据空间尺寸、采光条件、装修风格与养护难度，智能推荐适配的绿植品类与摆放位置，让搭配科学又好看。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>'
  },
  {
    id: 'ai',
    title: 'AI 智能设计',
    desc: '输入空间需求，AI 一键生成专属绿植搭配与摆放方案。',
    extra: '上传空间照片或输入需求描述，AI 即可生成可视化的绿植设计方案，并给出可落地的购买与摆放建议。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.4z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/><path d="M5 3l.6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6z"/></svg>'
  },
  {
    id: 'identify',
    title: '植物识别',
    desc: '拍照即识，秒速掌握植物名称、习性与养护要点。',
    extra: '对准植物拍照，即刻识别品种、生长习性与养护要点，遇到不认识的绿植再也不必发愁。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-8 0-14 3-14 9 0 4 3 7 7 7 6 0 7-5 7-16z"/><path d="M4 21c3-5 8-8 13-10"/></svg>'
  },
  {
    id: 'care',
    title: '养护管理',
    desc: '浇水、施肥、光照智能提醒，让每一株植物被温柔照顾。',
    extra: '为每株植物建立专属档案，智能推送浇水、施肥、换盆提醒，养护计划一目了然。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/></svg>'
  },
  {
    id: 'designer',
    title: '设计师定制',
    desc: '专业园艺设计师一对一服务，量身定制高端绿植方案。',
    extra: '连接专业园艺设计师，提供一对一咨询与定制设计，为高端商业空间与居家需求打造专属绿意。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>'
  }
]

const activeFeature = computed(() => {
  const id = route.query.feature as string | undefined
  return features.find((f) => f.id === id) || null
})

const selectFeature = (id: string) => {
  router.push({ path: '/about', query: { feature: id } })
}
</script>

<style scoped>
.about {
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
  gap: 24px;
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--fh-line);
  background: #fff;
  color: var(--fh-ink-2);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.back svg {
  width: 16px;
  height: 16px;
}
.back:hover {
  color: var(--fh-primary-deep);
  border-color: var(--fh-primary);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
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
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* ---------- Hero ---------- */
.hero {
  background: linear-gradient(180deg, #f2f9f2 0%, var(--fh-bg) 100%);
  padding: 72px 28px 60px;
  text-align: center;
}
.hero-inner {
  max-width: 760px;
  margin: 0 auto;
}
.hero-eyebrow {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--fh-primary);
}
.hero-title {
  margin-top: 16px;
  font-size: 44px;
  font-weight: 800;
  letter-spacing: 0.5px;
}
.hero-sub {
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.9;
  color: var(--fh-ink-2);
}

/* ---------- 选中详情 ---------- */
.detail {
  max-width: 1120px;
  margin: 0 auto;
  padding: 20px 28px 0;
}
.detail-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  background: #fff;
  border: 1px solid rgba(62, 142, 90, 0.3);
  border-radius: 22px;
  padding: 32px 30px;
  box-shadow: var(--fh-shadow);
}
.detail-badge {
  position: absolute;
  top: -13px;
  left: 26px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--fh-primary), var(--fh-primary-deep));
  padding: 5px 14px;
  border-radius: 999px;
}
.detail-icon {
  flex-shrink: 0;
  width: 66px;
  height: 66px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: var(--fh-primary-deep);
  background: var(--fh-mint);
}
.detail-icon :deep(svg) {
  width: 34px;
  height: 34px;
}
.detail-body {
  flex: 1;
}
.detail-body h2 {
  font-size: 24px;
  font-weight: 800;
}
.detail-body p {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--fh-ink-2);
}
.detail-body .detail-extra {
  margin-top: 6px;
  color: var(--fh-ink-3);
}
.btn-primary {
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, var(--fh-primary), var(--fh-primary-deep));
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 8px 20px rgba(46, 126, 72, 0.28);
  transition: transform 0.15s;
}
.btn-primary:hover {
  transform: translateY(-2px);
}

/* ---------- 通用 ---------- */
.story,
.services {
  max-width: 1120px;
  margin: 0 auto;
  padding: 72px 28px 0;
}
.section-head {
  text-align: center;
  margin-bottom: 44px;
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
  font-size: 30px;
  font-weight: 800;
}

/* ---------- 品牌故事 ---------- */
.story-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.story-card {
  background: #fff;
  border: 1px solid var(--fh-line);
  border-radius: var(--fh-radius);
  padding: 32px 28px;
}
.story-num {
  font-size: 14px;
  font-weight: 800;
  color: var(--fh-primary);
  letter-spacing: 1px;
}
.story-card h3 {
  margin-top: 14px;
  font-size: 20px;
  font-weight: 700;
}
.story-card p {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--fh-ink-2);
}

/* ---------- 服务列表 ---------- */
.service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
.service-card {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  background: #fff;
  border: 1px solid var(--fh-line);
  border-radius: var(--fh-radius);
  padding: 26px;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.service-card:hover {
  transform: translateY(-4px);
  border-color: rgba(62, 142, 90, 0.4);
  box-shadow: 0 18px 34px rgba(30, 80, 45, 0.1);
}
.service-card.active {
  border-color: var(--fh-primary);
  background: var(--fh-mint);
}
.service-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: var(--fh-primary-deep);
  background: var(--fh-mint);
}
.service-card.active .service-icon {
  background: #fff;
}
.service-icon :deep(svg) {
  width: 25px;
  height: 25px;
}
.service-card h3 {
  font-size: 17px;
  font-weight: 700;
}
.service-card p {
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--fh-ink-2);
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
  margin-left: 0;
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

/* ---------- 响应式 ---------- */
@media (max-width: 720px) {
  .hero-title {
    font-size: 34px;
  }
  .detail-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .story-grid,
  .service-grid {
    grid-template-columns: 1fr;
  }
}
</style>
