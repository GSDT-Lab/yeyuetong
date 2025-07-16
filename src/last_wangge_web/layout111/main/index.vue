<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
let flag = ref(true)
watch(
  () => LayOutSettingStore.refresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
//监听仓库内部数据变化，看是否刷新
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 1s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
