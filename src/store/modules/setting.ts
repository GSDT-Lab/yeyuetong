// layout相关组件配置仓库
import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('SettingStore',{
  state: () => {
    return {
      fold: false, //用户控制菜单收起还是拉出
      refresh: false, //刷新用
    }
  },
})

export default useLayOutSettingStore
