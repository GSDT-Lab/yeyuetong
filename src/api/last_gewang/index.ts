// 统一管理用户相关的接口
// 统一管理用户相关的接口
import request from '@/utils/request'
//项目用户相关请求地址
enum API {
Last_GeWang_user = '/lastgewang/user',
Last_GeWang_problem = '/lastgewang/problem',
Last_GeWang_problem_id ='/lastgewang/problem/ab',
Last_GeWang_problem_work2 = '/lastgewang/problem/work2',
Last_GeWang_problem_work = '/lastgewang/problem/work',
Last_GeWang_problem_work_pro ='/lastgewang/problem/workpro',
Last_GeWang_action = '/lastgewang/action',
Last_GeWang_action_send = '/lastgewang/action/send',
Last_GeWang_action_all ='/lastgewang/action/all',
Last_GeWang_WeiLan = '/lastgewang/weilan',
Last_GeWang_Daohang = '/lastgewang/daohang1',
Last_GeWang_Yuce = '/lastgewang/yuce',
Last_GeWang_zhemo = '/lastgewang/zhemo',
Last_GeWang_problem_search = '/lastgewang/problem/search',
}

//获取职工接口
export const Last_GeWang_user = (data: any) => request.get<any, any>(API.Last_GeWang_user+`?suoshugrid=${data}`)
export const Last_GeWang_problem = () => request.get(API.Last_GeWang_problem)
export const Last_GeWang_problem_id =(data:any) => request.get(API.Last_GeWang_problem_id+`?id=${data}`) 
export const Last_GeWang_problem_work2 =(data:any,name:any,describle:any) => request.put(API.Last_GeWang_problem_work2+`?id=${data}`+`&name=${name}`+`&describle=${describle}`)
export const Last_GeWang_problem_work =(data:any,name:any,describle:any) => request.put(API.Last_GeWang_problem_work+`?id=${data}`+`&name=${name}`+`&describle=${describle}`)
export const Last_GeWang_action = (data:any) => request.get(API.Last_GeWang_action+`?suoshuid=${data}`)
export const Last_GeWang_action_send = (data:any) => request.put(API.Last_GeWang_action_send,data)
export const Last_GeWang_action_all = (data:any) => request.get(API.Last_GeWang_action_all+`?suoshuid=${data}`)
export const Last_GeWang_WeiLan = (data:any) => request.put(API.Last_GeWang_WeiLan,data)
export const Last_GeWang_problem_work_pro =(data:any,name:any) => request.put(API.Last_GeWang_problem_work_pro+`?id=${data}`+`&name=${name}`)
export const Last_GeWang_Daohang = (data: any) => request.post(API.Last_GeWang_Daohang+`?first=${data}`)
export const Last_GeWang_Yuce = (data: any,last: any) => request.post(API.Last_GeWang_Yuce+`?first=${data}`+`&last=${last}`)
export const Last_GeWang_zhemo = (data:any) => request.get(API.Last_GeWang_zhemo+`?encode=${data}`)
export const Last_GeWang_problem_search = (data:any) => request.get(API.Last_GeWang_problem_search+`?encode=${data}`)
