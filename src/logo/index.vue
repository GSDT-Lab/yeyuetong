<template>
  <div class="logo" :class="{value: LayOutSettingStore.fold ? true : false}" v-if="setting.logohidden">
    <img :src="setting.logo" alt="">
    <p v-if="!LayOutSettingStore.fold">{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting'
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
</script>
<style scoped lang="scss">
.logo {
  position: absolute;
  height: $base-left-height;
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: -15px;
  &.value {
      width: 80px;
    }
  img {
    width: 60px;
    height: 40px;
  }
  p {
    margin: left 10px;
    font-size: $base-logo-font-size;
  }
}
</style>
