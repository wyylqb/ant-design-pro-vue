<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="账号密码登录">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账户或密码错误（admin/ant.design )" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="账户"
              v-decorator="['userName',validatorRules.userName,{ validator: this.handleUsernameOrEmail }]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="密码"
              v-decorator="['password',validatorRules.password]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn">确定</a-button>
      </a-form-item>
    </a-form>

  </div>
</template>

<script>
import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha, get2step } from '@/api/login'
export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        // loginBtn: false,
        // loginType: 0,
        smsSendBtn: false
      },
      formLogin: {
        userName: "",
        password: ""
      },
      validatorRules:{
        userName:{rules: [{ required: true, message: '请输入用户名!',validator: 'click'}]},
        password:{rules: [{ required: true, message: '请输入密码!',validator: 'click'}]},
      },
    }
  },
  created () {
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const { state } = this;
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleTabClick (key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    // handleSubmit (e) {
    handleSubmit () {
      let that = this;
      let loginParams = {
        // remember_me: that.formLogin.rememberMe
      };
      that.loginBtn = true;
      // 使用账户密码登陆
      if (that.customActiveKey === 'tab1') {
        // const loginParams = { ...values };
        that.form.validateFields([ 'userName', 'password'], { force: true }, (err, values) => {
          if (!err) {
            loginParams.userName = values.userName;
            loginParams.password = values.password;
            console.log(loginParams);
            that.Login(loginParams).then((res) => {
              console.log("aaa");
              this.loginSuccess(res);
            }).catch((err) => {
              that.requestFailed(err);
            });
          }else {
            that.loginBtn = false;
          }
        })
      }
    },

    loginSuccess (res) {
      // console.log(res);   //undefined
      // this.$router.push({ name: "dashboard" });
      this.$router.push({ path: '/dashboard/analysis' });
      // 延迟 1 秒显示欢迎信息
      console.log("aaa");
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000);
      this.isLoginError = false
    },
    requestFailed (err) {
      console.log(err);
      this.isLoginError = true;
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .user-layout-login {
    label {
      font-size: 14px;
    }
    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }
    .forge-password {
      font-size: 14px;
    }
    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }
    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;
      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;
        &:hover {
          color: #1890ff;
        }
      }
      .register {
        float: right;
      }
    }
  }
</style>