<template>
  <div class="home-container">
    <div class="background-animation"></div>
    <el-card class="welcome-card" :body-style="{ padding: '0px' }">
      <div class="box">
        <div class="avatar-container">
          <img :src="userStore.avatar" alt="" class="avatar">
          <div class="avatar-ring"></div>
        </div>
        <div class="bottom">
          <h3 class="title">{{ getTime() }}{{ userStore.username }}</h3>
          <p class="tit">0721后勤补给处</p>
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">在线</span>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 添加快速操作卡片 -->
    <div class="quick-actions">
      <el-card class="action-card" v-for="(action, index) in quickActions" :key="index" @click="action.handler">
        <div class="action-content">
          <div class="action-icon" :style="{ background: action.color }">
            <i :class="action.icon"></i>
          </div>
          <div class="action-info">
            <h4>{{ action.title }}</h4>
            <p>{{ action.description }}</p>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/users'
import { getTime } from '@/utils/time';
import { useRouter } from 'vue-router'

let userStore = useUserStore()
const router = useRouter()

// 快速操作配置
const quickActions = [
  {
    title: '网格管理',
    description: '查看和管理网格信息',
    icon: 'el-icon-map-location',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    handler: () => router.push('/acl')
  },
  {
    title: '地图查看',
    description: '打开地图界面',
    icon: 'el-icon-location',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    handler: () => router.push('/map')
  },
  {
    title: '数据大屏',
    description: '查看数据统计',
    icon: 'el-icon-data-analysis',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    handler: () => router.push('/screen')
  }
]
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(1deg); }
}

.welcome-card {
  max-width: 600px;
  margin: 0 auto 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
}

.box {
  display: flex;
  align-items: center;
  padding: 40px;
  position: relative;
}

.avatar-container {
  position: relative;
  margin-right: 30px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}

.avatar-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid transparent;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bottom {
  flex: 1;
  
  .title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeInUp 0.8s ease;
  }
  
  .tit {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
    font-style: italic;
    animation: fadeInUp 0.8s ease 0.2s both;
  }
}

.status-indicator {
  display: flex;
  align-items: center;
  animation: fadeInUp 0.8s ease 0.4s both;
  
  .status-dot {
    width: 12px;
    height: 12px;
    background: #52c41a;
    border-radius: 50%;
    margin-right: 8px;
    animation: pulse 2s infinite;
  }
  
  .status-text {
    color: #52c41a;
    font-size: 14px;
    font-weight: 500;
  }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
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

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.action-card {
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  :deep(.el-card__body) {
    padding: 25px;
  }
}

.action-content {
  display: flex;
  align-items: center;
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  color: white;
  font-size: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.action-info {
  flex: 1;
  
  h4 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
    line-height: 1.4;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .box {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
}
</style>
