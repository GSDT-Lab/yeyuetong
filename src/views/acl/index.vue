<template>
  <div class="acl-container">
    <!-- 用户信息卡片 -->
    <el-card class="user-card">
      <div class="user-info">
        <div class="avatar-section">
          <img :src="userStore.avatar" alt="用户头像" class="user-avatar">
          <div class="status-badge">
            <span class="status-dot"></span>
            <span>在线</span>
          </div>
        </div>
        <div class="user-details">
          <h2 class="username">{{ userStore.username }}</h2>
          <p class="user-role">系统管理员</p>
          <p class="user-email">admin@example.com</p>
        </div>
      </div>
    </el-card>

    <!-- 统计面板 -->
    <div class="stats-grid">
      <el-card class="stat-card" v-for="(stat, index) in stats" :key="index">
        <div class="stat-content">
          <div class="stat-icon" :style="{ background: stat.color }">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-info">
            <h3 class="stat-number">{{ stat.value }}</h3>
            <p class="stat-label">{{ stat.label }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 快速操作 -->
    <el-card class="quick-actions-card">
      <template #header>
        <div class="card-header">
          <span>快速操作</span>
        </div>
      </template>
      <div class="actions-grid">
        <div class="action-item" v-for="(action, index) in quickActions" :key="index" @click="action.handler">
          <div class="action-icon" :style="{ background: action.color }">
            <i :class="action.icon"></i>
          </div>
          <span class="action-text">{{ action.text }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/users'
import { useRouter } from 'vue-router'

let userStore = useUserStore()
const router = useRouter()

// 统计数据
const stats = [
  {
    label: '总用户数',
    value: '1,234',
    icon: 'el-icon-user',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    label: '活跃网格',
    value: '56',
    icon: 'el-icon-map-location',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    label: '今日访问',
    value: '892',
    icon: 'el-icon-view',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    label: '系统状态',
    value: '正常',
    icon: 'el-icon-success',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
]

// 快速操作
const quickActions = [
  {
    text: '用户管理',
    icon: 'el-icon-user-solid',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    handler: () => router.push('/acl/user')
  },
  {
    text: '权限设置',
    icon: 'el-icon-setting',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    handler: () => console.log('权限设置')
  },
  {
    text: '系统日志',
    icon: 'el-icon-document',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    handler: () => console.log('系统日志')
  },
  {
    text: '数据备份',
    icon: 'el-icon-download',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    handler: () => console.log('数据备份')
  }
]
</script>

<style lang="scss" scoped>
.acl-container {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.user-card {
  margin-bottom: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  
  :deep(.el-card__body) {
    padding: 30px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 30px;
}

.avatar-section {
  position: relative;
}

.user-avatar {
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

.status-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #52c41a;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  .status-dot {
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.user-details {
  flex: 1;
  
  .username {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .user-role {
    font-size: 16px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .user-email {
    font-size: 14px;
    color: #999;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  border-radius: 15px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
  
  :deep(.el-card__body) {
    padding: 25px;
  }
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-info {
  flex: 1;
  
  .stat-number {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 4px;
    color: #333;
  }
  
  .stat-label {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
}

.quick-actions-card {
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  :deep(.el-card__header) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px 25px;
  }
  
  :deep(.el-card__body) {
    padding: 25px;
  }
}

.card-header {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
    transform: translateY(-3px);
  }
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.action-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

// 响应式设计
@media (max-width: 768px) {
  .acl-container {
    padding: 15px;
  }
  
  .user-info {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
