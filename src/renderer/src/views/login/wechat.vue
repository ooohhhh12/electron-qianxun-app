<template>
  <div class="wechat" @mousedown="mousedown">
    <!-- 关闭按钮 -->
    <div class="wechat-close">
      <el-button icon="close" circle size="small" @click="closeWin"></el-button>
    </div>

    <!-- 二维码区域 -->
    <div class="wechat-body">
      <h3 class="wechat-title">微信扫码登录</h3>
      <div class="wechat-qr">
        <img :src="qrCodeUrl" alt="微信登录二维码" />
      </div>
      <p class="wechat-tip">请使用微信扫一扫登录</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="wechat">
import { onMounted, ref } from "vue";
import QRCode from "qrcode";

const qrCodeUrl = ref("");

// 生成二维码（模拟微信登录链接）
const generateQrCode = async () => {
  const loginUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=wx_mock&state=${Date.now()}`;
  qrCodeUrl.value = await QRCode.toDataURL(loginUrl, {
    width: 200,
    margin: 1,
    color: { dark: "#000000", light: "#ffffff" },
  });
};

// 关闭（隐藏）微信登录窗口
const closeWin = () => {
  electron.ipcRenderer.invoke("loginByWechat");
};

// 窗口拖动
const isKeyDown = ref(false);
const dinatesX = ref(0);
const dinatesY = ref(0);
const mousedown = (event: MouseEvent) => {
  isKeyDown.value = true;
  dinatesX.value = event.x;
  dinatesY.value = event.y;
  document.onmousemove = (ev: MouseEvent) => {
    if (!isKeyDown.value) return;
    const x = ev.screenX - dinatesX.value;
    const y = ev.screenY - dinatesY.value;
    electron.ipcRenderer.invoke("custom-wx", { appX: x, appY: y });
  };
  document.onmouseup = () => {
    isKeyDown.value = false;
  };
};

onMounted(() => {
  generateQrCode();
});
</script>

<style scoped>
.wechat {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: var(--el-bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.wechat-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.wechat-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.wechat-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  margin: 0;
}

.wechat-qr {
  width: 220px;
  height: 220px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.wechat-qr img {
  width: 200px;
  height: 200px;
  display: block;
}

.wechat-tip {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin: 0;
}
</style>
