<template>
  <div class="screen">
    <iframe class="iframe" src="http://localhost:8190/s1/index.html"></iframe>
    <div id="myChart" style="width: 200px;height: 200px;"></div>
    <div id="map" style="width: 200px;height: 200px;"></div>
    
    <!-- 美化后的返回按钮 -->
    <div class="floating-controls">
      <div class="control-button to-home" @click="toHome">
        <div class="button-content">
          <i class="el-icon-back"></i>
          <span>返回首页</span>
        </div>
        <div class="button-glow"></div>
      </div>
      
      <!-- 添加其他控制按钮 -->
      <div class="control-button refresh-btn" @click="refreshPage">
        <div class="button-content">
          <i class="el-icon-refresh"></i>
          <span>刷新</span>
        </div>
      </div>
      
      <div class="control-button fullscreen-btn" @click="toggleFullscreen">
        <div class="button-content">
          <i class="el-icon-full-screen"></i>
          <span>全屏</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import * as echarts from 'echarts';
import { onMounted } from "vue";
const router = useRouter()

const toHome = () => {
  router.push({
    name: 'globalmap'
  })
}

const refreshPage = () => {
  window.location.reload()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// onMounted(() => {
//   const myChart = echarts.init(document.getElementById('myChart'));
//   const option = {
//     title: { text: '示例图表' },
//     tooltip: {},
//     xAxis: { data: ['A', 'B', 'C'] },
//     yAxis: {},
//     series: [{ type: 'bar', data: [5, 20, 36] }]
//   };
//   myChart.setOption(option);


//   const map = L.map('map').setView([39.9, 116.4], 10);

//   L.supermap.tiledMapLayer('http://localhost:8090/iserver/services/map-Population/rest/maps/PopulationDistribution').addTo(map);
// });
</script>

<style scoped lang="less">
.screen {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
  background: #000;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
}

.floating-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

.control-button {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    
    .button-content {
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
    
    .button-glow {
      opacity: 1;
      transform: scale(1.2);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

.button-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  i {
    font-size: 16px;
  }
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 25px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: -1;
  filter: blur(10px);
}

.to-home {
  .button-content {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
    
    &:hover {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }
  }
}

.refresh-btn {
  .button-content {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(139, 195, 74, 0.9));
    
    &:hover {
      background: linear-gradient(135deg, #4caf50, #8bc34a);
    }
  }
}

.fullscreen-btn {
  .button-content {
    background: linear-gradient(135deg, rgba(255, 152, 0, 0.9), rgba(255, 193, 7, 0.9));
    
    &:hover {
      background: linear-gradient(135deg, #ff9800, #ffc107);
    }
  }
}

// 添加动画效果
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

.floating-controls {
  animation: fadeInUp 0.8s ease;
}

.control-button:nth-child(1) { animation: fadeInUp 0.8s ease 0.1s both; }
.control-button:nth-child(2) { animation: fadeInUp 0.8s ease 0.2s both; }
.control-button:nth-child(3) { animation: fadeInUp 0.8s ease 0.3s both; }

// 响应式设计
@media (max-width: 768px) {
  .floating-controls {
    top: 10px;
    right: 10px;
    gap: 10px;
  }
  
  .button-content {
    padding: 10px 15px;
    font-size: 12px;
    
    i {
      font-size: 14px;
    }
  }
}
</style>
