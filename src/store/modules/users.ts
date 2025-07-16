//创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { UserState } from './types/type'
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由
import { constantRoute } from '@/router/routes'
import { promises } from 'dns'
let REMOVE = REMOVE_TOKEN()
let useUserStore = defineStore('User', {
  //函数
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户标识token
      menuRoutes: constantRoute, //仓库存储生成菜单需要数组(路由)
      username: '',
      avatar: '',
      level: '',
      lat: '',
      lng: '',
      id: '',
      encode: '',
      renliu: '',
      problemtype: '',
      problemencode: '',
      problemdescribe: '',
      centerlat:'',
      centerlng:'',
      centername:'',
      pronum: true,
      pron1:'',
      pron2:'',
      pron3:'',
      pron4:'',
      pron5:'',
      dingweiencode:'',
      dingweiid:'',
    }
  },
  actions: {
    //用户登录方法
    async userLogin(data) {
      let result = await reqLogin(data)
      if (result.code == 200) {
        this.token = result.data as string
        this.level = result.data.level
        SET_TOKEN(result.data as string)
        console.log(result)
        console.log(result.data.level)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息
    async userinfo() {
      //获取用户信息并存储于仓库中
      console.log('1')
      let result= await reqUserInfo()
      //如果获取成功，就存取信息
      console.log(result)
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.level = result.data.level
        this.lat = result.data.latitude
        this.lng = result.data.longitude
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      let result: any = await reqLogout()
      if (result.code == 200) {
        //目前没有mock接口：退出登录接口(通知服务器本地用户唯一标识失效)
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
export default useUserStore
