<template>
  <svg :style="{ width, height }">
    <use xlink:href="#icon-phone"></use>
  </svg>
</template>

<script setup lang="ts">
//接受父组件的参数
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: String,
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style scoped></style>
