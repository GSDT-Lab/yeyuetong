import request from '@/utils/request'
enum API {
    //网格经纬度获取
    JingWei1_URL = '/Latitude/getit',
    CancelGewang_URL = '/Latitude/cancel',
    JingWei1_URL_Name = '/Latitude/getit/name',
    GetLater_URL = '/Latitude/getyuce'
  }
  export const GetLat = () => request.get<any>(API.JingWei1_URL)
  export const CanLat = (data:any) => request.put<any>(API.CancelGewang_URL,data)
  export const GetLatName = (data:any) => request.get<any>(API.JingWei1_URL_Name+`?name=${data}`)
  export const GetLater_URL = (data:any) => request.get<any>(API.GetLater_URL,data)
  