<template>
  <div class="table" :class="{value: LayOutSettingStore.fold ? true : false}">
    <div class="left1">
      <!-- 顶部左侧 -->
      <el-icon @click="changeIcon1" style="margin-right: 10px">
        <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <!-- 左侧面包屑 -->
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in $route.matched" :key="index" v-show="item.meta.index!=3&&item.meta.title!=='gwanglayout'" :to="item.path">
          <el-icon style="margin: 0px 2px; vertical-align: middle">
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right123">
      <!-- 顶部右侧 -->
      <el-popover placement="bottom" title="消息提醒" width="300px" trigger="click">
        <el-form>
          <el-form-item label="新增网格问题数量:">
            <span>{{ b }}</span>
            <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" style="margin-left: 40px;" @click="toone()">前往</el-button>
          </el-form-item>
          <el-form-item label="新增规划执行数量:">
            <span>{{ a }}</span>
            <el-button @mousedown="e => e.preventDefault()" style="margin-left: 40px;" type="primary" size="small" @click="totwo()">前往</el-button>
          </el-form-item>
          <el-form-item label="新增活动执行数量:">
            <span>{{ c }}</span>
            <el-button @mousedown="e => e.preventDefault()" style="margin-left: 40px;" type="primary" size="small" @click="totre()">前往</el-button>
          </el-form-item>
        </el-form>
        <template #reference>
          <el-badge is-dot class="item" style="margin-right: 10px;" :hidden=hid>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="primary" circle icon="Bell"  class="boom" @click="hid = true"></el-button>
      </el-badge>
        </template>
      </el-popover>
      <el-button  @mousedown="e => e.preventDefault()" type="primary" size="primary" circle icon="refresh" @click="fresh" class="boom"></el-button>
      <el-button  @mousedown="e => e.preventDefault()" type="primary" size="primary" circle icon="full-screen" @click="fullScreen" class="boom"></el-button>
      <el-popover placement="bottom" title="主题设置" width="300px" trigger="click">
        <el-form>
          <el-form-item label="主题颜色">
            <el-color-picker hide-after="10000" @change="setColor" v-model="color" size="primary" show-alpha :predefine="predefineColors"></el-color-picker>
          </el-form-item>
          <el-form-item label="暗黑模式">
            <el-switch @change="hei" inline-prompt active-icon="MoonNight" inactive-icon="Sunny" v-model="dark" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button @mousedown="e => e.preventDefault()" type="primary" size="primary" circle icon="setting" class="boom"></el-button>
        </template>
      </el-popover>
      <img src="/public/img/head2.jpg" style="width: 32px; height: 32px; margin-left: 10px; margin-right: 10px; border-radius: 50%;">
      <el-dropdown>
        <span class="el-dropdown-link">
          <span class="boom">{{ useStore.username }}</span>
          <el-icon>
            <arrow-down></arrow-down>
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="exit">退出登录</el-dropdown-item>
            <el-dropdown-item @click="Toweb">进入网站</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref,onMounted} from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
import { GeWang_PROBLEM_NUMBER } from '@/api/gewang';
// 获取路由器对象
let $router = useRouter()

// 获取路由对象
let $route = useRoute()
let LayOutSettingStore = useLayOutSettingStore()
import useUserStore from '@/store/modules/users'
let useStore = useUserStore()
let dark = ref<boolean>(false)
const changeIcon1 = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}

const fresh = () => {
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
let hid = ref(true)
let a =ref()
let b =ref()
let c = ref()
const tips = async () => {
let result = await GeWang_PROBLEM_NUMBER()
const jk = await result.data[2] + result.data[1] + result.data[4]
a.value = result.data[1]
b.value = result.data[2]
c.value = result.data[4]
console.log(jk)
if(jk>0){
  hid.value = false
}else{
  hid.value = true
}
}
//switch切换
const hei = () => {
  let html = document.documentElement
  dark.value?html.className='dark':html.className=''
}
const setColor = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)

}
const fullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    // requestFullscreen()调成全屏插件
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
const toone = () =>{
  $router.push({
        name: 'gewangproblem',
    });
}
const totwo = () =>{
  $router.push({
        name: 'gewangdoplan',
    });
}
const totre = () =>{
  $router.push({
        name: 'gewangdoactivity',
    });
}
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const exit = async () => {
  // 第一件事：向服务器发送请求退出登录接口
  // 第二件事：仓库当中相关用户数据清空[TOKEN]
  // 第三件事：跳转到登录页面
  await useStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
const Toweb = () => {
  $router.push({ path: '/main', query: { redirect: $route.path } })
}
onMounted(()=>{
  console.log(111)
  tips()
  console.log(1111)
})
</script>
<style scoped lang="scss">
.table {
  width: calc(100% - 260px);
  height: 100%;
  display: flex;
  margin-left: 240px;
  justify-content: space-between;    
  &.value {
      width: calc(100% - 80px);
      margin-left: 60px;
    }
  //   background-image: linear-gradient(to right, white, black, white);
  .left1 {
    display: flex;
    align-items: center;

  }
  .right123 {
    display: flex;
    align-items: center;
  }
}
</style>
