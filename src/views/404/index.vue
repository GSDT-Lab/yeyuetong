<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-animation">
        <div class="error-number">404</div>
        <div class="error-circle"></div>
        <div class="error-circle"></div>
        <div class="error-circle"></div>
      </div>
      
      <div class="error-text">
        <h1 class="error-title">页面未找到</h1>
        <p class="error-description">抱歉，您访问的页面不存在或已被移除</p>
        <div class="error-actions">
          <el-button type="primary" class="back-btn" @click="goBack">
            <i class="el-icon-back"></i>
            返回上页
          </el-button>
          <el-button class="home-btn" @click="goHome">
            <i class="el-icon-house"></i>
            返回首页
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shape" v-for="n in 6" :key="n"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.error-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.error-content {
  text-align: center;
  z-index: 10;
  position: relative;
  animation: fadeInUp 1s ease;
}

.error-animation {
  position: relative;
  margin-bottom: 40px;
}

.error-number {
  font-size: 120px;
  font-weight: 900;
  color: white;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: bounce 2s ease-in-out infinite;
  position: relative;
  z-index: 2;
}

.error-circle {
  position: absolute;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
  
  &:nth-child(2) {
    width: 200px;
    height: 200px;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 0s;
  }
  
  &:nth-child(3) {
    width: 300px;
    height: 300px;
    top: -70px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 1s;
  }
  
  &:nth-child(4) {
    width: 400px;
    height: 400px;
    top: -140px;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 2s;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0% {
    transform: translateX(-50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateX(-50%) scale(1.1);
    opacity: 0.1;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.3;
  }
}

.error-text {
  color: white;
}

.error-title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 16px;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.error-description {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.back-btn, .home-btn {
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
  
  i {
    font-size: 18px;
  }
}

.back-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
  }
}

.home-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);
  }
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  
  &:nth-child(1) {
    width: 80px;
    height: 80px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    width: 60px;
    height: 60px;
    top: 60%;
    right: 15%;
    animation-delay: 1s;
  }
  
  &:nth-child(3) {
    width: 100px;
    height: 100px;
    bottom: 20%;
    left: 20%;
    animation-delay: 2s;
  }
  
  &:nth-child(4) {
    width: 40px;
    height: 40px;
    top: 30%;
    right: 30%;
    animation-delay: 3s;
  }
  
  &:nth-child(5) {
    width: 70px;
    height: 70px;
    bottom: 40%;
    right: 10%;
    animation-delay: 4s;
  }
  
  &:nth-child(6) {
    width: 50px;
    height: 50px;
    top: 80%;
    left: 60%;
    animation-delay: 5s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .error-number {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 28px;
  }
  
  .error-description {
    font-size: 16px;
    padding: 0 20px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .back-btn, .home-btn {
    width: 200px;
  }
  
  .error-circle {
    &:nth-child(2) {
      width: 150px;
      height: 150px;
    }
    
    &:nth-child(3) {
      width: 220px;
      height: 220px;
    }
    
    &:nth-child(4) {
      width: 300px;
      height: 300px;
    }
  }
}
</style>
