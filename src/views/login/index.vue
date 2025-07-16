<template>
  <!-- 登录背景盒子 -->
  <div class="loginbc">
    <div class="background-particles">
      <div class="particle" v-for="n in 50" :key="n"></div>
    </div>
    
    <div class="loginbox">
      <!-- 左侧标题及logo -->
      <div class="loginlogo">
        <div class="logo-container">
          <div class="logo">
            <img src="/public/img/logo.png" alt="" class="tupian">
          </div>
          <div class="welcome-text">
            <h1>欢迎回来</h1>
            <p>网格管理系统</p>
          </div>
        </div>
      </div>
      
      <!-- 右侧登陆界面 -->
      <div class="loginzi">
        <div class="form-container">
          <div class="form-header">
            <h2>用户登录</h2>
            <p>请输入您的账号信息</p>
          </div>
          
          <el-form 
            :model="loginForm" 
            ref="loginForms" 
            :rules="rules"
            class="login-form"
          >
            <el-form-item prop="username">
              <div class="input-group">
                <div class="input-icon">
                  <i class="el-icon-user"></i>
                </div>
                <el-input 
                  v-model="loginForm.username" 
                  type="text" 
                  placeholder="请输入账号" 
                  maxlength="20"
                  class="custom-input"
                ></el-input>
              </div>
            </el-form-item>

            <el-form-item prop="password">
              <div class="input-group">
                <div class="input-icon">
                  <i class="el-icon-lock"></i>
                </div>
                <el-input 
                  v-model="loginForm.password" 
                  type="password" 
                  placeholder="请输入密码" 
                  maxlength="20"
                  show-password
                  class="custom-input"
                ></el-input>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button 
                @mousedown="(e: Event) => e.preventDefault()" 
                :loading="loading" 
                class="login-btn" 
                size="large" 
                type="primary"
                @click="login"
              >
                <span v-if="!loading">立即登录</span>
                <span v-else>登录中...</span>
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="form-footer">
            <p>© 2024 网格管理系统. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/users'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
let useStore = useUserStore()
let $router = useRouter()
let loading = ref(false)
let loginForms = ref()
let loginForm = reactive({ username: '1111', password: '111111' })
//封装判断时间函数
let times = getTime()
let $route = useRoute()
//表单校验需要对象
const validatorUserName = (rules: any, value: any, callback: any) => {
  if (value.length >= 3 && value.length <= 8) {
    callback()
  } else if (value.length < 3) {
    callback(new Error('账号长度最少为3位'))
  } else if (value.length > 8) {
    callback(new Error('账号长度最多为8位'))
  }
}
const validatorPassWord = (rules: any, value: any, callback: any) => {
  if (value.length >= 6 && value.length <= 15) {
    callback()
  } else if (value.length < 6) {
    callback(new Error('密码长度最少为6位'))
  } else if (value.length > 15) {
    callback(new Error('密码长度最多为15位'))
  }
}
const rules = {
  //规则对象属性
  //required,代表这个字段务必要校验
  //min最少,max最多，message是错误信息，trigger是触发条件
  //change 改变 blur失去焦点触发
  username: [
    { required: true, message: '用户名不能为空哦', trigger: 'blur' },
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    { required: true, message: '密码不能为空哦', trigger: 'blur' },
    { trigger: 'change', validator: validatorPassWord },
  ],
}
let userlevel = ref('')
const login = async () => {
  //保证所有表单校验通过
  await loginForms.value.validate()
  try {
    await useStore.userLogin(loginForm)
    await useStore.userinfo()
     console.log(useStore.level)
    if(useStore.level =='总端') {
     $router.push({
      name: 'screen'
      }) 
     console.log(1)
    }
    else{
      $router.push({
        name: 'gewangScreen'
      })
    }
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${times}`,
      duration: 3000,
    })
  } catch (error) {
    loading.value = false
    console.log(error)
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
</script>

<style scoped>
.loginbc {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.background-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: float-particle 6s infinite linear;
}

.particle:nth-child(odd) {
  animation-duration: 8s;
  animation-delay: 0s;
}

.particle:nth-child(even) {
  animation-duration: 10s;
  animation-delay: 2s;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px);
    opacity: 0;
  }
}

.loginbox {
  width: 900px;
  height: 600px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  overflow: hidden;
  animation: slideInUp 0.8s ease;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loginlogo {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.loginlogo::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-container {
  text-align: center;
  z-index: 1;
  position: relative;
}

.logo {
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  animation: bounceIn 1s ease 0.3s both;
}

.tupian {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.welcome-text {
  color: white;
  animation: fadeInUp 1s ease 0.6s both;
}

.welcome-text h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-text p {
  font-size: 18px;
  opacity: 0.9;
  font-weight: 300;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loginzi {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.form-container {
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-header {
  text-align: center;
  width: 100%;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-header p {
  color: #666;
  font-size: 14px;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  z-index: 2;
  font-size: 18px;
  pointer-events: none;
}

.custom-input :deep(.el-input__wrapper) {
  width: 100%;
  min-width: 260px;
  max-width: 350px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid transparent;
  border-radius: 12px;
  padding-left: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  height: 50px;
}

.custom-input :deep(.el-input__wrapper:hover) {
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.custom-input :deep(.el-input__inner) {
  height: 50px;
  font-size: 16px;
  color: #333;
  line-height: 50px;
}

.custom-input :deep(.el-input__inner::placeholder) {
  color: #999;
}

.login-btn {
  width: 100%;
  height: 50px;
  margin-top: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.form-footer {
  text-align: center;
  margin-top: 30px;
  animation: fadeInUp 1s ease 1.5s both;
}

.form-footer p {
  color: #999;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loginbox {
    width: 90%;
    height: auto;
    min-height: 500px;
    flex-direction: column;
  }
  
  .loginlogo,
  .loginzi {
    width: 100%;
  }
  
  .loginlogo {
    height: 200px;
  }
  
  .loginzi {
    height: auto;
    padding: 30px 20px;
  }
  
  .logo {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }
  
  .welcome-text h1 {
    font-size: 24px;
  }
  
  .welcome-text p {
    font-size: 14px;
  }
}
</style>
