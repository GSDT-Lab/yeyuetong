//定义小仓库数据state类型
import type { RouteRecordRaw } from 'vue-router'
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  level: string
}
//定义分类对象ts类型
