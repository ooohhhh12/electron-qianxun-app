<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

onBeforeMount(() => {
  const dark = ref<string | null>(localStorage.getItem("dark"));
  const element = document.querySelector("html") as HTMLElement | null;
  if (element) {
    if (dark.value == "dark") {
      element.className = "dark";
    } else {
      element.className = "";
    }
  }
});
</script>
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
</style>
