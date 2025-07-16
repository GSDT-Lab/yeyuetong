<template>
  <div class="screen-container">
    <iframe class="screen-iframe" src="http://localhost:8190/screen2/index.html"></iframe>
    <div class="floating-controls">
      <div class="control-panel">
        <div class="control-item" @click="toHome">
          <el-icon class="control-icon"><House /></el-icon>
          <span class="control-text">返回首页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { House } from '@element-plus/icons-vue'

const router = useRouter()

const toHome = () => {
  router.push({
    name: 'gewangmap',
  })
}
</script>

<style scoped lang="scss">
.screen-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;

  .screen-iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 0;
  }

  .floating-controls {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
    animation: fadeInUp 0.6s ease-out;

    .control-panel {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      }

      .control-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;

        &:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .control-icon {
          font-size: 18px;
        }

        .control-text {
          font-size: 14px;
          white-space: nowrap;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .screen-container {
    .floating-controls {
      top: 10px;
      right: 10px;

      .control-panel {
        padding: 12px;

        .control-item {
          padding: 8px 12px;

          .control-icon {
            font-size: 16px;
          }

          .control-text {
            font-size: 12px;
          }
        }
      }
    }
  }
}

// 动画效果
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
  