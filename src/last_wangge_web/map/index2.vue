<template>
    <el-card class="app-container">
    <div >
        <div style="background-color: #ffffff;">
            <div id="container">
                <div id="tooltip" class="tooltip" ref="tooltip">
                </div>
                <el-input id="search" type="text" class="search" v-model="input" 
                placeholder="请输入内容" @input="handleSearch"></el-input>
                <!-- <el-input id="searcher" type="text" class="searcher" v-model="encodes" style="margin-left: 400px;"
                placeholder="请输入网格名" ></el-input>npm install @supermap/iclient-leaflet
                <el-button @mousedown="e => e.preventDefault()" type="primary" size="primary" class="searchbutton" @click="searchtime">网格定位</el-button> -->
                <div style="background-color: rgba(255, 255, 255, 0.8); width: 130px; height: 170px; z-index: 999; margin-top: 340px; display: flex; flex-direction: column; padding: 10px; position: absolute;padding: 10px;margin-left: 10px;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <div style="background-color: #FA7070; width: 20px; height: 10px; margin-right: 5px;"></div>
                        <h1 style="font-size: 10px; margin: 0;">人流拥挤</h1>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="background-color: #888267; width: 20px; height: 10px; margin-right: 5px;"></div>
                    <h1 style="font-size: 10px; margin: 0;">小摊违停</h1>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="background-color: #1A5319; width: 20px; height: 10px; margin-right: 5px;"></div>
                    <h1 style="font-size: 10px; margin: 0;">垃圾桶爆满</h1>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="background-color: #AF47D2; width: 20px; height: 10px; margin-right: 5px;"></div>
                    <h1 style="font-size: 10px; margin: 0;">噪音污染</h1>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style="background-color: #1791fc; width: 20px; height: 10px; margin-right: 5px; "></div>
                    <h1 style="font-size: 10px; margin: 0;">正常状态</h1>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                    <div style=" width: 26px; height: 10px; margin-right: 5px; font-size: 10px;">1--3</div>
                    <h1 style="font-size: 10px; margin-top: 5px;">评分低--评分高</h1>
                    </div>
                </div>

                <!-- <div class="whocar">
                    <img src="/public//img//666.png" alt="">
                </div>
                <div class="whocare">
                    leaflet with &copy; <a>&nbsp;SuperMap iClient&nbsp;</a> | Map Data &copy;&nbsp;<a>SuperMap iServer</a>
                </div> -->
            </div>
        </div>
    </div>
    </el-card>
</template>
 
<script setup>
import {CanLat, GetLatName} from '@/api/product/jingwei/index'
import { GetLat } from '@/api/product/jingwei/index';
import AMapLoader from '@amap/amap-jsapi-loader';
import useUserStore from '@/store/modules/users'
import { shallowRef } from 'vue';
import {ref,onMounted} from "vue";
import { useRouter, useRoute } from 'vue-router'

let useStore = useUserStore()
const path = ref([]);
const current_position = ref([]);
const input = ref('')
 const gewang = ref([]);
 let $route = useRouter()
 let map
 let a = useStore.lat
 let b = useStore.lng
 let c = useStore.level
 let encodes = ref('')
 let polygonss = []
 const searchtime = () => {
    polygonss.forEach(function(polygon) {
        polygon.setOptions({
            strokeColor: "#FF33FF",  // 恢复默认边框颜色
            strokeWeight: 1,         // 恢复默认边框宽度
            strokeOpacity: 0.2       // 恢复默认边框透明度
        });
    });
    polygonss.forEach(function(polygon) {
    var extData = polygon.getExtData();
    console.log(extData)
    if (extData == encodes.value) { // 根据条件筛选网格
        console.log(123)
        polygon.setOptions({
            strokeColor: "#F6E96B", 
            strokeWeight: 5,
            strokeOpacity: 1, // Default color 
        });
    }
});
 }
function initMap() {
    window._AMapSecurityConfig = {
        securityJsCode: '3c6f3650ecd9706522c2c8ff004e94f4',
    }
    AMapLoader.load({
        key:"	a6e5b5f4a677ac91702f680e99a202c5", // 申请好的Web端开发者Key，首次调用 load 时必填
        version:"2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // plugins:[''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap)=>{
         map = new AMap.Map("container",{  //设置地图容器id
            viewMode:"3D",    //是否为3D地图模式
            zoom:16,           //初始化地图级别
            zooms:[16,20],
            center:[b,a], //初始化地图中心点位置
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
            map.addControl(new AMap.MapType()); // 实现默认图层与卫星图,实时交通图层之间切换
 
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
            console.log(result);
        });
        AMap.plugin("AMap.PlaceSearch", function () {
        var placeSearch = new AMap.PlaceSearch({
            //city 指定搜索所在城市，支持传入格式有：城市名、citycode 和 adcode
            city: "郑州",
        });
    });
    map.on('complete', () => {
            get(); // 确保在地图完全加载后才去绘制网格
        });
    });
    }).catch(e=>{
        console.log(e);
    })
}
const tooltip = ref(null);
const get = async () => {
  let latlngs = {}; // 存储解析后的坐标数据
  let name = useStore.level
  let result = await GetLatName(name); // 假设 GetLat() 函数能获取数据
  console.log(result);
  
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
    if(item.panduan == 1&&item.rubbish == 0 && item.renliu<650&&item.zaosheng<=50&& item.weiting!=1){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#FF33FF", 
        strokeWeight: 1,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 1,
        extData: item.encode,
    })
    let p = (coordinates[1][1]+coordinates[3][1])/2
    let h = (coordinates[3][0]+coordinates[1][0])/2
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
    polygonss.push(polygon)
    let tooltipVisible = false;
let currentTooltipData = null;

text.on('mouseover', function (e) {
    // 防止tooltip内容多次更新
    if (!tooltipVisible) {
        tooltipVisible = true; // 标记tooltip为可见
        currentTooltipData = item; // 保存当前的网格信息
        
        if (tooltip.value) {
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量<br>`;// 其他信息
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});
text.on('click', function (e) {
    // 当文本被点击时，推送新的路由
    $route.push({
        name: 'gewangperson',
    });
    useStore.encode = item.encode
    useStore.renliu = item.renliu
});
text.on('mouseout', function () {
    // 只有在当前鼠标不处于tooltip内时隐藏tooltip
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});

polygon.on('mouseover', function (e) {
    if (!tooltipVisible) {
        // 多边形的mouseover逻辑与文本一致
        tooltipVisible = true;
        currentTooltipData = item;

        if (tooltip.value) {
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量<br>`;// 其他信息;
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});

polygon.on('mouseout', function () {
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});
    }
    else if(item.panduan == 1&&item.renliu>=650){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "FA7070", 
        strokeWeight: 1,
        fillColor: 'FA7070',
        zIndex: 50,
        extData: item.encode,
    })
    let p = (coordinates[1][1]+coordinates[3][1])/2
    let h = (coordinates[3][0]+coordinates[1][0])/2
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
    polygonss.push(polygon)
    let tooltipVisible = false;
let currentTooltipData = null;

text.on('mouseover', function (e) {
  if (tooltip.value) { // 先检查tooltip是否存在
        if (!tooltipVisible) {
            tooltipVisible = true;
            currentTooltipData = item;
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量<br>`;// 其他信息
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});

text.on('click', function (e) {
    // 当文本被点击时，推送新的路由
    $route.push({
        name: 'gewangperson',
    });
    useStore.encode = item.encode
    useStore.renliu = item.renliu
});
text.on('mouseout', function () {
    // 只有在当前鼠标不处于tooltip内时隐藏tooltip
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});

polygon.on('mouseover', function (e) {
  if (tooltip.value) { // 先检查tooltip是否存在
        if (!tooltipVisible) {
            tooltipVisible = true;
            currentTooltipData = item;
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量<br>`;// 其他信息
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});

polygon.on('mouseout', function () {
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});
    } 
    else if(item.panduan == 1&&item.zaosheng>=50){
        console.log(item.encode)
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#AF47D2", 
        strokeWeight: 1,
        fillColor: '#AF47D2',
        zIndex: 50,
        extData: item.encode,
    })
    let p = (coordinates[1][1]+coordinates[3][1])/2
    let h = (coordinates[3][0]+coordinates[1][0])/2
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
    polygonss.push(polygon)
    let tooltipVisible = false;
let currentTooltipData = null;

text.on('mouseover', function (e) {
  if (tooltip.value) { // 先检查tooltip是否存在
        if (!tooltipVisible) {
            tooltipVisible = true;
            currentTooltipData = item;
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量`;// 其他信息
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});

text.on('click', function (e) {
    // 当文本被点击时，推送新的路由
    console.log("当文本被点击时，推送新的路由");
    
    $route.push({
        name: 'gewangperson',
    });
    useStore.encode = item.encode
    useStore.renliu = item.renliu
});
text.on('mouseout', function () {
    // 只有在当前鼠标不处于tooltip内时隐藏tooltip
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});

polygon.on('mouseover', function (e) {
  if (tooltip.value) { // 先检查tooltip是否存在
        if (!tooltipVisible) {
            tooltipVisible = true;
            currentTooltipData = item;
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量`;// 其他信息
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});

polygon.on('mouseout', function () {
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});
    }
    else if(item.panduan == 1&&item.weiting == 1){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#3C3D37", 
        strokeWeight: 1,
        fillColor: '#3C3D37',
        zIndex: 80,
        extData: item.encode,
    })
    let p = (coordinates[1][1]+coordinates[3][1])/2
    let h = (coordinates[3][0]+coordinates[1][0])/2
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
    polygonss.push(polygon)
    let tooltipVisible = false;
let currentTooltipData = null;

text.on('mouseover', function (e) {
  if (tooltip.value) { // 先检查tooltip是否存在
        if (!tooltipVisible) {
            tooltipVisible = true;
            currentTooltipData = item;
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量`;// 其他信息
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});

text.on('click', function (e) {
    // 当文本被点击时，推送新的路由
    $route.push({
        name: 'gewangperson',
    });
    useStore.encode = item.encode
    useStore.renliu = item.renliu
});
text.on('mouseout', function () {
    // 只有在当前鼠标不处于tooltip内时隐藏tooltip
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});

polygon.on('mouseover', function (e) {
  if (tooltip.value) { // 先检查tooltip是否存在
        if (!tooltipVisible) {
            tooltipVisible = true;
            currentTooltipData = item;
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量`;// 其他信息
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});

polygon.on('mouseout', function () {
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});
    }
    else if(item.panduan == 1&&item.rubbish!==0){
        console.log(item.rubbish)
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "1A5319", 
        strokeWeight: 1,
        fillColor: '1A5319',
        zIndex: 50,
        extData: item.encode,
    })
    let p = (coordinates[1][1]+coordinates[3][1])/2
    let h = (coordinates[3][0]+coordinates[1][0])/2
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
    polygonss.push(polygon)
    let tooltipVisible = false;
let currentTooltipData = null;

text.on('mouseover', function (e) {
  if (tooltip.value) { // 先检查tooltip是否存在
        if (!tooltipVisible) {
            tooltipVisible = true;
            currentTooltipData = item;
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量<br>`;// 其他信息
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});

text.on('click', function (e) {
    // 当文本被点击时，推送新的路由
    $route.push({
        name: 'gewangperson',
    });
    useStore.encode = item.encode
    useStore.renliu = item.renliu
});
text.on('mouseout', function () {
    // 只有在当前鼠标不处于tooltip内时隐藏tooltip
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});

polygon.on('mouseover', function (e) {
  if (tooltip.value) { // 先检查tooltip是否存在
        if (!tooltipVisible) {
            tooltipVisible = true;
            currentTooltipData = item;
            tooltip.value.innerHTML = `网格编码:${item.encode}<br>网格评分:${item.pinfeng}<br>网格灯光指数:${item.dengguang}<br>网格人流量:${item.renliu}<br>网格内摄像头数量:${item.shexiangtou}<br>网格噪声分贝:${item.zaosheng}<br>网格POI密度:${item.poimidu}<br>点击查看网格实时人流量<br>`;// 其他信息
            tooltip.value.style.left = e.pixel.x + 'px';
            tooltip.value.style.top = e.pixel.y + 'px';
            tooltip.value.style.display = 'block';
        }
    }
});

polygon.on('mouseout', function () {
    if (tooltipVisible) {
        tooltip.value.style.display = 'none'; 
        tooltipVisible = false; 
        currentTooltipData = null; // 重置currentTooltipData
    }
});
    }
  }
  
}
// 处理tooltip按钮点击事件

onMounted(() => {

  initMap()
    get()
    console.log(polygonss)
})
</script>
 
<style>
#container{
    padding:-20px;
    margin-top: -10px;
    width: 100%;
    height: 590px;
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
.tooltip {
  width: 160px;
  height: 170px;
  font-size: 13px;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: none; /* Hidden by default */
  z-index: 1000; /* Make sure it's on top */
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
    width: 98px;
    height: 29px;
    font-size: 12px;
    padding: 5px;
    margin-left: 1145px;
    margin-top: 544px;
}
.searcher{
    width: 200px;
    z-index: 999;
    display: flex;
    position: absolute;
    margin-left: 800px;
}
.searchbutton{
    z-index: 999;
    display: flex;
    position: absolute;
    margin-left: 1020px;
}
</style>