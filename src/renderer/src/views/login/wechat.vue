<template>
  <div class="wechat" @mousedown="mousedown">
    <span style="color: #000">微信登录</span>
  </div>
</template>

<script setup lang="ts" name="wechat">
import { reactive, ref, onBeforeMount, onMounted } from "vue";
let isKeyDown = ref(false);
let dinatesX = ref(0);
let dinatesY = ref(0);
// 最外层添加点击事件
const mousedown = (event) => {
  isKeyDown.value = true;
  dinatesX.value = event.x;
  dinatesY.value = event.y;

  document.onmousemove = (ev) => {
    if (isKeyDown.value) {
      const x = ev.screenX - dinatesX.value;
      const y = ev.screenY - dinatesY.value;
      //给主进程传入坐标
      let data = {
        appX: x,
        appY: y,
      };
      electron.ipcRenderer.invoke("custom-wx", data);
    }
  };
  document.onmouseup = () => {
    isKeyDown.value = false;
  };
};
onBeforeMount(() => {
  console.log("2.组件挂载页面之前执行----onBeforeMount");
});
onMounted(() => {
  console.log("3.-组件挂载到页面之后执行-------onMounted");
});
</script>

<style scoped>
.wechat {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
