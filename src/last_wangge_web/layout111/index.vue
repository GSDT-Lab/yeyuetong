<template>
  <div class="layout_container">
    <!-- 顶部导航 -->
    <div class="top" :class="{value: LayOutSettingStore.fold ? true : false}">
      <logo class="logo-container"></logo>
      <tablebar></tablebar>
    </div>
    <!-- 左侧菜单 -->
    <div class="left" :class="{value: LayOutSettingStore.fold ? true : false}">
      <!-- 滚动菜单 -->
      <el-scrollbar class="scroolbar">
        <!-- 菜单组件 -->
        <el-menu 
          :default-active="$route.path" 
          background-color="transparent" 
          text-color="#2c3e50" 
          active-text-color="#409eff"
          :collapse="LayOutSettingStore.fold? true : false"
          class="modern-menu"
        >
          <!-- 动态展示 -->
          <menu1 :menuList='userStore.menuRoutes'></menu1>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 下方展示区 -->
    <div class="show" :class="{value: LayOutSettingStore.fold ? true : false}">
      <Main></Main>
    </div>
  </div>
</template>
<script setup lang="ts">
import logo from '@/logo/index.vue'
import menu1 from '@/last_wangge_web/layout111/menu/index.vue'
import useLayOutSettingStore from '@/store/modules/setting'
//获取用户相关小仓库
import useUserStore from '@/store/modules/users'
//右侧内容展示
import Main from '@/last_wangge_web/layout111/main/index.vue'
import tablebar from '@/last_wangge_web/layout111/tablebar/index.vue'
//获取路由对象
import { useRoute } from 'vue-router'
import { Console } from 'console'
let $route = useRoute()
let userStore = useUserStore()
let LayOutSettingStore = useLayOutSettingStore()
</script>
<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  color: #2c3e50;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  
  .left {
    width: $base-menu-width;
    height: calc(100% - 10px - $base-menu-height);
    padding: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 0 20px 20px 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &.value {
      width: $base-menu-min-width;
    }
  }
  
  .scroolbar {
    width: 100%;
    height: calc(100% - $base-left-height);
    
    .modern-menu {
      border-right: none;
      background: transparent;
      
      :deep(.el-menu-item) {
        border-radius: 12px;
        margin: 4px 8px;
        transition: all 0.3s ease;
        
        &:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(5px);
        }
        
        &.is-active {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
        }
      }
      
      :deep(.el-sub-menu__title) {
        border-radius: 12px;
        margin: 4px 8px;
        transition: all 0.3s ease;
        
        &:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      }
    }
  }

  .top {
    display: flex;
    align-items: center;
    top: 0;
    width: 100vw;
    height: $base-menu-height;
    padding: 0 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    
    .logo-container {
      display: flex;
      width: 260px;
      margin-left: -15px;
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 20px 0 0 0;
    
    &.value {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
    
    // 自定义滚动条
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
      
      &:hover {
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .layout_container {
    .left {
      width: 100%;
      height: auto;
      position: relative;
      border-radius: 0;
      
      &.value {
        width: 100%;
      }
    }
    
    .show {
      width: 100%;
      left: 0;
      top: $base-menu-height;
      border-radius: 0;
      
      &.value {
        width: 100%;
        left: 0;
      }
    }
  }
}
</style>
