import request from "@/utils/request";
 enum API {
    Planning_sendyour_complete = '/planning/sendyour',
   //传递任务给区端
    Planning_sendcomplete = '/planning/sendcomplete',
    //获取布置全部任务
    Planning_getcomplete = '/planning/getcomplete',
    //查询网格规划
    Planning_searchgetcomplete='/planning/getcomplete/search',
    Planning_dosearchgetcomplete='/planning/getcomplete/dosearch',
    Planning_deletegetcomplete='/planning/getcomplete/delete/',
    Planning_OK = '/planning/ok',
    Planning_problem='/planning/problem',
    Planning_your_complete = 'planning/your/complete',
    Planning_your_complete_search = 'planning/your/complete/search',
    Planning_your_complete_ok = 'planning/your/complete/ok',
    Planning_your_complete_problem = 'planning/your/complete/problem',
    Planning_action = '/planning/action',
    Planning_ADD_action = '/planning/action/add',
    Planning_action_get = '/planning/action/get',
    Planning_action_OK = '/planning/action/ok',
    Planning_action_REFUSE = '/planning/action/refuse',
    Planning_action_fenpei = '/planning/action/fenpei',
   //  Planning_action_image = '/planning/action/image'
 }
 export const Planning_sendcomplete =(data:any)=> request.post(API.Planning_sendcomplete,data)
 export const Planning_getcomplete = (page: number, limit: number) =>request.get(API.Planning_getcomplete + `?page=${page}&pageSize=${limit}`)
 export const Planning_searchgetcomplete =(data:String) => request.get(API.Planning_searchgetcomplete+`?suoshuid=${data}`)
 export const Planning_deletegetcomplete = (data:String) => request.delete(API.Planning_deletegetcomplete+data)
 export const Planning_OK = (data: any) => request.put(API.Planning_OK, data);
 export const Planning_problem =(data:any) => request.put(API.Planning_problem,data)
 export const Planning_action = (page: number, limit: number) =>request.get(API.Planning_action + `?page=${page}&pageSize=${limit}`)
 export const Planning_your_complete = (page: number, limit: number) =>request.get(API.Planning_your_complete + `?page=${page}&pageSize=${limit}`)
 export const Planning_your_complete_search = (data:String) => {
  if (typeof data === 'string'){
  return request.get(API.Planning_your_complete_search+`?suoshugrid=${data}`)
 }
 else if (typeof data === 'number'){
  return request.get(API.Planning_your_complete_search+`?id=${data}`)
 }
}
 export const Planning_your_complete_ok = (data: any) => request.put(API.Planning_your_complete_ok, data);
 export const Planning_your_complete_problem = (data: any) => request.put(API.Planning_your_complete_problem+`?data=${data}`)
 export const Planning_ADD_action = (data: any) => request.put(API.Planning_ADD_action, data)
 export const Planning_action_get = (page: number, limit: number) => request.get(API.Planning_action_get+ `?page=${page}&pageSize=${limit}`)
 export const Planning_action_OK = (data:any) => request.post(API.Planning_action_OK, data)
 export const Planning_action_REFUSE = (data:any) => request.post(API.Planning_action_REFUSE+`?id=${data}`)
 export const Planning_action_fenpei = (data:any) => request.post(API.Planning_action_fenpei, data)
 export const Planning_sendyour_complete = (data:any)=> request.put(API.Planning_sendyour_complete,data)