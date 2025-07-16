//路由鉴权：项目中的路由能不能被访问的权限
//（某一个路由，什么条件下可以访问，什么条件下不可以被访问）
import router from "./router";
import nprogress from 'nprogress';
import setting from "./setting";
//在组件外部，需要先引入大仓库,在引入小仓库
import pinia from "./store";

//获取用户相关的小仓库内部的token，来判断用户是否登录成功
import useUserStore from "./store/modules/users";
let userStore = useUserStore(pinia);
console.log(userStore)
//引入进度条样式
import "nprogress/nprogress.css";
import { log } from "console";
nprogress.configure({ showSpinner: false });
//全局守卫：项目当中任意路由切换都会触发的一个钩子
//全局的前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    document.title = `${setting.title}--${to.meta.title}`
    //访问某个路由之前的守卫
    //to:访问那个路由组件
    //from:从哪个路由而来
    //next:路由的放行函数
    nprogress.start();
    //获取tokrn，去判断是登录了还是未登录
    let token = userStore.token
    //获取用户名字
    let username = userStore.username
    //用户登录的判断
    
    if (token) {
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            //登录成功访问其余六个路由(登录排除)
            //有用户信息就放行
            if (username) {
                console.log('Navigating to:', to.path);

                console.log('sssssssssssssssss');
                next();
            } else {
                //在守卫这里发请求获取用户信息之后，在放行
                try {
                    //获取用户信息以后
                    await userStore.userinfo();
                    next();
                } catch (Error) {
                    //token过期，获取不到用户信息
                    //用户手动修改了本地存储token
                    //退出登录->把用户相关的信息都清空
                    await userStore.userLogout();
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {
        //用户未登录的判断
        if (to.path == '/login') {
            next();
        } if (to.path == '/userlogin') {
            next();
        }
        else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})

//全局的后置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done();
})

//第一个问题：任意路由切换都可以实现进度条的业务----nprogress
//第二个问题：路由鉴权（路由组件访问权限的设置）
//全部的路由组件：登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录：可以访问login,其余的都不可以访问（让其指向login）
//用户登录成功：不可以访问login（让其指向首页），其余路由都可以访问
