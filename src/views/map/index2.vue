<template>
  <div class="map-container">
    <el-card class="map-card">
      <div class="map-wrapper">
        <div id="container" class="map-content">
          <div id="tooltip" class="tooltip" ref="tooltip"></div>
          
          <!-- 美化后的搜索框 -->
          <div class="search-container">
            <div class="search-box">
              <i class="el-icon-search search-icon"></i>
              <el-input 
                id="search" 
                type="text" 
                class="search-input" 
                v-model="input" 
                placeholder="请输入地点名称搜索..." 
                @input="handleSearch"
              ></el-input>
            </div>
          </div>
          
          <!-- 美化后的图例面板 -->
          <div class="legend-panel">
            <div class="legend-header">
              <i class="el-icon-map-location"></i>
              <span>网格区域图例</span>
            </div>
            <div class="legend-content">
              <div class="legend-item" v-for="(item, index) in legendItems" :key="index">
                <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                <span class="legend-text">{{ item.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="whocar">
            <img src="/public//img//666.png" alt="">
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import {CanLat} from '@/api/product/jingwei/index'
import { GetLat } from '@/api/product/jingwei/index';
import AMapLoader from '@amap/amap-jsapi-loader';
import { shallowRef } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import {ref} from "vue";
import useUserStore from '@/store/modules/users';

let useStore = useUserStore()
let $router = useRouter()
const path = ref([]);
const current_position = ref([]);
const input = ref('')
const gewang = ref([]);
const tooltip = ref(null);

// 图例数据
const legendItems = [
  { name: '星河里', color: '#FA7070' },
  { name: '磨街文创', color: '#888267' },
  { name: '海汇港', color: '#1A5319' },
  { name: '德化', color: '#AF47D2' },
  { name: '油化厂', color: '#FCDE70' },
  { name: '农科路', color: '#FF885B' },
  { name: '银基广场', color: '#6C48C5' },
  { name: '瑞光', color: '#7A1CAC' },
  { name: '龙湖里', color: '#CDC2A5' },
  { name: '公园茂', color: '#98DED9' },
  { name: '晶悦城', color: '#654520' },
  { name: '正弘汇', color: '#FEF9D9' },
  { name: '新悦芸', color: '#A1D6B2' },
  { name: '艺茂仓', color: '#1791fc' }
]

let map

function initMap() {
    window._AMapSecurityConfig = {
        securityJsCode: '3c6f3650ecd9706522c2c8ff004e94f4',
    }
    AMapLoader.load({
        key:"	a6e5b5f4a677ac91702f680e99a202c5",
        version:"2.0",
    }).then((AMap)=>{
         map = new AMap.Map("container",{
            viewMode:"3D",
            zoom:12,
            center:[113.66638304424778,34.75058495912496],
        });
        
        AMap.plugin(["AMap.ToolBar", "AMap.Scale", "AMap.HawkEye","AMap.Geolocation","AMap.MapType","AMap.MouseTool"], function () {
            var haw = new AMap.HawkEye({
            position: 'LT'
            })
            map.addControl(new AMap.Scale());
            map.addControl(haw);
            map.addControl(new AMap.MapType());
        });
        
        map.on('complete', () => {
            get();
        });
        
        AMap.plugin("AMap.AutoComplete", function () {
            var autoOptions = {
            city: "郑州",
            input: 'search'
        };
        var keyword = input.value
        var autoComplete = new AMap.AutoComplete(autoOptions);
         autoComplete.on('select', function (e) {
        console.log(e.poi.location.lat,e.poi.location.lng);
        map.setCenter([e.poi.location.lng,e.poi.location.lat])
        });
        autoComplete.search(keyword, function (status, result) {
            console.log(result);
        });
        AMap.plugin("AMap.PlaceSearch", function () {
        var placeSearch = new AMap.PlaceSearch({
            city: "郑州",
        });
    });
    });
    }).catch(e=>{
        console.log(e);
    })
}

const get = async () => {
  let latlngs = {};
  let result = await GetLat();
  let coordinates
  
  for (let i = 0; i < result.data.length; i++) {
    let item = result.data[i];
     coordinates = JSON.parse(`[${item.latlong}]`);
    if (!latlngs[item.name]){
      latlngs[item.name] = [];
    }
    latlngs[item.name].push({
      coordinates: coordinates,
      level: item.level
    });
    if(item.panduan == 1&&item.name == '星河里'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#FF204E", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#FF204E',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '磨街文创'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#888267", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#888267',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '海汇港'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#1A5319", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1A5319',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '德化'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#AF47D2", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#AF47D2',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '油化厂'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#FCDE70", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#FCDE70',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '农科路'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#FF885B", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#FF885B',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '银基广场'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#6C48C5", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#6C48C5',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '瑞光'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#7A1CAC", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#7A1CAC',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '龙湖里'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#CDC2A5", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#CDC2A5',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '公园茂'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#98DED9", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#98DED9',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '晶悦城'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#654520", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#654520',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '正弘汇'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#FEF9D9", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#FEF9D9',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '新悦汇'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#A1D6B2", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#A1D6B2',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
    if(item.panduan == 1&&item.name == '艺茂仓'){
        var pather = [
        [coordinates[0][1],coordinates[0][0]],
        [coordinates[1][1],coordinates[1][0]],
        [coordinates[2][1],coordinates[2][0]],
        [coordinates[3][1],coordinates[3][0]],
    ]
    var polygon = new AMap.Polygon({
        path: pather,
        strokeColor: "#1791fc", 
        strokeWeight: 0,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 50,
        extData: i,
    })
    map.add([polygon]);
    polygon.on('mouseover', function (e) {
        if (tooltip.value) {
          tooltip.value.innerHTML = `网格名称:${item.name}`;
          tooltip.value.style.left = e.pixel.x + 'px';
          tooltip.value.style.top = e.pixel.y + 'px';
          tooltip.value.style.display = 'block';
        }
      });
    }
  }
}

initMap()
get()
</script>

<style scoped>
.map-container {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.map-card {
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  
  :deep(.el-card__body) {
    padding: 0;
  }
}

.map-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
}

.map-content {
  width: 100%;
  height: 80vh;
  position: relative;
}

/* 搜索框样式 */
.search-container {
  position: absolute;
  top: 60px;
  left: 100px;
  z-index: 1000;
  width: 280px;
}

.search-box {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #667eea;
  font-size: 18px;
  z-index: 2;
}

.search-input :deep(.el-input__wrapper) {
  background: transparent;
  border: none;
  box-shadow: none;
  padding-left: 50px;
  padding-right: 20px;
  height: 50px;
  border-radius: 25px;
}

.search-input :deep(.el-input__inner) {
  height: 50px;
  font-size: 16px;
  color: #333;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: #999;
}

/* 图例面板样式 */
.legend-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
}

.legend-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  
  i {
    color: #667eea;
    font-size: 18px;
  }
}

.legend-content {
  padding: 15px 20px;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.legend-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 工具提示样式 */
.tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 10000;
  display: none;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-container {
    padding: 10px;
  }
  
  .search-container {
    width: calc(100% - 40px);
    top: 10px;
    left: 20px;
  }
  
  .legend-panel {
    width: calc(100% - 40px);
    top: 80px;
    right: 20px;
  }
  
  .map-content {
    height: 70vh;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-container {
  animation: fadeInUp 0.8s ease 0.2s both;
}

.legend-panel {
  animation: fadeInUp 0.8s ease 0.4s both;
}
</style>