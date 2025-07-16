//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
//引入element-plus的全局组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
console.log(ElementPlusIconsVue)
const allGloablComponent: any = {
  SvgIcon,
  Pagination,
}
export default {
  install(app: any) {
    //注册项目全部全局组件
    Object.keys(allGloablComponent).forEach((key: string) => {
      //注册为全局组件库
      app.component(key, allGloablComponent[key])
    })
    //注册element-plus的全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
