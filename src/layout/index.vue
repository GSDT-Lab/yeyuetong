<template>
  <div class="layout_container">
    <!-- 顶部导航 -->
    <div class="top" :class="{value: LayOutSettingStore.fold ? true : false}">
      <div class="top-background"></div>
      <logo style="display:flex;width:260px; margin-left:-15px;"></logo>
      <tablebar></tablebar>
    </div>
    
    <!-- 左侧菜单 -->
    <div class="left" :class="{value: LayOutSettingStore.fold ? true : false}">
      <div class="menu-background"></div>
      <!-- 展示 -->
      <!-- 滚动菜单 -->
      <el-scrollbar class="scroolbar">
        <!-- 菜单组件 -->
        <el-menu 
          :default-active="$route.path" 
          background-color="transparent" 
          text-color="#333" 
          active-text-color="#667eea"
          :collapse="LayOutSettingStore.fold? true : false"
          class="custom-menu"
        >
          <!-- 动态展示 -->
          <menu1 :menuList='userStore.menuRoutes'></menu1>
        </el-menu>
      </el-scrollbar>
    </div>
    
    <!-- 下方展示区 -->
    <div class="show" :class="{value: LayOutSettingStore.fold ? true : false}">
      <div class="content-background"></div>
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '@/logo/index.vue'
import menu1 from '@/layout/menu/index.vue'
import useLayOutSettingStore from '@/store/modules/setting'
//获取用户相关小仓库
import useUserStore from '@/store/modules/users'
//右侧内容展示
import Main from '@/layout/main/index.vue'
import tablebar from '@/layout/tablebar/index.vue'
//获取路由对象
import { useRoute } from 'vue-router'
let $route = useRoute()
let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
console.log()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  color: #333;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.top {
  display: flex;
  top: 0;
  width: 100vw;
  height: $base-menu-height;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
  
  .top-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    z-index: -1;
  }
}

.left {
  width: $base-menu-width;
  height: calc(100% - 10px - $base-menu-height);
  padding: 10px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 5;
  
  .menu-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: -1;
  }
  
  &.value {
    width: $base-menu-min-width;
  }
}

.scroolbar {
  width: 100%;
  height: calc(100% - $base-left-height);
  
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
  
  :deep(.el-scrollbar__bar) {
    background: rgba(102, 126, 234, 0.1);
    
    .el-scrollbar__thumb {
      background: rgba(102, 126, 234, 0.3);
      border-radius: 10px;
      
      &:hover {
        background: rgba(102, 126, 234, 0.5);
      }
    }
  }
}

.custom-menu {
  border-right: none;
  background: transparent;
  
  :deep(.el-menu-item) {
    border-radius: 10px;
    margin: 4px 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      color: #667eea;
      transform: translateX(5px);
    }
    
    &.is-active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      
      &:hover {
        background: linear-gradient(135deg, #5a6fd8, #6a5acd);
      }
    }
  }
  
  :deep(.el-submenu__title) {
    border-radius: 10px;
    margin: 4px 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      color: #667eea;
    }
  }
  
  :deep(.el-submenu.is-active .el-submenu__title) {
    color: #667eea;
  }
}

.show {
  padding: 20px;
  position: absolute;
  width: calc(100% - $base-menu-width);
  height: calc(100% - 50px - $base-menu-height);
  left: $base-menu-width;
  top: $base-menu-height;
  margin-top: 10px;
  overflow: auto;
  transition: all 0.3s ease;
  flex: 1;
  z-index: 1;
  
  .content-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(5px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: -1;
  }
  
  &.value {
    width: calc(100vw - $base-menu-min-width);
    left: $base-menu-min-width;
  }
  
  // 自定义滚动条
  :deep(.el-scrollbar__wrap) {
    overflow-x: hidden;
  }
  
  :deep(.el-scrollbar__bar) {
    background: rgba(102, 126, 234, 0.1);
    
    .el-scrollbar__thumb {
      background: rgba(102, 126, 234, 0.3);
      border-radius: 10px;
      
      &:hover {
        background: rgba(102, 126, 234, 0.5);
      }
    }
  }
}

// 添加动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.layout_container {
  animation: fadeIn 0.8s ease;
}

.top {
  animation: fadeIn 0.8s ease 0.1s both;
}

.left {
  animation: fadeIn 0.8s ease 0.2s both;
}

.show {
  animation: fadeIn 0.8s ease 0.3s both;
}

// 响应式设计
@media (max-width: 768px) {
  .top {
    padding: 15px;
  }
  
  .left {
    padding: 8px;
  }
  
  .show {
    padding: 15px;
  }
}
</style>
