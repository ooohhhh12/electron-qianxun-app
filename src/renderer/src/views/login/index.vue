<template>
  <div class="login" @mousedown="mousedown">
    <div class="login-config">
      <div class="login-config-btn">
        <!-- 切换语言 -->
        <el-dropdown trigger="click" @command="configLang">
          <el-button circle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 512 512"
            >
              <path
                d="M478.33 433.6l-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362L368 281.65L401.17 362z"
                fill="currentColor"
              ></path>
              <path
                d="M267.84 342.92a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73c39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36c-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93c.92 1.19 1.83 2.35 2.74 3.51c-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59c22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z"
                fill="currentColor"
              ></path>
            </svg>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in config.LANG" :key="item.value" :command="item">{{
                item.name
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- 切换主题模式 -->
        <el-button circle @click="configDark">
          <el-icon v-if="dark"><Sunny /></el-icon>
          <el-icon v-else><Moon /></el-icon>
        </el-button>
        <!-- 关闭软件 -->
        <el-button style="margin: 0" icon="close" circle type="default" @click="closeWin"></el-button>
      </div>
    </div>
    <!--左侧-->
    <div class="login_adv">
      <div class="login_adv_title">
        <h2>{{ $t("sys.title") }}</h2>
        <h4>{{ $t("sys.describe") }}</h4>
        <p>{{ $t("sys.content") }}</p>
      </div>
      <div class="login_adv_mask"></div>
      <div class="login_adv_bottom">© {{ $t("sys.title") }} {{ $t("sys.version") }}</div>
    </div>
    <!--右侧-->
    <div class="login-main">
      <div class="login-form">
        <div class="login-header">
          <div class="login-img">
            <img v-show="!dark" src="../../../favicon.ico" alt="" />
            <label>{{ $t("sys.title") }}</label>
          </div>
        </div>
        <el-tabs>
          <el-tab-pane :label="$t('login.accountLogin')" lazy>
            <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="0" size="large">
              <el-form-item prop="username">
                <el-input v-model="form.username" prefix-icon="user" clearable :placeholder="$t('login.userError')">
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="form.password"
                  prefix-icon="lock"
                  clearable
                  show-password
                  :placeholder="$t('login.PWPlaceholder')"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <div class="boxCode">
                  <el-input
                    v-model="form.captcha"
                    prefix-icon="CircleCheck"
                    clearable
                    :placeholder="$t('login.captchaPlaceholder')"
                  ></el-input>
                  <el-image :src="captchaUrl" @click="getImage" class="code"></el-image>
                </div>
              </el-form-item>

              <div class="rememberMe">
                <div>
                  <el-checkbox :label="$t('login.rememberMe')" />
                </div>
                <div>
                  <router-link to="/reset_password">{{ $t("login.forgetPassword") }}</router-link>
                </div>
              </div>

              <el-form-item>
                <el-button type="primary" style="width: 100%" round @click="login(ruleFormRef)">{{
                  $t("login.signIn")
                }}</el-button>
              </el-form-item>
            </el-form></el-tab-pane
          >
          <el-tab-pane :label="$t('login.mobileLogin')" lazy>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" size="large">
              <el-form-item prop="mobile">
                <el-input v-model="ruleForm.mobile" prefix-icon="iphone" clearable placeholder="请输入手机号">
                  <template #prepend>+86</template>
                </el-input>
              </el-form-item>

              <el-form-item prop="captcha">
                <div class="login-msg-yzm">
                  <el-input
                    v-model="ruleForm.captcha"
                    prefix-icon="unlock"
                    clearable
                    placeholder="请输入验证码"
                  ></el-input>
                  <el-button @click="getCode" :disabled="disabled"
                    >获取验证码<span v-if="disabled">({{ time }})</span></el-button
                  >
                </div>
              </el-form-item>

              <el-form-item>
                <el-button @click="login(ruleFormRef)" type="primary" style="width: 100%" round :loading="isLogin">{{
                  $t("login.signIn")
                }}</el-button>
              </el-form-item>

              <el-form-item>
                <router-link to="">忘记密码?</router-link>
              </el-form-item>
            </el-form></el-tab-pane
          >
        </el-tabs>

        <template v-if="true">
          <el-divider>{{ $t("login.signInOther") }}</el-divider>
          <div class="login-oauth">
            <!--微信按钮-->
            <el-button type="success" circle size="large" @click="loginByWechat">
              <el-icon size="large">
                <ChatDotRound />
              </el-icon>
            </el-button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { loginCaptcha, loginByMobile, captchaImage } from "@api/login";
import { Encrypt } from "@utils/aes";
import i18n from "@renderer/locales";
const config = reactive({
  LANG: [
    { name: "中文", value: "zh-cn" },
    { name: "英文", value: "en" },
  ],
});
const configLang = (item: any) => {
  let val: string = item.value;
  i18n.global.locale = val;
  localStorage.setItem("lang", val);
};

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  mobile: "",
  captcha: "",
});
const validatorTel = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请填写手机号"));
  } else if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error("请填写正确手机号"));
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  mobile: [{ validator: validatorTel, trigger: "blur" }],
  captcha: [{ required: true, message: "请输入密码", trigger: "blur" }],
  username: [{ required: true, message: "正确用户名", trigger: "blur" }],
  password: [{ required: true, message: "正确密码", trigger: "blur" }],
});
const time = ref<number>(60);
const disabled = ref<boolean>(false);
const isLogin = ref<boolean>(false);

//获取验证码
const getCode = async () => {
  let validate = await ruleFormRef.value?.validateField("mobile", () => null);
  if (!validate) {
    return ElMessage.error("请填写正确的手机号");
  }

  let res: any = await loginCaptcha({
    mobile: Encrypt(ruleForm.mobile),
  });

  if (res.code != "200") return ElMessage.error(res.msg);

  ElMessage.success("发送成功");

  disabled.value = true;
  time.value = 60;
  let timer = setInterval(() => {
    time.value -= 1;
    if (time.value < 1) {
      clearInterval(timer);
      disabled.value = false;
      time.value = 0;
    }
  }, 1000);

  return;
};
//登录
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      let res: any = await loginByMobile({
        mobile: Encrypt(ruleForm.mobile),
        captcha: Encrypt(ruleForm.captcha),
      });

      if (res.code != "200") return ElMessage.error(res.msg);
    } else {
      return ElMessage.warning("请填写正确内容");
    }

    return;
  });
};

let captchaUrl = ref<string>("");

const form = reactive({
  username: "",
  password: "",
  captcha: "",
  key: "",
});

let getImage = async () => {
  const key = new Date().getTime().toString();
  form.key = key;
  const res = await captchaImage({ key });
  let blob = new Blob([res], { type: "application/vnd.ms-excel" });
  let imgUrl = URL.createObjectURL(blob);
  captchaUrl.value = imgUrl;
};
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
      electron.ipcRenderer.invoke("custom-adsorption", data);
    }
  };
  document.onmouseup = () => {
    isKeyDown.value = false;
  };
};
//微信登录
const loginByWechat = async () => {
  electron.ipcRenderer.invoke("loginByWechat");
};

//关闭软件
const closeWin = (): void => {
  electron.ipcRenderer.invoke("close-login");
};

const dark = ref<string | null>(localStorage.getItem("dark"));
const configDark = () => {
  const element = document.querySelector("html") as HTMLElement | null;
  if (element) {
    if (element.className == "dark") {
      element.className = "";
    } else {
      element.className = "dark";
    }
    dark.value = element.className;
    localStorage.setItem("dark", element.className);
  }
};
</script>

<style scoped>
/* 设置可拖动 */
div {
  /* -webkit-app-region: drag; */
}
.boxCode {
  display: flex;
  align-items: center;
  width: 100%;
}
.code {
  margin-left: 10px;
  height: 40px;
  width: 100px;
  cursor: pointer;
}
.rememberMe {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.login {
  width: 100vw;
  height: 100vh;
  background-color: var(--el-bg-color);
  display: flex;
}
.login_adv {
  background: linear-gradient(135deg, #66ea7e 0%, #4ba267 100%);
  width: 40%;
  position: relative;
}
.login_adv_title {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 40px;
  color: #fff;
}
.login_adv_title h2 {
  font-size: 40px;
}
.login_adv_title h4 {
  font-size: 18px;
  margin-top: 10px;
}
.login_adv_title p {
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.8;
  color: rgb(255, 255, 255, 0.6);
}
.login_adv_bottom {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  color: #fff;
  padding: 0 40px 40px 40px;
}
.login_adv_mask {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.login-main {
  flex: 1;
  display: flex;
  overflow: auto;
}
.login-form {
  width: 400px;
  margin: auto;
  padding: 80px 0 0 0;
}
.login-header {
  margin-bottom: 40px;
}
.login-header .login-img {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.login-header .login-img .el-icon {
  font-size: 40px;
  vertical-align: bottom;
  margin-right: 10px;
  color: var(--el-color-primary);
}
.login-header .login-img label {
  font-size: 26px;
  font-weight: bold;
  color: var(--el-text-color-primary);
}
.login-oauth {
  display: flex;
  justify-content: space-around;
}
.login-msg-yzm {
  display: flex;
  width: 100%;
}
.login-msg-yzm .el-button {
  margin-left: 10px;
}

/* 关闭软件 */
.login-config {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 9999;
}
.login-config-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 120px;
  margin: 10px 10px 0 0;
  float: right;
}

/* 暗色主题适配 */
html.dark .login_adv {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}
html.dark .login_adv_mask {
  background: rgba(0, 0, 0, 0.3);
}
</style>
