<template>
      <div>
        <el-card>
        <!-- 添加修改数据 -->
        <el-form :inline="true">
          <el-form-item label="网格名称">
            <el-select
            v-model="value"
            placeholder="请选择要规划的网格"
            size="primary"
            style="width: 240px"
            @change = change(value)
          >
          <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          />
    </el-select>
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
            <el-select
            v-model="value1"
            placeholder="请选择要规划的类型"
            size="primary"
            style="width: 240px"
          >
          <el-option
          v-for="item in option1"
          :key="item.value1"
          :label="item.label"
          :value="item.value1"
          />
        </el-select>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item label="具体规划">
            <el-input
        v-model="textarea"
        style="width: 240px"
        :rows="2"
       type="textarea"
        placeholder="请输入详细要求"
        />
          </el-form-item>
        </el-form>
        <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" icon="Plus" @click="save">保存</el-button>
        <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="cancel">取消</el-button>
    </el-card> 
      </div> 
      
</template>

<script setup lang="ts">
import {ref,onMounted,reactive} from 'vue';
import {CanLat} from '@/api/product/jingwei/index'
import { GetLat } from '@/api/product/jingwei/index';
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting'
import {Planning_sendcomplete} from '@/api/planning/index'
let LayOutSettingStore = useLayOutSettingStore()
let $router = useRouter()
//地图部分
const path = ref([]);
const current_position = ref([]);
const input = ref('')
const gewang = ref([]);
let map 
var a=113.665959
var b=34.749857
const value = ref('')
const value1 = ref('')
const change=(value:String)=>{
  //导入各地坐标
if(value == '公园茂'){
  a=113.555967
  b=34.819663
}
else if (value == '正弘汇'){
  a=113.566227
  b=34.808968
}
else if (value == '欣悦荟'){
  a=113.541244
  b=34.830908
}
else if (value == '万达广场（高新）'){
  a=113.64892
  b=34.75306
}
else if (value == '德化'){
  a=113.665959
  b=34.749857
}
else if (value == '油化厂'){
  a=113.640171
  b=34.772529
}
else if (value == '农科路'){
  a=113.684864
  b=34.792415
}
else if (value == '星河里'){
  a=113.734797
  b=34.781938
}
else if (value == '磨李'){
  a=113.64278
  b=34.79827
}
else if (value == '银基广场'){
  a=113.666518
  b=34.742197
}
else if (value == '晶悦城'){
  a=113.542971
  b=34.806227
}
else if (value == '瑞光'){
  a=113.638592
  b=34.762959
}
else if (value == '艺茂仓'){
  a=113.618538
  b=34.858787
}
else if (value == '海汇港'){
  a=113.770473
  b=34.752527
}
else if (value == '磨街文创'){
  a=113.593596
  b=34.743139
}
else if (value == '龙湖里'){
  a=113.593596
  b=34.743139
}
map.setCenter([a, b])
}
let textarea = ref('')
const options = [
  {
    value: '公园茂',
    label: '公园茂',
  },
  {
    value: '正弘汇',
    label: '正弘汇',
  },
  {
    value: '欣悦荟',
    label: '欣悦荟',
  },
  {
    value: '万达广场（高新）',
    label: '万达广场（高新）',
  },
  {
    value: '德化',
    label: '德化',
  },
  {
    value: '油化厂',
    label: '油化厂',
  },
  {
    value: '农科路',
    label: '农科路',
  },
  {
    value: '星河里',
    label: '星河里',
  },
  {
    value: '磨李',
    label: '磨李',
  },
  {
    value: '银基广场',
    label: '银基广场',
  },
  {
    value: '晶悦城',
    label: '晶悦城',
  },
  {
    value:  '瑞光',
    label: '瑞光',
  },
  {
    value:  '艺茂仓',
    label: '艺茂仓',
  },
  {
    value: '海汇港',
    label: '海汇港',
  },
  {
    value: '磨街文创',
    label: '磨街文创',
  },
  {
    value: '龙湖里',
    label: '龙湖里',
  },
]
const option1 = [
  {
    value1: '招募职员',
    label: '招募职员',
  },
  {
    value1: '添加设施',
    label: '添加设施',
  },
  {
    value1: '调配人员',
    label: '调配人员',
  },
]
// 使用URLSearchParams获取参数
//从网格总览拿过来的经纬度
if(a==null||b==null){
  a=34.749857;
  b=113.665959
}
console.log(a); // 输出参数的值
console.log(b)
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
          center:[a,b], //初始化地图中心点位置
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
      console.log(e);
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
  if(item.panduan == 0){
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
  polygon.on('click',function(e){
      littlewg = item.encode
      console.log(littlewg)
  })
  }
}
}

onMounted(() => {
  window._AMapSecurityConfig = {
        securityJsCode: '3c6f3650ecd9706522c2c8ff004e94f4',
    }
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
  name: 'attr',
})
}
//取消
const cancel=()=>{
  $router.push({
  name: 'attr'
 })
}
</script>

<style>

</style>