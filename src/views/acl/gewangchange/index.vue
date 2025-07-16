<template>
  <el-card class="app-container">
  <div >
      <div style="background-color: #ffffff;">
          <div id="container">
          <el-button @mousedown="e => e.preventDefault()" style="width: 100px; height: 40px; background-color: skyblue; z-index: 999; margin-top: 20px; left: 550px; display: flex; flex-direction: column; padding: 10px; position: absolute;padding: 10px;margin-left: 10px;" @click="caner">确认修改</el-button>
            <div style="background-color: rgba(255, 255, 255, 0.8); width: 130px; height: 90px; z-index: 999; margin-top: 440px; display: flex; flex-direction: column; padding: 10px; position: absolute;padding: 10px;margin-left: 10px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <div style="background-color: #FF0000; width: 20px; height: 10px; margin-right: 5px;"></div>
                        <h1 style="font-size: 10px; margin: 0;">已选中网格</h1>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="background-color: #000000; width: 20px; height: 10px; margin-right: 5px; "></div>
                    <h1 style="font-size: 10px; margin: 0;">未选中网格</h1>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style=" width: 26px; height: 10px; margin-right: 5px; font-size: 10px;">1--3</div>
                    <h1 style="font-size: 10px; margin-top: 5px;">评分低--评分高</h1>
                    </div>
                </div>
            <div id="tooltip" class="tooltip" ref="tooltip"></div>
              <div class="whocar">
                  <img src="/public//img//666.png" alt="">
              </div>
              <div class="whocare">
                  leaflet with &copy; <a>&nbsp;SuperMap iClient&nbsp;</a> | Map Data &copy;&nbsp;<a>SuperMap iServer</a>
              </div>
          </div>
      </div>
  </div>
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    title="修改网格"
    width="500"
    :before-close="handleClose"
  >
    <span>你确定要修改该网格范围吗</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @mousedown="e => e.preventDefault()" @click="dialogVisible = false">取消</el-button>
        <el-button @mousedown="e => e.preventDefault()" type="primary" @click="can">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {CanLat} from '@/api/product/jingwei/index'
import { GetLat } from '@/api/product/jingwei/index';
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from 'vue';
import {ref} from "vue";
import { useRouter, useRoute } from 'vue-router'
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/users';
let LayOutSettingStore = useLayOutSettingStore()
// let $route = useRouter;
const dialogVisible = ref(false)
const path = ref([]);
const current_position = ref([]);
const input = ref('')
const gewang = ref([]);
let map
let useStore = useUserStore()
// 使用URLSearchParams获取参数
//从网格总览拿过来的经纬度
var a = useStore.centerlat
var b = useStore.centerlng
var c = useStore.centername
console.log(a,b,c)
const tooltip = ref(null); // 用于存储 tooltip 元素
// if(a==null||b==null){
//   a=34.749857;
//   b=113.665959
// }
// if(c == null){
//   c='德化'
// }
if (!a || !b) {
  a = 34.749857
  b = 113.665959
}

if (!c || c.trim() === '') {
  c = '德化'
}
console.log(a); // 输出参数的值
console.log(b)

// let name = this.$route.query.paramName
function initMap() {
  window._AMapSecurityConfig = {
      // securityJsCode: '3c6f3650ecd9706522c2c8ff004e94f4',
      securityJsCode: '3c6f3650ecd9706522c2c8ff004e94f4',
  }
  AMapLoader.load({
      // key:"	a6e5b5f4a677ac91702f680e99a202c5", 
      key:"	a6e5b5f4a677ac91702f680e99a202c5", // 申请好的Web端开发者Key，首次调用 load 时必填
      version:"2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      // plugins:[''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  }).then((AMap)=>{
       map = new AMap.Map("container",{  //设置地图容器id
          viewMode:"3D",    //是否为3D地图模式
          zoom:16,           //初始化地图级别
          center:[b,a], //初始化地图中心点位置
      });
      // 添加插件
      AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.HawkEye","AMap.Geolocation","AMap.MapType","AMap.MouseTool","AMap.Polygon","AMap.Text"], function () {
          var haw = new AMap.HawkEye({
          position: 'LT'
          })
          //异步同时加载多个插件
          // 添加地图插件
          map.addControl(new AMap.Scale()); // 显示当前地图中心的比例尺
          map.addControl(haw); // 显示缩略图
          map.addControl(new AMap.MapType()); // 实现默认图层与卫星图,实时交通图层之间切换

          // 以下是鼠标工具插件
          // const mouseTool = new AMap.MouseTool(map);
          // // mouseTool.rule();// 用户手动绘制折线图,测量距离
          // mouseTool.measureArea(); // 测量面积
      });
      map.on("complete", () => {
        console.log("ssssssssssssssssssssss")
        map.resize(); 
        get(); // 地图加载完成再绘图
        console.log("aaaaaaaaaaaaaaaaaaa")
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
      var placeSearch = new AMap.PlaceSearch({
          //city 指定搜索所在城市，支持传入格式有：城市名、citycode 和 adcode
          city: "郑州",
      });
  });
  });
  }).catch(e=>{
      console.log(e);
  })
}
let tiaozheng = []
const get = async () => {
let latlngs = {}; // 存储解析后的坐标数据
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
  console.log(`调试输出：item.name=${item.name}, item.panduan=${item.panduan}, 当前城市c=${c}`);

  if(item.panduan == 1&&item.name == c){
      var pather = [
      [coordinates[0][1],coordinates[0][0]],
      [coordinates[1][1],coordinates[1][0]],
      [coordinates[2][1],coordinates[2][0]],
      [coordinates[3][1],coordinates[3][0]],
  ]
  let p = (coordinates[1][1]+coordinates[3][1])/2
  let h = (coordinates[3][0]+coordinates[1][0])/2

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
  var text = new AMap.Text({
        text:item.pinfeng,
        anchor:'center', // 设置文本标记锚点
        draggable:true,
        cursor:'pointer',
        angle:10,
        style:{
            'margin-bottom': '1px',
            'border-radius': '.25px',
            'width': '50px',
            'border-width': 0,
            'text-align': 'center',
            'font-size': '10px',
            'color': 'blue',
            'background-color': 'rgba(0, 0, 0, 0)',
            'font-style': 'normal',
        },
        position: [p,h]
    });
    text.setMap(map);
  map.add([polygon]);
  polygon.on('mouseout', function () {
        if (tooltip.value) {
          tooltip.value.style.display = 'none'; // Hide tooltip on mouse out
        }
      });
  text.on('mouseout', function () {
        if (tooltip.value) {
          tooltip.value.style.display = 'none'; // Hide tooltip on mouse out
        }
      });
  text.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}`; // Set text to tooltip
          tooltip.value.style.left = e.pixel.x + 'px'; // Set left position
          tooltip.value.style.top = e.pixel.y + 'px'; // Set top position
          tooltip.value.style.display = 'block'; // Show tooltip
        }
      });
  polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}`; // Set text to tooltip
          tooltip.value.style.left = e.pixel.x + 'px'; // Set left position
          tooltip.value.style.top = e.pixel.y + 'px'; // Set top position
          tooltip.value.style.display = 'block'; // Show tooltip
        }
      });
  polygon.on('click',function(e){
    tiaozheng.push(item.encode)
    let clickedPolygon = e.target;
    clickedPolygon.setOptions({
      strokeColor: "#F6E96B", 
      strokeWeight: 5,
      strokeOpacity: 1, // Default color 
    });
  })
  text.on('click',function(e){
    tiaozheng.push(item.encode)
    let clickedPolygon = e.target;
    clickedPolygon.setOptions({
      strokeColor: "#F6E96B", 
      strokeWeight: 5,
      strokeOpacity: 1, // Default color 
    });
  })
  }
  if(item.panduan == 0&&item.name == c){
      var pather = [
      [coordinates[0][1],coordinates[0][0]],
      [coordinates[1][1],coordinates[1][0]],
      [coordinates[2][1],coordinates[2][0]],
      [coordinates[3][1],coordinates[3][0]],
  ]
  let p = (coordinates[1][1]+coordinates[3][1])/2
  let h = (coordinates[3][0]+coordinates[1][0])/2
  var polygon = new AMap.Polygon({
      path: pather,
      strokeColor: "#000000", 
      strokeWeight: 1,
      strokeOpacity: 0.2,
      fillOpacity: 0.4,
      fillColor: '#000000',
      zIndex: 50,
      extData: i,
  })
  var text = new AMap.Text({
        text:item.pinfeng,
        anchor:'center', // 设置文本标记锚点
        draggable:true,
        cursor:'pointer',
        angle:10,
        style:{
            'margin-bottom': '1px',
            'border-radius': '.25px',
            'width': '50px',
            'border-width': 0,
            'text-align': 'center',
            'font-size': '10px',
            'color': 'blue',
            'background-color': 'rgba(0, 0, 0, 0)',
            'font-style': 'normal',
        },
        position: [p,h]
    });
    text.setMap(map);
  map.add([polygon]);
  polygon.on('mouseout', function () {
        if (tooltip.value) {
          tooltip.value.style.display = 'none'; // Hide tooltip on mouse out
        }
      });
  text.on('mouseout', function () {
        if (tooltip.value) {
          tooltip.value.style.display = 'none'; // Hide tooltip on mouse out
        }
      });
  text.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}`; // Set text to tooltip
          tooltip.value.style.left = e.pixel.x + 'px'; // Set left position
          tooltip.value.style.top = e.pixel.y + 'px'; // Set top position
          tooltip.value.style.display = 'block'; // Show tooltip
        }
      });
  polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}`; // Set text to tooltip
          tooltip.value.style.left = e.pixel.x + 'px'; // Set left position
          tooltip.value.style.top = e.pixel.y + 'px'; // Set top position
          tooltip.value.style.display = 'block'; // Show tooltip
        }
      });
  polygon.on('click',function(e){
      tiaozheng.push(item.encode)
      let clickedPolygon = e.target;
      // CanLat({ encode: item.encode })
      // LayOutSettingStore.refresh = !LayOutSettingStore.refresh
      clickedPolygon.setOptions({
      strokeColor: "#F6E96B", 
      strokeWeight: 5,
      strokeOpacity: 1, // Default color 
    });
  })
  text.on('click',function(e){
    tiaozheng.push(item.encode)
    let clickedPolygon = e.target;
    clickedPolygon.setOptions({
      strokeColor: "#F6E96B", 
      strokeWeight: 5,
      strokeOpacity: 1, // Default color 
    });
      // CanLat({ encode: item.encode })
      // LayOutSettingStore.refresh = !LayOutSettingStore.refresh
  })
  }
}

}
const can =()=>{
  console.log(tiaozheng)
  for(let i = 0;i<tiaozheng.length;i++){
    CanLat({ encode: tiaozheng[i] })
  }
  tiaozheng = []
  dialogVisible.value = false
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
const caner = () => {
  dialogVisible.value = true
}
initMap()
// get()

</script>

<style>
#container{
  padding:-20px;
  margin-top: -10px;
  width: 100%;
  height: 590px;
}
.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: none; /* Hidden by default */
  z-index: 1000; /* Make sure it's on top */
}
.amap-logo{
 display: none;
 opacity:0 !important;
}
.amap-copyright {
 opacity:0;
}
.search{
  width: 200px;
  z-index: 999;
  display: flex;
  position: absolute;
  margin-left: 150px;
}
.amap-sug-result{
z-index: 999;
display: flex;
position: absolute;
color: black;
opacity: 1;
}
.wangge{
width: 100px;
height: 50px;
position: absolute;
margin-left: 350px;
z-index: 999;
background-color: white;
}
.create{
width: 100px;
height: 50px;
position: absolute;
margin-left: 400px;
z-index: 999;
background-color: white;
display:flex;
}
.whocare{
  display: flex;
  position: absolute;
  z-index: 999;
  background: white;
  width: 352.34px;
  height: 16.8px;
  font-size: 12px;
  padding: 5px;
  margin-left: 885px;
  margin-top: 574px;
  text-align:center;
  align-items:center;
}
.whocar{
  display: flex;
  position: absolute;
  z-index: 999;
  width: 94px;
  height: 29px;
  font-size: 12px;
  padding: 5px;
  margin-left: 1145px;
  margin-top: 544px;
}
</style>