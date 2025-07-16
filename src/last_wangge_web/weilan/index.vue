<template>
  <div>
    <div class="tool">
      <el-select v-model="value" class="m-2" placement="top-start" placeholder="请选择监控" size="large"
        style="margin-right: 10px; margin-left: -20px;">
        <el-option v-for="item in tableData" :key="item.id" :label="item.cameraName" :value="item.id"
          @click="selectCamera(item)" />
      </el-select>
      <el-input type="text" placeholder="请输入网格名" v-model="valueer" style="width: 200px; margin-right: 10px;"></el-input>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="large" plain @click="startDrawing">添加电子围栏</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="danger" size="large" plain @click="destroy">取消绘制</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="success" size="large" plain @click="saveDrawing">保存电子围栏</el-button>
    </div>
    <el-card>
      <canvas 
        width="1240" 
        height="510" 
        id="c" 
        style="border: 1px solid #ccc; cursor: crosshair;" 
        ref="myCanvas"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseLeave">
      </canvas>
    </el-card>
  </div>
</template>

<script setup>
import useUserStore from '@/store/modules/users';
import { ref, onMounted,reactive} from 'vue';
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from 'vue-router'
import { Last_GeWang_WeiLan } from '@/api/last_gewang/index';
let useStore = useUserStore()
let valueer = ref("40031");
let value = ref("摄像头1");
let $route = useRouter()
const myCanvas = ref(null);
let isDrawingEnabled = false; // 控制绘制启用状态
let isDrawing = false; // 是否正在绘制
let startX = 0; // 起始 x 坐标
let startY = 0; // 起始 y 坐标
let rectWidth = 0; // 矩形宽度
let rectHeight = 0; // 矩形高度
let bgImg = new Image(); // 定义背景图像
const tableData = [
  {
    id: 1,
    regionid: 19,
    cameraName: "摄像头1",
    src:'/public/img/weiting1.png',
    cool:{x:151.1999969482422,y: 105.19999694824219,w:955,h:361,}
  },
  {
    id: 2,
    regionid: 20,
    cameraName: "摄像头2",
    src:'/public/img/weiting2.png',
    cool:{x: 282.1999969482422,y: 3.1999969482421875,w:648,h:399,}
  },
  {
    id: 3,
    regionid: 29,
    cameraName: "摄像头3",
    src:'/public/img/weiting3.png',
    cool:{x: 282.1999969482422,y: 3.1999969482421875,w:912,h:339,}
  },
  {
    id: 4,
    cameraName: "摄像头4",
    cameraUri: "6号楼",
    src:'/public/img/weiting4.png',
    cool:{x: 7.1999969482421875,y:165.1999969482422,w: 1232,h:192,}
  },
];
let cool={x:0,y:0,w:0,h:0}
// 用于存储绘制的矩形
let recters = []; // 存储已经绘制的矩形
let rects = []; // 存储已经绘制的矩形
// 绘制背景的函数
const drawBackground = (context) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // 清空画布
  context.drawImage(bgImg, 0, 0, context.canvas.width, context.canvas.height); // 绘制背景图像
};

// 绘制矩形的逻辑
const drawRect = (context, x, y, w, h) => {
  context.fillStyle = 'rgba(209, 233, 246, 0.6)'; // 填充颜色
  context.fillRect(x, y, w, h); // 填充矩形

  context.strokeStyle = 'blue'; // 边框颜色
  context.lineWidth = 1; // 边框宽度
  context.strokeRect(x, y, w, h); // 绘制矩形的边框
};
// 处理摄像头选择事件
const selectCamera = (item) => {
  value.value = item.id; // 更新选中的摄像头
  bgImg.src = item.src; // 根据选择的摄像头更新背景图像源

  // 当背景图像加载完成后绘制
  bgImg.onload = () => {
    const canvas = myCanvas.value;
    const context = canvas.getContext('2d');
    drawBackground(context); // 绘制选中的摄像头背景
    recters = [];
    recters.push(item.cool); // 将默认矩形添加到矩形列表
    cool.x = item.cool.x
    cool.y = item.cool.y
    cool.w = item.cool.w
    cool.h = item.cool.h
    recters.forEach(({ x, y, w, h }) =>drawRect(context, item.cool.x, item.cool.y, item.cool.w, item.cool.h));
  };
};
let cooler = {x:tableData[0].cool.x,y:tableData[0].cool.y,w:tableData[0].cool.w,h:tableData[0].cool.h}
const union = () => {
  value.value = tableData[0].cameraName; // 更新选中的摄像头
  bgImg.src = tableData[0].src; // 根据选择的摄像头更新背景图像源

  // 当背景图像加载完成后绘制
  bgImg.onload = () => {
    const canvas = myCanvas.value;
    const context = canvas.getContext('2d');
    drawBackground(context); // 绘制选中的摄像头背景
    recters = [];
    recters.push(cooler); // 将默认矩形添加到矩形列表
    cool.x = tableData[0].cool.x
    cool.y = tableData[0].cool.y
    cool.w = tableData[0].cool.w
    cool.h = tableData[0].cool.h
    recters.forEach(({ x, y, w, h }) =>drawRect(context, tableData[0].cool.x, tableData[0].cool.y, tableData[0].cool.w, tableData[0].cool.h));
  };
};
// 点击“绘制电子围栏”按钮
const startDrawing = () => {
  isDrawingEnabled = true; // 启用绘制
};

// 处理鼠标按下事件
const onMouseDown = (event) => {
  if (!isDrawingEnabled) return; // 如果未启用绘制，则返回

  const canvas = myCanvas.value;
  const rect = canvas.getBoundingClientRect();
  startX = event.clientX - rect.left; // 获取起始 x 坐标
  startY = event.clientY - rect.top;  // 获取起始 y 坐标
  console.log(startX,startY)
  isDrawing = true; // 标记为正在绘制
};

// 处理鼠标移动事件
const onMouseMove = (event) => {
  const canvas = myCanvas.value;
  const context = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();

  if (isDrawing) {
    const currentX = event.clientX - rect.left; // 获取当前 x 坐标
    const currentY = event.clientY - rect.top;  // 获取当前 y 坐标
    rectWidth = currentX - startX; // 计算宽度
    rectHeight = currentY - startY; // 计算高度
    console.log(rectHeight,rectWidth)
    drawBackground(context); // 首先绘制背景
    recters.forEach(({ x, y, w, h }) =>drawRect(context, cool.x, cool.y, cool.w, cool.h));
    rects.forEach(({ x, y, w, h }) => drawRect(context, x, y, w, h)); // 绘制已绘制的矩形
    drawRect(context, startX, startY, rectWidth, rectHeight); // 绘制当前矩形
  }
};

// 处理鼠标松开事件
const onMouseUp = () => {
  isDrawing = false; // 标记为不再绘制
  // 将当前矩形加入已绘制的矩形列表
  rects.push({ x: startX, y: startY, w: rectWidth, h: rectHeight });
};
// 处理鼠标离开画布
const onMouseLeave = () => {
  isDrawing = false; // 如果鼠标离开画布，也终止绘制
};

// 取消绘制
const destroy = () => {
  isDrawingEnabled = false; // 禁用绘制
  isDrawing = false; // 终止绘制
  rects = []; // 清空已绘制的矩形
  const canvas = myCanvas.value;
  const context = canvas.getContext('2d');
  drawBackground(context); // 重新绘制背景图像
  recters.forEach(({ x, y, w, h }) =>drawRect(context, cool.x, cool.y,cool.w,cool.h));
};
let weilanarr = reactive ({
  renwutype: '小摊违停',
  describle: '小摊商户在非摆摊位置摆摊，请求安保人员前往引导清摊',
  gridsmall: '',
  suoshuid: useStore.level,
  findpeople: useStore.username,
  // image: '',
})
// 保存电子围栏的逻辑
onMounted(()=>{
  union()
})
const saveDrawing = () => {
  // 停止绘制
  isDrawingEnabled = false;
  const canvas = myCanvas.value;
  const dataURL = canvas.toDataURL('image/png'); // 生成PNG图像数据URL
  // weilanarr.image = dataURL; // 将图像数据添加到请求的数据对象中
  weilanarr.gridsmall = valueer.value
  // 在这里实现保存逻辑，可以发送 `rects` 到服务器或进行其他处理
  ElMessage({
      message: "发现违规摆摊，请前往问题总览界面解决该问题",
      type: "error",
    });
  console.log(weilanarr)
  Last_GeWang_WeiLan(weilanarr)
  $route.push({
    name: 'gewangproblem'
  })
};

</script>

<style>
.tool {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  margin-left: 20px;
}
</style>
