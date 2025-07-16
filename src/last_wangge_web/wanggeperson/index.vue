<template>
    <p></p>
    <div class="tool">
      <el-select v-model="value" class="m-2" placement="top-start" placeholder="请选择监控" size="large"
        style="margin-right: 10px;" @change="startWeighing">
        <el-option v-for="item in tableData" :key="item.value" :label="item.label" :value="item.value"
        />
      </el-select>
      <el-input placeholder="请输入网格编码" v-model="number" style="width: 150px; margin-right: 10px" />
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="large" plain @click="startWeighing">开始查找</el-button>
    </div>
    <el-card class="box-card">
      <div>
      <span class="show">
        {{ weight }}
        <span style="font-size: 15px; color: red;" v-if="weightNumber>600">
          该网格目前较为拥挤
        </span>
        <span style="font-size: 15px; color: green;" v-if="weightNumber<=600">
          该网格目前正常
        </span> 
        <span style="font-size: 15px; color: red;" @click="solve" v-if="useStore.renliu>=600">前往解决</span>
      </span>
     
    </div>
      <video id="root" class="video" loop="false" autoplay="false" muted></video>
    </el-card>
  </template>
  <script setup>
   import { ref } from "vue";
import { onMounted,onBeforeUnmount } from "vue";
// import { fabric } from "fabric";
import useUserStore from '@/store/modules/users'
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from 'vue-router'
import { Last_GeWang_zhemo } from "@/api/last_gewang/index";
// 提取查询参数
let useStore = useUserStore()
const weight = ref("000")
const value = ref("摄像头1");
const number = ref()
let weightNumber = ref()
let $router = useRouter()
let intervalId = null; // 定义一个变量存储定时器ID
const tableData = [
  {
    value: '摄像头1',
    label: '摄像头1',
  },
  {
    value: '摄像头2',
    label: '摄像头2',
  },
  {
    value: '摄像头3',
    label: '摄像头3',
  },
]
let hello = ref()
if(useStore.encode ===''){
  number.value = 40031
}
else{
  number.value = useStore.encode
}
const video = [
  "/public/video/renliu1.mp4",
  "/public/video/renliu.mp4",
  // "/public/video/renliu3.mp4",
  //  "/public/video/renliu5.mp4"
]

const startWeighing = () => {
  const num = getmInt(0, 1);
console.log(video[num])
  if (number.value == "") {
    ElMessage({
      message: "请输入网格编码",
      type: "warning",
    });
  } else {
    playVideo(video[num]);
    startRandomWeight()
    useStore.encode = ''
  }
};
function getmInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const solve = async () =>{
  useStore.dingweiencode = useStore.encode
    let zhemo = parseInt(useStore.dingweiencode)
    console.log(typeof zhemo); 
    console.log(zhemo)
    let result = await Last_GeWang_zhemo(zhemo)
    console.log(result);
    
    console.log(result.data+"ssssssssssssssssssss")
    useStore.dingweiid = result.data
  $router.push({
  name: 'solvegewangproble'
})
}
// const playVideo = (url) => {
//   let player = document.querySelector("#root");
//   player.src = url; // 设置视频源
//   player.muted = true; // 确保视频静音
//   player.play().catch(error => {
//     console.error("Error playing video:", error);
//   });
//   player.onended = () => {
//     console.log(111)
//     player.pause(); // 播放结束后暂停视频
//   };
// };
const playVideo = (url) => {
  let player = document.querySelector("#root");

  // 确保视频元素存在
  if (player) {
    player.src = url; // 设置视频源
    player.muted = true; // 确保视频静音

    // 视频加载完成后开始播放
    player.oncanplay = () => {
      player.play().catch(error => {
        console.error("Error playing video:", error);
      });
    };

    player.onended = () => {
      console.log("Video ended");
      player.pause(); // 播放结束后暂停视频
    };
  } else {
    console.error('Video player element not found.');
  }
};

const startRandomWeight = () => {
  if(useStore.renliu!= ''){
    weight.value = Math.floor(useStore.renliu / 3);
    weightNumber = Math.floor(parseFloat(weight.value)*3+40);
  }else {
    weight.value = Math.floor(Math.floor((Math.random() * 100) + 500) / 3);
    weightNumber = Math.floor(parseFloat(weight.value)*3);
  }
    
    intervalId = setInterval(() => {
    // 随机生成加减操作 + 1; // 生成 1 到 10 之间的随机数
    const shouldIncrease = Math.random() >= 0.5;
    const change = Math.floor(Math.random() * 10) // 生成一个随机布尔值

    if (shouldIncrease) {
      weight.value += change; // 进行加法
      weightNumber = Math.floor(parseFloat(weight.value)*3);
    } else {
      weight.value -= change; // 进行减法
      weightNumber = Math.floor(parseFloat(weight.value)*3);
    }
    
    // 限制 weight 的范围，这里假设希望控制在 0 到 1000 之间
    if (weight.value < 0) {
      weight.value = 0; // 最小值为 0
      weightNumber = Math.floor(parseFloat(weight.value)*3);
    } else if (weight.value > 1000) {
      weight.value = 1000; // 最大值为 1000
      weightNumber = Math.floor(parseFloat(weight.value)*3);
    }
  }, 3000);
   };
   
   onBeforeUnmount(() => {
     clearInterval(intervalId); // 组件卸载时清除定时器
     weight.value = 542
     playVideo(video[0])
   });
   onMounted(()=>{
    playVideo(video[0])
    startRandomWeight()
    console.log(useStore.renliu)
    
   })
  </script>

  <style scoped>
.home {
  width: 99%;
  height: 430px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
}

/* #canvas {} */

.operate {
  margin-top: 30px;
}

.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  height: 32px;
  white-space: nowrap;
  cursor: pointer;
  padding: 8px 15px;
  border: 1px solid #ddd;
}

.box-card {
  width: calc(100% - 42px);
  height: 650px;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.show {
    top: -250px;
    background-color:null;
    padding: 10px;
    font-size: 100px;
    font-family: "led";
    align-items: center;
    position: relative;
    /* 添加垂直居中属性 */
    color: red;
  }

  .video {
    position: absolute;
    top:200px;
    left: 200px;
    width: 900px;
    height: 60%;
  }

.tool {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  margin-left: 20px;
}
  </style>