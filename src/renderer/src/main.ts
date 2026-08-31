import { createApp } from "vue";
import App from "./App.vue";

//全局样式
import "./assets/css/styles.css";
import "./assets/css/styles.scss";

import "element-plus/theme-chalk/index.css";
//路由
import router from "./router";

//状态管理
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";
const store = createPinia();
store.use(piniaPluginPersist);
//国际化
import i18n from "./locales";
// Element Plus 图标全局注册，模板中可直接使用 <Edit />、<ChatDotRound /> 等图标组件
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(i18n).use(router).use(store).mount("#app");
