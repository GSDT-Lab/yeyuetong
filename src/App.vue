<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import request from '@/utils/request'
</script>

<style scoped lang="scss">
h1 {
  color: $base-color;
}
.amap-sug-result{
  z-index: 999;
  display: flex;
  position: absolute;
  color: black;
  border: 1px solid black;
}
</style>
