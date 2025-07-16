import request from "@/utils/request";
enum API {
    GeWang_INFO = '/gewang/information', 
    GeWang_USER = '/gewang/user',
    GeWang_USER_ADD = '/gewang/user/add',
    GeWang_USER_UPDATE = '/gewang/user/update',
    GeWang_USER_DELETE = '/gewang/user/delete/',
    GeWang_DELETE = '/gewang/delete/',
    GeWang_USER_SEARCH = '/gewang/user/search',
    GeWang_PROBLEM_NUMBER = '/gewang/problemnumber'
  }
  export const  GeWang_Information = () => request.get(API.GeWang_INFO)
  export const GeWang_USER = (page: number, limit: number, username: string) =>request.get(API.GeWang_USER + `?page=${page}&pageSize=${limit}&?username=${username}`)
  export const GeWang_USER_ADD = (data:any) => {
    if (data.id) {
      return request.put<any, any>(API.GeWang_USER_UPDATE, data)
    } else {
      return request.post<any, any>(API.GeWang_USER_ADD, data)
    }
  }
  export const GeWang_USER_DELETE = (userid:any) => request.delete(API.GeWang_USER_DELETE+userid)
  export const GeWang_DELETE = (gewangid:any) => request.delete(API.GeWang_DELETE+gewangid)
  export const GeWang_USER_SEARCH = (name:any) => request.get(API.GeWang_USER_SEARCH,{ params: {name}})
  export const GeWang_PROBLEM_NUMBER = () => request.get(API.GeWang_PROBLEM_NUMBER)