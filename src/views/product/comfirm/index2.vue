<template>
  <div>
    <el-card>
    <!-- 添加修改数据 -->
    <el-form :inline="true">
      <el-form-item label="网格名称">
        <div>{{ yourplanArr.suoshuid }}</div>
      </el-form-item>
    </el-form>
  <div style="background-color: #ffffff; height: 600px; width: 100%;">
      <div id="container">
          <div class="whocar">
              <img src="/public//img//666.png" alt="">
          </div>
          <div class="whocare">
              leaflet with &copy; <a>&nbsp;SuperMap iClient&nbsp;</a> | Map Data &copy;&nbsp;<a>SuperMap iServer</a>
          </div>
      </div>
    </div>
    <el-form :inline="true">
      <el-form-item label="规划类型">
        <div>{{ yourplanArr.renwutype }}</div>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="具体规划">
        <div>{{ yourplanArr.describle }}</div>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="申请人员">
        <div>{{ yourplanArr.gridman }}</div>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label=申请时间>
        <div>{{ yourplanArr.time }}</div>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label=审批结果>
        <div>{{ yourplanArr.state}}</div>
      </el-form-item>
    </el-form>
    <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="cancel">确定</el-button>
</el-card> 
  </div> 
  
</template>

<script setup lang="ts">
import {ref,onMounted,reactive} from 'vue';
import useUserStore from '@/store/modules/users'
import { GetLat } from '@/api/product/jingwei/index';
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting'
import {Planning_sendcomplete, Planning_your_complete_search} from '@/api/planning/index'
let LayOutSettingStore = useLayOutSettingStore()
let $router = useRouter()
let useStore = useUserStore()
//地图部分
const path = ref([]);
const current_position = ref([]);
const input = ref('')
const gewang = ref([]);
let map 
var a=ref()
var b=ref()
var url = window.location.href;
//定位所在经纬度判断
// 使用URLSearchParams获取参数
var params = new URLSearchParams(url.split('?')[1]);
//从网格总览拿过来的经纬度
let keyword = useStore.id
const value = ref('')
const value1 = ref('')
let yourplanArr = ref([])
let suoshuid = ref('')
const getSearchplan = async () => {
  //收集当前页码
  console.log(keyword)
  let result1 = await Planning_your_complete_search(keyword)
  yourplanArr.value = result1.data[0]
  console.log(yourplanArr.value)
  if (yourplanArr.value.suoshuid == '公园茂') {
    a.value = 113.555967;
    b.value = 34.819663;
    console.log(111)
}
else if (yourplanArr.value.suoshuid == '正弘汇') {
    a.value = 113.566227;
    b.value = 34.808968;
}
else if (yourplanArr.value.suoshuid == '欣悦荟') {
    a.value = 113.541244;
    b.value = 34.830908;
}
else if (yourplanArr.value.suoshuid == '德化') {
    a.value = 113.665959;
    b.value = 34.749857;
}
else if (yourplanArr.value.suoshuid == '油化厂') {
    a.value = 113.640171;
    b.value = 34.772529;
}
else if (yourplanArr.value.suoshuid == '农科路') {
    a.value = 113.684864;
    b.value = 34.792415;
}
else if (yourplanArr.value.suoshuid == '星河里') {
    a.value = 113.734797;
    b.value = 34.781938;
}
else if (yourplanArr.value.suoshuid == '银基广场') {
    a.value = 113.666518;
    b.value = 34.742197;
}
else if (yourplanArr.value.suoshuid == '晶悦城') {
    a.value = 113.542971;
    b.value = 34.806227;
}
else if (yourplanArr.value.suoshuid == '瑞光') {
    a.value = 113.638592;
    b.value = 34.762959;
}
else if (yourplanArr.value.suoshuid == '艺茂仓') {
    a.value = 113.618538;
    b.value = 34.858787;
}
else if (yourplanArr.value.suoshuid == '海汇港') {
    a.value = 113.770473;
    b.value = 34.752527;
}
else if (yourplanArr.value.suoshuid == '磨街文创') {
    a.value = 113.593596;
    b.value = 34.743139;
}
else if (yourplanArr.value.suoshuid == '龙湖里') {
    a.value = 113.593596;
    b.value = 34.743139;
}

// 设置默认值 
if(a.value == null || b.value == null) {
    a.value = 34.749857;
    b.value = 113.665959;
}
console.log(a.value,b.value)
}
// 使用URLSearchParams获取参数
//从网格总览拿过来的经纬度

console.log(a.value); // 输出参数的值
console.log(b.value)
let littlewg = ref('')
let userParams = reactive<any>({
id: '',
planningstyle:'',
mainplanning: '',
suoshuid: '',
createtime: '',
littlewg: '',
completed:'未完成',
})
// let name = this.$route.query.paramName
const initMap=()=> {

AMapLoader.load({
  key:"	a6e5b5f4a677ac91702f680e99a202c5", // 申请好的Web端开发者Key，首次调用 load 时必填
  version:"2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  // plugins:[''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
}).then((AMap)=>{
   map = new AMap.Map("container",{  //设置地图容器id
      viewMode:"3D",    //是否为3D地图模式
      zoom:17,           //初始化地图级别
      center:[a.value,b.value], //初始化地图中心点位置
      zoomEnable:false,
      dragEnable: false,
  });
  // 添加插件
  AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.HawkEye","AMap.Geolocation","AMap.MapType","AMap.MouseTool"], function () {
      var haw = new AMap.HawkEye({
      position: 'LT'
      })
      //异步同时加载多个插件
      // 添加地图插件
      map.addControl(new AMap.Scale()); // 显示当前地图中心的比例尺
      map.addControl(haw); // 显示缩略图

      // 以下是鼠标工具插件
      // const mouseTool = new AMap.MouseTool(map);
      // // mouseTool.rule();// 用户手动绘制折线图,测量距离
      // mouseTool.measureArea(); // 测量面积
  });
  AMap.plugin("AMap.AutoComplete", function () {
      var autoOptions = {
      //city 限定城市，默认全国
      city: "郑州",
      input: 'search'
  };
  //实例化AutoComplete
  var keyword = input.value
  var autoComplete = new AMap.AutoComplete(autoOptions);
   //根据关键字进行搜索 keyword 为搜索的关键词
  autoComplete.on('select', function (e) {
  // e 是选中的结果项
  console.log(e.poi.location.lat,e.poi.location.lng); // 这里可以根据需要打印具体的选中信息，比如 e.poi.name、e.poi.location 等
  map.setCenter([e.poi.location.lng,e.poi.location.lat])
  });
  autoComplete.search(keyword, function (status, result) {
      //搜索成功时，result 即是对应的匹配数据
  });
  AMap.plugin("AMap.PlaceSearch", function () {
});
});
}).catch(e=>{
})
}
const get = async () => {
let latlngs = {}; // 存储解析后的坐标数据`
let result = await GetLat(); // 假设 GetLat() 函数能获取数据
let coordinates
// 遍历数据库传来的数据
for (let i = 0; i < result.data.length; i++) {
let item = result.data[i];
coordinates = JSON.parse(`[${item.latlong}]`); // 解析字符串为数组
// 使用地点名称作为键来组织坐标数据
if (!latlngs[item.name]){
latlngs[item.name] = [];
}
// 将解析后的坐标数组添加到对应地点名称的数组中
latlngs[item.name].push({
coordinates: coordinates,
level: item.level // 将 level 字段也存储起来
});
if(item.panduan == 1&&item.name == yourplanArr.value.suoshuid){
  var pather = [
  [coordinates[0][1],coordinates[0][0]],
  [coordinates[1][1],coordinates[1][0]],
  [coordinates[2][1],coordinates[2][0]],
  [coordinates[3][1],coordinates[3][0]],
]
var polygon = new AMap.Polygon({
  path: pather,
  strokeColor: "#FF0000", 
  strokeWeight: 1,
  strokeOpacity: 0.2,
  fillOpacity: 0.4,
  fillColor: '#FF0000',
  zIndex: 50,
  extData: i,
  
})
map.add([polygon]);
if(item.encode == yourplanArr.value.gridsmall){
  var pather = [
  [coordinates[0][1],coordinates[0][0]],
  [coordinates[1][1],coordinates[1][0]],
  [coordinates[2][1],coordinates[2][0]],
  [coordinates[3][1],coordinates[3][0]],
]
var polygon = new AMap.Polygon({
  path: pather,
  strokeColor: "#00FF00", 
  strokeWeight: 1,
  strokeOpacity: 0.2,
  fillOpacity: 0.4,
  fillColor: '#00FF00',
  zIndex: 50,
  extData: i,
  
})
map.add([polygon]);
}
}
}
}

onMounted(async () => {
window._AMapSecurityConfig = {
    securityJsCode: '3c6f3650ecd9706522c2c8ff004e94f4',
}
await getSearchplan()
initMap()
get()

})
//保存
const save=()=>{
userParams.planningstyle = value1.value;
userParams.mainplanning = textarea.value;
userParams.suoshuid = value.value;
userParams.littlewg = littlewg;
Planning_sendcomplete(userParams)
console.log(userParams)
$router.push({
name: 'gewangproblem',
})
}
//取消
const cancel=()=>{
$router.push({
name: 'comfirm'
})
}
</script>

<style>

</style>