<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on">

      <div class="title-container">
        <h3 class="title">欢迎登录图书管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="icon-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
          class="input-with-icon"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写锁定已开启" placement="right" manual>
        <el-form-item prop="password">
          <span class="icon-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            class="input-with-icon"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="toggle-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        class="login-button"
        @click.native.prevent="handleLogin"
      >登录</el-button>
      <br><br>
      <el-button
        :loading="loading"
        type="primary"
        class="login-button"
        @click.native.prevent="handleRegister"
      >注册</el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  components: { },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false
    }
  },
  methods: {
    handleRegister() {
      console.log('注册')
      this.$router.push({ path: '/register' })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('提交错误!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$primary-color: #4a90e2;
$background-gradient: linear-gradient(135deg, #4a90e2, #f2569a);
$light-gray: #f9f9f9;
$input-border: rgba(255, 255, 255, 0.3);
$input-hover: rgba(255, 255, 255, 0.5);

.body{
  background:url('/images/bg.png');
}
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: $background-gradient;
  color: $light-gray;

  .login-form {
    width: 400px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .title-container {
    margin-bottom: 30px;

    .title {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
    }
  }

  .input-with-icon {
    position: relative;

    input {
      padding-left: 40px;
      border: 1px solid $input-border;
      background: transparent;
      color: $light-gray;
      border-radius: 5px;

      &:focus {
        border-color: $input-hover;
      }
    }
  }

  .icon-container {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: $light-gray;
  }

  .toggle-pwd {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: $light-gray;

    &:hover {
      color: #fff;
    }
  }

  .login-button {
    width: 100%;
    padding: 10px;
    background-color: $primary-color;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }
}
</style>
