// electron.vite.config.ts
import { resolve } from "path";
import {
  defineConfig,
  externalizeDepsPlugin,
  bytecodePlugin
} from "electron-vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@store": resolve("src/renderer/src/store"),
        "@views": resolve("src/renderer/src/views"),
        "@router": resolve("src/renderer/src/router"),
        "@components": resolve("src/renderer/src/components"),
        "@utils": resolve("src/renderer/src/utils"),
        "@api": resolve("src/renderer/src/api")
      }
    },
    server: {
      proxy: {
        "/api": {
          target: "http://doc.xuexiluxian.cn/",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
