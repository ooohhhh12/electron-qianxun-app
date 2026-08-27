<template>
  <div class="login" @mousedown="mousedown">
    <!--左侧-->
    <div class="login_adv">
      <div class="login_adv_title">
        <h2>风禾千寻</h2>
        <h4>客户关系管理系统</h4>
        <p>让业务在线更高效，加速企业数字化升级。</p>
      </div>
      <div class="login_adv_mask"></div>

      <div class="login_adv_imgage">
        <el-icon class="login_adv_icon">
          <DataAnalysis />
        </el-icon>
      </div>
      <div class="login_adv_bottom">© 风禾千寻 1.0.11</div>
    </div>
    <!--右侧-->
    <div class="login-main">
      <div class="login-form">
        <div class="login-header">
          <div class="login-img">
            <el-icon class="login-logo-icon">
              <Platform />
            </el-icon>
            <label>风禾千寻</label>
          </div>
        </div>
        <el-tabs>
          <el-tab-pane label="账号登录" lazy>
            <el-form
              ref="ruleFormRef"
              :model="form"
              :rules="rules"
              label-width="0"
              size="large"
            >
              <el-form-item prop="username">
                <el-input
                  v-model="form.username"
                  prefix-icon="user"
                  clearable
                  placeholder="请输入"
                >
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="form.password"
                  prefix-icon="lock"
                  clearable
                  show-password
                  placeholder="请输入"
                ></el-input>
              </el-form-item>

              <el-form-item>
                <div class="boxCode">
                  <el-input
                    v-model="form.captcha"
                    prefix-icon="CircleCheck"
                    clearable
                    placeholder="请输入验证码"
                  ></el-input>
                  <el-image
                    :src="captchaUrl"
                    @click="getImage"
                    class="code"
                  ></el-image>
                </div>
              </el-form-item>

              <div class="rememberMe">
                <div>
                  <el-checkbox label="记住密码" />
                </div>
                <div>
                  <router-link to="/reset_password">忘记密码？</router-link>
                </div>
              </div>

              <el-form-item>
                <el-button
                  type="primary"
                  style="width: 100%"
                  round
                  @click="login(ruleFormRef)"
                  >登录</el-button
                >
              </el-form-item>
            </el-form></el-tab-pane
          >
          <el-tab-pane label="手机号登录" lazy>
            <el-form
              ref="ruleFormRef"
              :model="ruleForm"
              :rules="rules"
              label-width="0"
              size="large"
            >
              <el-form-item prop="mobile">
                <el-input
                  v-model="ruleForm.mobile"
                  prefix-icon="iphone"
                  clearable
                  placeholder="请输入手机号"
                >
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
                    >获取验证码<span v-if="disabled"
                      >({{ time }})</span
                    ></el-button
                  >
                </div>
              </el-form-item>

              <el-form-item>
                <el-button
                  @click="login(ruleFormRef)"
                  type="primary"
                  style="width: 100%"
                  round
                  :loading="isLogin"
                  >登录</el-button
                >
              </el-form-item>

              <el-form-item>
                <router-link to="">忘记密码?</router-link>
              </el-form-item>
            </el-form></el-tab-pane
          >
        </el-tabs>

        <template v-if="true">
          <el-divider>其他登录方式</el-divider>
          <div class="login-oauth">
            <!--微信按钮-->
            <el-button type="success" circle size="large">
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

let isKeyDown = ref(false);
let dinatesX = ref(0);
let dinatesY = ref(0);

// 最外层添加点击事件
const mousedown = ( event )=>{
    isKeyDown.value = true;
    dinatesX.value = event.x;
    dinatesY.value = event.y;

    document.onmousemove = (ev) => {
        if(isKeyDown.value ){
            const x = ev.screenX - dinatesX.value;
            const y = ev.screenY - dinatesY.value;
            //给主进程传入坐标
            let data = {
                appX:x,
                appY:y
            }
            electron.ipcRenderer.invoke('custom-adsorption',data);
        }
    };
    document.onmouseup = () => {
        isKeyDown.value = false
    };
}

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
</script>

<style scoped>
/* 设置可拖动 */
.login {
  -webkit-app-region: drag;
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
  background-color: #fff;
  display: flex;
}
.login_adv {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
.login_adv_imgage {
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 80px;
  padding: 40px;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_adv_imgage .el-icon {
  font-size: 200px;
  color: rgba(255, 255, 255, 0.7);
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
}
.login-header .login-img .el-icon {
  font-size: 40px;
  vertical-align: bottom;
  margin-right: 10px;
  color: #409eff;
}
.login-header .login-img label {
  font-size: 26px;
  font-weight: bold;
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
</style>
