import { Goods } from '@element-plus/icons-vue';
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';
import { iconPropType } from 'element-plus/es/utils/index.mjs';
import path from 'path';

export const constantRoute = [
  {
    path: '/',
    redirect: '/login',
    meta: {
      title: '嫌疑人',
      index: 0,
    },
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
      index: 0,
      icon: 'Promotion', //菜单左侧图标，支持element-PLUS全部图标
    },
  },
  {
    path: '/home',
    redirect: '/home/map',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: 'layout',
      index: 0,
      icon: 'Avatar',
    },
    children: [
      {
        path: '/home/map',
        component: () => import('@/views/map/index2.vue'),
        name: 'globalmap',
        meta: {
          title: '地图总览',
          index: 1,
          icon: 'MapLocation',
        },
      },
    ],
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'screen',
    meta: {
      title: '数字大屏',
      index: 1,
      icon: 'DataBoard',
    },
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      index: 0,
      icon: 'Promotion',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      index: 0,
      icon: 'Promotion',
    },
  },
  {
    path: '/charge',
    component: () => import('@/layout/index.vue'),
    name: 'charge',
    meta: {
      title: '网格管理',
      index: 1,
      icon: 'Orange',
    },
    redirect: '/charge/user',
    children: [
      {
        path: '/charge/user',
        component: () => import('@/views/acl/allgewang/index.vue'),
        name: 'user',
        meta: {
          title: '网格总览',
          index: 1,
          icon: 'Grid',
        },
      },

      {
        path: '/charge/role',
        component: () => import('@/views/acl/gewangchange/index.vue'),
        name: 'change',
        meta: {
          title: '网格调整',
          index: 1,
          icon: 'Scissor',
        },
      },
      {
        path: '/charge/3Dwangge',
        component: () => import('@/views/acl/3Dwangge/index1.vue'),
        name: '3Dwangge',
        meta: {
          title: '3D网格检阅',
          index: 1,
          icon: 'OfficeBuilding',
        },
      },
      {
        path: '/charge/permission',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'permission',
        meta: {
          title: '网格人员管理',
          index: 1,
          icon: 'User',
        },
      },
    ],
  },
  {
    path: '/choose',
    component: () => import('@/layout/index.vue'),
    name: 'product',
    meta: {
      title: '审批管理',
      index: 1,
      icon: 'Flag',
    },
    redirect: '/choose/attr',
    children: [
      {
        path: '/choose/attr',
        component: () => import('@/views/product/planning/index.vue'),
        name: 'attr',
        meta: {
          title: '新增规划',
          index: 1,
          icon: 'Tickets',
        },
      },
      {
        path: '/choose/attrs',
        component: () => import('@/views/product/planning/index2.vue'),
        name: 'attrs',
        meta: {
          title: '详细新增规划',
          index: 0,
          icon: 'CircleCheckFilled',
        },
      },
      {
        path: '/choose/comfirm',
        component: () => import('@/views/product/comfirm/index.vue'),
        name: 'comfirm',
        meta: {
          title: '规划审批',
          index: 1,
          icon: 'CircleCheckFilled',
        },
      },
      {
        path: '/choose/comfirmer',
        component: () => import('@/views/product/comfirm/index2.vue'),
        name: 'comfirmer',
        meta: {
          title: '规划审批详情',
          index: 0,
          icon: 'ChromeFilled',
        },
      },
      {
        path: '/choose/action',
        component: () => import('@/views/product/action/index.vue'),
        name: 'action',
        meta: {
          title: '活动规划',
          index: 1,
          icon: 'ShoppingCartFull',
        },
      },
      {
        path: '/choose/youraction',
        component: () => import('@/views/product/youraction/index.vue'),
        name: 'youraction',
        meta: {
          title: '活动审批',
          index: 1,
          icon: 'ChromeFilled',
        },
      },
    ],
  },
  {
    path: '/gewnghome',
    redirect: '/gewanghome/3dmodel',
    component: () => import('@/last_wangge_web/layout111/index.vue'),
    name: 'gewanglayout',
    meta: {
      title: 'gwanglayout',
      index: 2,
      icon: 'Avatar',
    },
    children: [
      {
        path: '/gewanghome/3dmodel',
        component: () => import('@/last_wangge_web/3Dwangge/index1.vue'),
        name: 'gewang3dwangge',
        meta: {
          title: '3D网格模拟',
          index: 2,
          icon: 'OfficeBuilding',
        },
      }, 
    ],
  },      
  {
        path: '/gewanghome/screen',
        component: () => import('@/last_wangge_web/screen/index.vue'),
        name: 'gewangScreen',
        meta: {
          title: '数据大屏',
          index: 2,
          icon: 'DataBoard',
        },
      },
      {
        path: '/gewanguser',
        redirect: '/gewanghome/map',
        component: () => import('@/last_wangge_web/layout111/index.vue'),
        name: 'gewanguserrole',
        meta: {
          title: '网格管理',
          index: 2,
          icon: 'Grid',
        },
        children: [
          {
            path: '/gewanghome/map',
           component: () => import('@/last_wangge_web/map/index2.vue'),
            name: 'gewangmap',
            meta: {
            title: '网格浏览',
          index: 2,
          icon: 'ZoomIn',
        },
      },          
      {
            path: '/gewanghome/user',
            component: () => import('@/last_wangge_web/user/index.vue'),
            name: 'gewanguser',
            meta: {
              title: '网格人员管理',
              index: 2,
              icon: 'User',
            },
          }, 
          {
            path: '/gewanghome/person',
            component: () => import('@/last_wangge_web/wanggeperson/index.vue'),
            name: 'gewangperson',
            meta: {
              title: '实时人流监控',
              index: 2,
              icon: 'VideoCamera',
            },
          }, 
          {
            path: '/gewanghome/weilan',
            component: () => import('@/last_wangge_web/weilan/index.vue'),
            name: 'gewangweilan',
            meta: {
              title: '小摊违停监测',
              index: 2,
              icon: 'Camera',
            },
          }, 
          {
            path: '/gewanghome/problem',
            component: () => import('@/last_wangge_web/wanggeproblem/index.vue'),
            name: 'gewangproblem',
            meta: {
              title: '网格问题总览',
              index: 2,
              icon: 'CircleCloseFilled',
            },
          }, 
          {
            path: '/gewanghome/problemer',
            component: () => import('@/last_wangge_web/wanggeproblem/index2.vue'),
            name: 'gewangproblemer',
            meta: {
              title: '网格问题总览',
              index: 3,
              icon: 'HomeFilled',
            },
          }, 
          {
            path: '/gewanghome/solveproblemer',
            component: () => import('@/last_wangge_web/wanggeproblem/index3.vue'),
            name: 'solvegewangproble',
            meta: {
              title: '网格问题总览',
              index: 3,
              icon: 'HomeFilled',
            },
          }, 
        ],
      },
      {
        path: '/gewangplan',
        redirect: '/gewangplan/plan',
        component: () => import('@/last_wangge_web/layout111/index.vue'),
        name: 'gewangplaning',
        meta: {
          title: '规划管理',
          index: 2,
          icon: 'Flag',
        },
        children: [
          {
            path: '/gewangplan/plan',
           component: () => import('@/last_wangge_web/plan/index.vue'),
            name: 'gewangtoplan',
            meta: {
            title: '规划申请',
          index: 2,
          icon: 'DocumentAdd',
        },
      }, 
      {
        path: '/gewangplan/planer',
       component: () => import('@/last_wangge_web/plan/index2.vue'),
        name: 'gewangtoplaner',
        meta: {
        title: '新增规划申请',
      index: 3,
      icon: 'HomeFilled',
    },
  },          
      {
            path: '/gewangplan/doplan',
            component: () => import('@/last_wangge_web/doplan/index.vue'),
            name: 'gewangdoplan',
            meta: {
              title: '规划执行',
              index: 2,
              icon: 'Checked',
            },
          }, 
          {
            path: '/gewangplan/activity',
            component: () => import('@/last_wangge_web/actiivity/index.vue'),
            name: 'gewangtoactivity',
            meta: {
              title: '活动规划申请',
              index: 2,
              icon: 'FolderAdd',
            },
          }, 
          {
            path: '/gewangplan/doactivity',
            component: () => import('@/last_wangge_web/youractivity/index.vue'),
            name: 'gewangdoactivity',
            meta: {
              title: '活动规划执行',
              index: 2,
              icon: 'Promotion',
            },
          }, 
        ],
      },
]
//常量路由
