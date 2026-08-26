import { createApp } from "vue";
import App from "./App.vue";

//全局样式
import "./assets/css/styles.less";
import "element-plus/theme-chalk/index.css";
//路由
import router from "./router";

//状态管理
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";
const store = createPinia();
store.use(piniaPluginPersist);

createApp(App).use(router).use(store).mount("#app");
