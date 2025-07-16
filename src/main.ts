import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:svg-icons-register'
import pinia from './store'
//@ts-ignore
import  L from "leaflet"; // leaflet
import '@supermap/iclient-leaflet'; // 超图
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import '@/style/index.scss'
import '@supermap/iclient-leaflet'
//引入自定义插件对象，全局组件
import gloalComponent from '@/components'
import router from './router'
//测试假接口能否用
//暗黑模式进行
import 'element-plus/theme-chalk/dark/css-vars.css'
// 引入路由鉴权文件
import './permission'
import  '@supermap/vue-iclient3d-webgl/dist/styles/vue-iclient3d-webgl.min.css';
import VueiClient from '@supermap/vue-iclient3d-webgl';
import BaiduMap from 'vue-baidu-map'
import '@supermap/vue-iclient3d-webgl/src/common/styles/index.css'

import webgl3d from './App.vue'

import axios from 'axios'
axios({
  url: '/api/user/login',
  method: 'post',
  data: {
    username: 'admin',
    password: '111111',
  },
})
const app = createApp(App)
app.use(webgl3d)  
app.use(pinia)
app.use(VueiClient)
app.use(gloalComponent)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)
app.mount('#app')
