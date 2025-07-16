<template>
  <div >
    <video
      class="custom-video"
      src="/public/video/屏幕录制 2025-06-22 190602.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.custom-video {
  width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}
</style>