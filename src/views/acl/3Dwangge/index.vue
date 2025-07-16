<template>
  <div id="cesiumContainer"></div>

  <div class="tool11" style="display: none;">
    <div id="toolbar" class="param-container">
      <el-button @mousedown="e => e.preventDefault()" type="primary" id="chooseView" style=" margin-top: -20px;">绘制可视域</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="warning" id="cancel" style=" margin-top: -20px;">取消</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="danger" id="clear" style=" margin-top: -20px;">清除</el-button>
    </div>
    <div class="search">
      <el-form :model="form" :inline="true" class="el-form">
        <el-input v-model="form.number" placeholder="请输入ID" style="width: 80px; margin-left: 10px; margin-top:10px" />
        <el-button @mousedown="e => e.preventDefault()" type="primary" class="button1" @click="SearchCamera">查询</el-button>
        <el-button @mousedown="e => e.preventDefault()" type="primary" class="button2" @click="addlight">
          灯光模拟
        </el-button>
        <el-button @mousedown="e => e.preventDefault()" :type="cameraButton" class="allCamera" :icon="VideoCamera" circle @click="openCamera" />
      </el-form>
    </div>
  </div>

  <div id="wrapper" style="display: none;" class="wrapper">
    <div id="login" class="animate form" style="width: 100%; height: 100%;">
      <span class="close" aria-hidden="true">×</span>
      <form style="margin-left: 10px">
        <h4>属性编辑</h4>
        <div>
          <label>方向(度)</label>
          <input type="range" id="direction" min="0" max="360" step="1.0" title="方向"
            data-bind="value: direction, valueUpdate: 'input'"  style="width: 216px;"/>
          <input type="text" size="5" data-bind="value: direction" />
        </div>

        <div>
          <label>翻转(度)</label>
          <input type="range" id="pitch" min="-90" max="90" step="1.0" value="1" title="翻转"
            data-bind="value: pitch, valueUpdate: 'input'" style="width: 216px;" />
          <input type="text" size="5" data-bind="value: pitch" />
        </div>

        <div>
          <label>距离(米)</label>
          <input type="range" id="distance" min="1" max="500" step="1.0" value="1" title="距离"
            data-bind="value: distance, valueUpdate: 'input'" style="width: 216px;"/>
          <input type="text" size="5" data-bind="value: distance" />
        </div>

        <div>
          <label>水平视场角(度)</label>
          <input type="range" id="horizonalFov" min="1" max="120" step="1" value="1" title="水平视场角"
            data-bind="value: horizontalFov, valueUpdate: 'input'" style="width: 216px;"/>
          <input type="text" size="5" data-bind="value: horizontalFov" />
        </div>

        <div>
          <label>垂直视场角(度)</label>
          <input type="range" id="verticalFov" min="1" max="90" step="1.0" value="1" title="垂直视场角"
            data-bind="value: verticalFov, valueUpdate: 'input'" style="width: 216px;"/>
          <input type="text" size="5" data-bind="value: verticalFov" />
        </div>
      </form>
    </div>
  </div>

  <div id="video" class="video" style="display: none">
    <div>
      <span> Th </span>
      <span style="color: aliceblue;" @click="closeVideo">X</span>
      <span> This is a long string with lots of spaces 1 1</span>
      <span class="open" style="color: aliceblue;" @click="toggleFullScreen">[ ]</span>
    </div>
    <video id="trailer" class="trailer" muted="" autoplay="" loop="" crossorigin=""
      src="http://192.168.1.246:8080/video/2.mp4">
      Your browser does not support the <code>video</code> element.
    </video>
  </div>

  <div id="camerawrapper" style="display: none" class="wrapper">
    <div id="login" class="animate form" style="width: 100%;">
      <span class="close" aria-hidden="true">×</span>
      <form style="margin-left: 10px">
        <h4>属性编辑</h4>
        <div>
          <label>方向(度)</label>
          <input type="range" id="direction" min="0" max="360" step="1.0" title="方向"
            data-bind="value: direction, valueUpdate: 'input'" style="width: 216px;" />
          <input type="text" size="5" data-bind="value: direction" />
        </div>

        <div>
          <label>翻转(度)</label>
          <input type="range" id="pitch" min="-90" max="90" step="1.0" value="1" title="翻转"
            data-bind="value: pitch, valueUpdate: 'input'" style="width: 216px;" />
          <input type="text" size="5" data-bind="value: pitch" />
        </div>

        <div>
          <label>距离(米)</label>
          <input type="range" id="distance" min="1" max="500" step="1.0" value="1" title="距离"
            data-bind="value: distance, valueUpdate: 'input'" style="width: 216px;" />
          <input type="text" size="5" data-bind="value: distance" />
        </div>

        <div>
          <label>水平视场角(度)</label>
          <input type="range" id="horizonalFov" min="1" max="120" step="1" value="1" title="水平视场角"
            data-bind="value: horizontalFov, valueUpdate: 'input'" style="width: 216px;" />
          <input type="text" size="5" data-bind="value: horizontalFov" />
        </div>

        <div>
          <label>垂直视场角(度)</label>
          <input type="range" id="verticalFov" min="1" max="90" step="1.0" value="1" title="垂直视场角"
            data-bind="value: verticalFov, valueUpdate: 'input'" style="width: 216px;" />
          <input type="text" size="5" data-bind="value: verticalFov" />
        </div>
      </form>
    </div>
  </div>

</template>

<script setup>
import { reactive, ref } from "vue";
import { onMounted } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { OfficeBuilding, VideoCamera } from '@element-plus/icons-vue'
import { useTime } from "@/utils/getTime.js";
const activeNames = ref([]);
const buttonType = ref('info');
const cameraButton = ref('info');
const infoBox = document.createElement("div");
const form = reactive({
  number: "",
  uri: "",
});
const newbar = () => {
  bar = document.getElementById("camerawrapper");
};
let lighter = ref(false)
const addlight = () => {
  lighter.value = true
  console.log(lighter.value)
}
//初始化可视域控件
const creatbar = () => {
  var viewModel = {
    //方向
    direction: 283,
    //翻转度
    pitch: -14,
    //距离
    distance: 29,
    //垂直角
    verticalFov: 41,
    //水平角
    horizontalFov: 82,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };
  newbar();
  Cesium.knockout.applyBindings(viewModel, bar);
};
const buttonText = ref("固定视角");


var longitude = 113.6654;
var latitude = 34.80065288808717;
var viewer;
var grain_model = "http://localhost:8190/iportal/model/meishiyitiaojie.glb";
//var camera = "http://127.0.0.1:8090/newmodel/camera.glb";
var camera = "http://localhost:8190/iportal/model/camera.glb";
var light = "http://localhost:8190/iportal/model/light.glb";
let tableData = [];
var bar;

// var urls = [
//   'http://localhost:8090/video/zao4.mp4',
//   'http://localhost:8090/video/zao3.mp4',
//   'http://localhost:8090/video/zao2.mp4',
//   'http://localhost:8090/video/zao1.mp4',
//   'http://localhost:8090/video/2.mp4',
//   'http://localhost:8090/video/1.mp4',
//   'http://localhost:8090/video/4.mp4',
//   'http://localhost:8090/video/3.mp4',]
var urls = [
  'http://192.168.1.246:8080/video/zao4.mp4',
  'http://192.168.1.246:8080/video/zao3.mp4',
  'http://192.168.1.246:8080/video/zao2.mp4',
  'http://192.168.1.246:8080/video/zao1.mp4',
  'http://192.168.1.246:8080/video/2.mp4',
  'http://192.168.1.246:8080/video/1.mp4',
  'http://192.168.1.246:8080/video/4.mp4',
  'http://192.168.1.246:8080/video/3.mp4',]
//存放可视域的数组
var viewshed3Ds = []
//存放可视体的数组
var viewModels = []
//存放摄像头模型的数组
var models = []
var point = new Cesium.Point3D(1, 1, 1)
var inOrderId = 0
var data = [];
// 起始时间
let start = Cesium.JulianDate.fromDate(new Date());
// 获取当前日期
let now = new Date();

// 创建一个新的 Date 对象，设置时间为今天凌晨1点
let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0);
// 将这个 Date 对象转换为 Cesium.JulianDate 对象
let start1 = Cesium.JulianDate.fromDate(startOfDay);
// 输出 JulianDate 对象以进行验证
// 结束时间
let stop = Cesium.JulianDate.addSeconds(start1, 4, new Cesium.JulianDate());
var list = ref([]);
console.log(point)

//全屏按钮
const toggleFullScreen = () => {
  var video = document.getElementById("trailer");
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
}

const positionProperty = new Cesium.SampledPositionProperty();
for (let i = 0; i < data.length; i++) {
  const time = Cesium.JulianDate.addSeconds(
    start,
    (data[i][2] - data[0][2]) / 1000,
    new Cesium.JulianDate()
  );
  const position = Cesium.Cartesian3.fromDegrees(data[i][1], data[i][0], -1);
  positionProperty.addSample(time, position);
}

let property = new Cesium.SampledPositionProperty();
const velocityVectorProperty = new Cesium.VelocityVectorProperty(property, false);
const velocityVector = new Cesium.Cartesian3();
//自由视角
const freeview = () => {
  viewer.trackedEntity = null;
};

//固定视角
const fixedview = () => {
  viewer.trackedEntity = planeModel;
  planeModel.viewFrom = new Cesium.Cartesian3(10.0, -7.0, 6.0);
};

let planeModel
let cameraView = 1
const openCamera = () => {
  cameraButton.value = cameraButton.value === 'info' ? 'success' : 'info';
  cameraView = !cameraView
  if (cameraView) {
    for (var i = 1; i < 9; i++) {
      models[i].color = Cesium.Color.WHITE;
    }
    delet(viewshed3Ds[1]);
    delet(viewshed3Ds[2]);
    delet(viewshed3Ds[3]);
    delet(viewshed3Ds[4]);
    delet(viewshed3Ds[5]);
    delet(viewshed3Ds[6]);
    delet(viewshed3Ds[7]);
    delet(viewshed3Ds[8]);
    $("#camerawrapper").hide();
    $("#video").hide();
  }
  else {
    for (var i = 1; i < 9; i++) {
      models[i].color = Cesium.Color.RED;
    }
    cameraDomain(viewshed3Ds[1], viewModels[1], 113.66504419396828,34.801325431669675,48.38117915758383);
    cameraDomain(viewshed3Ds[2], viewModels[2], 113.66362967950899,34.80043882483142,17.24388717712603);
    cameraDomain(viewshed3Ds[3], viewModels[3], 113.66365609297256,34.799525939561406,22.907455855885093);
    cameraDomain(viewshed3Ds[4], viewModels[4], 113.66426521462961,34.799448823520365,22.624322142848133);
    cameraDomain(viewshed3Ds[5], viewModels[5], 113.6645667537372,34.79984060418346,23.405634874984116);
    cameraDomain(viewshed3Ds[6], viewModels[6], 113.6640449591202,34.80059013648921,27.84730666031202);
    cameraDomain(viewshed3Ds[7], viewModels[7], 113.66572503260109,34.80028432680672,38.03078632102194);
    cameraDomain(viewshed3Ds[8], viewModels[8], 113.66632756736672,34.80149109390199,32.596274827227724);
    cameraDomain(viewshed3Ds[9], viewModels[9], 113.6666493954362,34.80058095431328,20.012217957511145);
    $("#camerawrapper").hide();
    $("#video").hide();
  }
}

let build = 1
//切换视频地址
const changeVideo = (url) => {
  const videoElement = document.getElementById("trailer");
  videoElement.src = url;
  $("#video").show();
}
//视频与时间轴绑定
const bindvideo = () => {
  const videoElement = document.getElementById("trailer");
  let synchronizer;
  if (Cesium.defined(synchronizer)) {
    synchronizer = synchronizer.destroy();
    videoElement.playbackRate = 1.0;
    return;
  }
  synchronizer = new Cesium.VideoSynchronizer({
    clock: viewer.clock,
    element: videoElement,
  });
}
var pointPosition = Cesium.Cartesian3.fromRadians(113.66348292705672,34.80097883649687,10.13037379177323827);
var pointEntity
var point
var options

const addLightSource=(jing,wei) => {
  // 创建光源 
  var scene = viewer.scene
  var options = {
      color: new Cesium.Color(1, 1, 1, 1),
      decay: 0.001,
      intensity: 5,
      distance: 1100000,
  };
  
  var position = new Cesium.Cartesian3.fromDegrees(jing,wei, 60.23459123076237592);
  var tp = new Cesium.Cartesian3.fromDegrees(jing,wei,0);
  var spotlight = new Cesium.SpotLight(position,tp,options)
  scene.addLightSource(spotlight);
  // scene.addLightSource(directionalLight_h1)
  // 将光源添加到场景中
}
const createlight1 = (url, longitude, latitude, height) => {

var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
  Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
);

var scene = viewer.scene;
var viewshed3D = new Cesium.ViewShed3D(scene);
// 创建模型实例
var model = Cesium.Model.fromGltf({
  id: "light1",
  url: url,
  modelMatrix: modelMatrix,
  scale: 5,
});
// 将模型的方向向量旋转90度
var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(0));
var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
model.modelMatrix = Cesium.Matrix4.multiply(
  model.modelMatrix,
  rotationMatrix,
  model.modelMatrix
);

// 将模型添加到场景中
viewer.scene.primitives.add(model);
};
const createlight2 = (url, longitude, latitude, height) => {

var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
  Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
);

var scene = viewer.scene;
var viewshed3D = new Cesium.ViewShed3D(scene);
// 创建模型实例
var model = Cesium.Model.fromGltf({
  id: "light1",
  url: url,
  modelMatrix: modelMatrix,
  scale: 5,
});
// 将模型的方向向量旋转90度
var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(225));
var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
model.modelMatrix = Cesium.Matrix4.multiply(
  model.modelMatrix,
  rotationMatrix,
  model.modelMatrix
);

// 将模型添加到场景中
viewer.scene.primitives.add(model);
};
const createlight3 = (url, longitude, latitude, height) => {

var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
  Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
);

var scene = viewer.scene;
var viewshed3D = new Cesium.ViewShed3D(scene);
// 创建模型实例
var model = Cesium.Model.fromGltf({
  id: "light1",
  url: url,
  modelMatrix: modelMatrix,
  scale: 5,
});
// 将模型的方向向量旋转90度
var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(225));
var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
model.modelMatrix = Cesium.Matrix4.multiply(
  model.modelMatrix,
  rotationMatrix,
  model.modelMatrix
);

// 将模型添加到场景中
viewer.scene.primitives.add(model);
};
const createlight4 = (url, longitude, latitude, height,jiaodu) => {

var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
  Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
);

var scene = viewer.scene;
var viewshed3D = new Cesium.ViewShed3D(scene);
// 创建模型实例
var model = Cesium.Model.fromGltf({
  id: "light1",
  url: url,
  modelMatrix: modelMatrix,
  scale: 5,
});
// 将模型的方向向量旋转90度
var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(jiaodu));
var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
model.modelMatrix = Cesium.Matrix4.multiply(
  model.modelMatrix,
  rotationMatrix,
  model.modelMatrix
);

// 将模型添加到场景中
viewer.scene.primitives.add(model);
};
//关闭视频框
const closeVideo = () => {
  const videoElement = document.getElementById("trailer");
  videoElement.src = "";
  $("#video").hide();
}
// 初始化地球
const initCesium = () => {
  viewer = new Cesium.Viewer("cesiumContainer", {
    shouldAnimate: false,
    homeButton: false, //是否显示home键
    geocoder: false, //是否显示地名查找控件，如果设置为true，则无法查询
    baseLayerPicker: false, //是否显示图层选择控件
    timeline: true, //是否显示时间线控件
    fullscreenButton: false, //是否全屏显示
    infoBox: false, //是否显示点击要素之后显示的信息
    sceneModePicker: false, //是否显示投影方式控件  三维/二维
    navigationInstructionsInitiallyVisible: false, //导航指令
    navigationHelpButton: false, //是否显示帮助信息控件
    selectionIndicator: false, //是否显示指示器组件
    animation: true, //是否显示动画控件
    navigation: false, // 默认为true，是否显示导航罗盘控件。隐藏可在初始化场景时设置为false
  });
  var scene = viewer.scene
  viewer.animation.viewModel.dateFormatter = DateTimeFormatter;
  viewer.animation.viewModel.timeFormatter = TimeFormatter;
  viewer.timeline.makeLabel = DateTimeFormatter;
  function DateTimeFormatter(datetime, viewModel, ignoredate) {
    var julianDT = new Cesium.JulianDate();
    Cesium.JulianDate.addHours(datetime, 8, julianDT);
    var gregorianDT = Cesium.JulianDate.toGregorianDate(julianDT);
    var objDT;
    if (ignoredate) {
      objDT = "";
    } else {
      objDT = new Date(gregorianDT.year, gregorianDT.month - 1, gregorianDT.day);
      objDT =
        gregorianDT.year +
        "年" +
        objDT.toLocaleString("zh-cn", { month: "short" }) +
        gregorianDT.day +
        "日";
      if (viewModel || gregorianDT.hour + gregorianDT.minute === 0) {
        return objDT;
        objDT += "";
      }
    }
    return (
      objDT +
      Cesium.sprintf(
        "%02d:%02d:%02d",
        gregorianDT.hour,
        gregorianDT.minute,
        gregorianDT.second
      )
    );
  }
  function TimeFormatter(time, viewModel) {
    return DateTimeFormatter(time, viewModel, true);
  }

  viewer.imageryLayers.addImageryProvider(
    new Cesium.BingMapsImageryProvider({
      url: "https://dev.virtualearth.net",
      mapStyle: Cesium.BingMapsStyle.AERIAL,
      key:
        "YuD4vZxF2mehE2Bwiblv~YMcU_CA - Oqyyi3KKGlm9 - A~Aln0H3xK8n2U0yAlok3dWAsvuKTFY_OO8avmzz5N02WoKea01q7WA29W4j6biWZp",
    })
  );

  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );

  viewer.scene.globe.depthTestAgainstTerrain = true; //地形遮挡效果开关，打开后地形会遮挡看不到的区域
  viewer.scene.globe.depthTestAgainstTerrain = false;

  // 实现可视域分析，超图官网的代码，要用到jQuery
  addDomain();
};

//添加可视域
const addDomain = () => {
  $(".close").click(function () {
    $("#wrapper").hide();
  });

  var scene = viewer.scene;
  var ViewPosition = [100, 30, 5];

  // 先将此标记置为true,不激活鼠标移动事件中对可视域分析对象的操作
  scene.viewFlag = false;
  var pointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point);

  var viewshed3DArray = []; // 存储可视域对象的数组



  var viewModel = {
    direction: 1.0,
    pitch: 1.0,
    distance: 1.0,
    verticalFov: 1.0,
    horizontalFov: 1.0,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };

  Cesium.knockout.track(viewModel);

  var toolbar = document.getElementById("wrapper");
  Cesium.knockout.applyBindings(viewModel, toolbar);

  Cesium.knockout.getObservable(viewModel, "direction").subscribe(function (newValue) {
    viewshed3DArray.forEach(function (viewshed3D) {
      viewshed3D.direction = parseFloat(newValue);
    });
  });
  Cesium.knockout.getObservable(viewModel, "pitch").subscribe(function (newValue) {
    viewshed3DArray.forEach(function (viewshed3D) {
      viewshed3D.pitch = parseFloat(newValue);
    });
  });
  Cesium.knockout.getObservable(viewModel, "distance").subscribe(function (newValue) {
    viewshed3DArray.forEach(function (viewshed3D) {
      viewshed3D.distance = parseFloat(newValue);
    });
  });
  Cesium.knockout.getObservable(viewModel, "verticalFov").subscribe(function (newValue) {
    viewshed3DArray.forEach(function (viewshed3D) {
      viewshed3D.verticalFov = parseFloat(newValue);
    });
  });
  Cesium.knockout
    .getObservable(viewModel, "horizontalFov")
    .subscribe(function (newValue) {
      viewshed3DArray.forEach(function (viewshed3D) {
        viewshed3D.horizontalFov = parseFloat(newValue);
      });
    });

  document.getElementById("chooseView").onclick = function () {
    if (viewshed3DArray.length > 0) {
      viewshed3DArray[viewshed3DArray.length - 1].removeAllClipRegion();
      viewshed3DArray.pop();
    }

    // 清除观察点
    pointHandler.clear();
    $("#wrapper").hide();
    scene.viewFlag = true;
    if (pointHandler.active) {
      return;
    }
    //激活绘制点类
    pointHandler.activate();
  };

  pointHandler.drawEvt.addEventListener(function (result) {
    var viewshed3D = new Cesium.ViewShed3D(scene); // 创建新的可视域对象
    viewshed3DArray.push(viewshed3D); // 将可视域对象添加到数组中
    var position = result.object.position;
    ViewPosition = position;

    // 将获取的点的位置转化成经纬度
    var cartographic = Cesium.Cartographic.fromCartesian(position);
    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
    var height = cartographic.height;

    if (scene.viewFlag) {
      // 设置视口位置
      viewshed3D.viewPosition = [longitude, latitude, height];
      viewshed3D.build();
      //viewshed3D.getBarrierPoint(point)
      // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
      scene.viewFlag = false;

      var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
      // 鼠标移动时间回调
      handler.setInputAction(function (e) {
        // 若此标记为false,则激活对可视域分析对象的操作
        if (!scene.viewFlag) {
          //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
          var position = e.endPosition;
          var last = scene.pickPosition(position);

          //计算该点与视口位置点坐标的距离
          var distance = Cesium.Cartesian3.distance(ViewPosition, last);

          if (distance > 0) {
            // 将鼠标当前点坐标转化成经纬度
            var cartographic = Cesium.Cartographic.fromCartesian(last);
            var longitude = Cesium.Math.toDegrees(cartographic.longitude);
            var latitude = Cesium.Math.toDegrees(cartographic.latitude);
            var height = cartographic.height;
            // 通过该点设置可视域分析对象的距离及方向
            viewshed3DArray[viewshed3DArray.length - 1].setDistDirByPoint([
              longitude,
              latitude,
              height,
            ]);
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(function (e) {
        //鼠标右键事件回调,不再执行鼠标移动事件中对可视域的操作
        scene.viewFlag = true;
        $("#wrapper").show();
        viewModel.direction = viewshed3DArray[viewshed3DArray.length - 1].direction;
        viewModel.pitch = viewshed3DArray[viewshed3DArray.length - 1].pitch;
        viewModel.distance = viewshed3DArray[viewshed3DArray.length - 1].distance;
        viewModel.horizontalFov =
          viewshed3DArray[viewshed3DArray.length - 1].horizontalFov;
        viewModel.verticalFov = viewshed3DArray[viewshed3DArray.length - 1].verticalFov;

        // 仅设置最近添加的可视域的参数,不影响任何已有可视域
        viewshed3DArray[viewshed3DArray.length - 1].direction = viewModel.direction;
        viewshed3DArray[viewshed3DArray.length - 1].pitch = viewModel.pitch;
        viewshed3DArray[viewshed3DArray.length - 1].distance = viewModel.distance;
        viewshed3DArray[viewshed3DArray.length - 1].horizontalFov =
          viewModel.horizontalFov;
        viewshed3DArray[viewshed3DArray.length - 1].verticalFov = viewModel.verticalFov;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    }
  });



  $("#cancel").on("click", function () {
    var lastViewshed3D = viewshed3DArray.pop();
    if (lastViewshed3D) {
      lastViewshed3D.destroy();
    }
    // 清除观察点
    pointHandler.clear();
    $("#wrapper").hide();
    scene.viewFlag = true;
  });

  $("#clear").on("click", function () {
    // 清除观察点
    location.reload();
  });
};
//初始化夜市模型
const createModel = (url, longitude, latitude, height) => {
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
  );
  viewer.scene.primitives.add(
    Cesium.Model.fromGltf({
      //Gltf和glb模型都用fromGltf
      url: url,
      modelMatrix: modelMatrix,
      // minimumPixelSize: 512,
      // maximumScale: 200000,
      scale: 1,
    })
  );

  // 创建矩形
  viewer.camera.flyTo({
    duration: 0,
    destination: Cesium.Cartesian3.fromDegrees(longitude - 0.002, latitude, 70),
    orientation: {
      heading: Cesium.Math.toRadians(90),
      pitch: Cesium.Math.toRadians(-20),
      roll: Cesium.Math.toRadians(0),
    }
  });
};
//初始化监控摄像头的可视域
const cameraDomain = (viewshed3D, viewModel, lon, lat, height) => {
  $(".close").click(function () {
    $("#camerawrapper").hide();
  });

  //console.log(viewshed3D)
  viewshed3D.build();
  viewshed3D.viewPosition = [lon, lat, height];
  viewshed3D.direction = viewModel.direction;
  viewshed3D.pitch = viewModel.pitch;
  viewshed3D.distance = viewModel.distance;
  viewshed3D.horizontalFov = viewModel.horizontalFov;
  viewshed3D.verticalFov = viewModel.verticalFov;

  var x = viewshed3D.getViewshedParameter()
  console.log(x)


  Cesium.knockout.track(viewModel);
  Cesium.knockout.getObservable(viewModel, "direction").subscribe(function (newValue) {
    viewshed3D.direction = parseFloat(newValue);
  });
  Cesium.knockout.getObservable(viewModel, "pitch").subscribe(function (newValue) {
    viewshed3D.pitch = parseFloat(newValue);
  });
  Cesium.knockout.getObservable(viewModel, "distance").subscribe(function (newValue) {
    viewshed3D.distance = parseFloat(newValue);
  });
  Cesium.knockout.getObservable(viewModel, "verticalFov").subscribe(function (newValue) {
    viewshed3D.verticalFov = parseFloat(newValue);
  });

  Cesium.knockout
    .getObservable(viewModel, "horizontalFov")
    .subscribe(function (newValue) {
      viewshed3D.horizontalFov = parseFloat(newValue);
    });
  $("#camerawrapper").show();
};
//删除监控摄像头可视域
const delet = (viewshed3D) => {
  $("#camerawrapper").hide();
  viewshed3D.distance = 0.00000000001;
};
//初始化监控1模型
const createCamera1 = (url, longitude, latitude, height) => {

  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
  );

  var scene = viewer.scene;
  var viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3Ds[1] = viewshed3D
  var viewModel = {
    //方向
    direction: 280,
    //翻转度
    pitch: -54,
    //距离
    distance: 58,
    //垂直角
    verticalFov: 79,
    //水平角
    horizontalFov: 69,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };
  viewModels[1] = viewModel
  // 创建模型实例
  var model = Cesium.Model.fromGltf({
    id: "camera1",
    url: url,
    modelMatrix: modelMatrix,
    scale: 15,
  });
  models[1] = model



  // 将模型的方向向量旋转90度
  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(270));
  var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
  model.modelMatrix = Cesium.Matrix4.multiply(
    model.modelMatrix,
    rotationMatrix,
    model.modelMatrix
  );

  // 将模型添加到场景中
  viewer.scene.primitives.add(model);

  //创建一个事件处理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  // 监听鼠标左键点击事件
  handler.setInputAction((event) => {
    // 使用拾取系统获取鼠标点击位置的实体
    const pickedObject = viewer.scene.pick(event.position);
    newbar();
    // 判断是否点击了长方体
    if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
      if (model.color === Cesium.Color.RED) {
        Cesium.knockout.cleanNode(bar);
        model.color = Cesium.Color.WHITE;
        closeVideo();
        delet(viewshed3D);
      } else {
        Cesium.knockout.cleanNode(bar);
        changeVideo(urls[0]);
        model.color = Cesium.Color.RED;
        cameraDomain(
          viewshed3D,
          viewModel,
          113.66504419396828,34.801325431669675,48.38117915758383
        );
        Cesium.knockout.applyBindings(viewModel, bar);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
//初始化监控2模型
const createCamera2 = (url, lon, lat, hei) => {
var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
  Cesium.Cartesian3.fromDegrees(lon, lat, hei)
);

var scene = viewer.scene;
var viewshed3D = new Cesium.ViewShed3D(scene);
viewshed3Ds[2] = viewshed3D;
var viewModel = {
  //方向
  direction: 270, // 初始方向
  pitch: -54,
  distance: 31,
  verticalFov: 76,
  horizontalFov: 47,
  visibleAreaColor: "#ffffffff",
  invisibleAreaColor: "#ffffffff",
};
viewModels[2] = viewModel;

// 创建模型实例
var model = Cesium.Model.fromGltf({
  id: "camera2",
  url: url,
  modelMatrix: modelMatrix,
  scale: 15,
});
models[2] = model;

// 将模型的方向向量旋转90度
var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(270));
var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
model.modelMatrix = Cesium.Matrix4.multiply(
  model.modelMatrix,
  rotationMatrix,
  model.modelMatrix
);

// 将模型添加到场景中
viewer.scene.primitives.add(model);

// 创建一个事件处理器
const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
// 监听鼠标左键点击事件
handler.setInputAction((event) => {
  // 使用拾取系统获取鼠标点击位置的实体
  const pickedObject = viewer.scene.pick(event.position);
  newbar();
  // 判断是否点击了长方体
  if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
    if (model.color === Cesium.Color.RED) {
      Cesium.knockout.cleanNode(bar);
      model.color = Cesium.Color.WHITE;
      closeVideo();
      delet(viewshed3D);
    } else {
      Cesium.knockout.cleanNode(bar);
      changeVideo(urls[1]);
      model.color = Cesium.Color.RED;
      cameraDomain(viewshed3D, viewModel, 113.66362967950899,34.80043882483142,17.24388717712603); // 确保直接使用给定的经纬度和高度
      Cesium.knockout.applyBindings(viewModel, bar);
    }
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

const createCamera3 = (url, lon, lat, hei) => {
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(lon, lat, hei)
  );

  var scene = viewer.scene;
  var viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3Ds[3] = viewshed3D
  var viewModel = {
    //方向
    direction: 258,
    //翻转度
    pitch: -64,
    //距离
    distance: 37,
    //垂直角
    verticalFov: 81,
    //水平角
    horizontalFov: 52,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };
  viewModels[3] = viewModel
  // 创建模型实例
  var model = Cesium.Model.fromGltf({
    id: "camera3",
    url: url,
    modelMatrix: modelMatrix,
    scale: 15,
  });
  models[3] = model
  // 将模型的方向向量旋转90度
  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(270));
  var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
  model.modelMatrix = Cesium.Matrix4.multiply(
    model.modelMatrix,
    rotationMatrix,
    model.modelMatrix
  );

  // 将模型添加到场景中
  viewer.scene.primitives.add(model);

  //创建一个事件处理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 监听鼠标左键点击事件
  handler.setInputAction((event) => {
    // 使用拾取系统获取鼠标点击位置的实体
    const pickedObject = viewer.scene.pick(event.position);
    newbar();
    // 判断是否点击了长方体
    if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
      if (model.color === Cesium.Color.RED) {
        Cesium.knockout.cleanNode(bar);
        model.color = Cesium.Color.WHITE;
        closeVideo();
        delet(viewshed3D);
      } else {
        Cesium.knockout.cleanNode(bar);
        changeVideo(urls[2]);
        model.color = Cesium.Color.RED;
        cameraDomain(
          viewshed3D,
          viewModel,
          113.66365609297256,34.799525939561406,22.907455855885093
        );
        Cesium.knockout.applyBindings(viewModel, bar);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const createCamera4 = (url, lon, lat, hei) => {
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(lon, lat, hei)
  );

  var scene = viewer.scene;
  var viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3Ds[4] = viewshed3D
  var viewModel = {
    //方向
    direction: 182,
    //翻转度
    pitch: -60,
    //距离
    distance: 32,
    //垂直角
    verticalFov: 50,
    //水平角
    horizontalFov: 107,
    visibleAreaColor: "green",
    invisibleAreaColor: "red",
  };
  viewModels[4] = viewModel
  // 创建模型实例
  var model = Cesium.Model.fromGltf({
    id: "camera4",
    url: url,
    modelMatrix: modelMatrix,
    scale: 15,
  });
  models[4] = model
  // 将模型的方向向量旋转90度
  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(360));
  var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
  model.modelMatrix = Cesium.Matrix4.multiply(
    model.modelMatrix,
    rotationMatrix,
    model.modelMatrix
  );

  // 将模型添加到场景中
  viewer.scene.primitives.add(model);

  //创建一个事件处理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 监听鼠标左键点击事件
  handler.setInputAction((event) => {
    // 使用拾取系统获取鼠标点击位置的实体
    const pickedObject = viewer.scene.pick(event.position);
    newbar();
    // 判断是否点击了长方体
    if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
      if (model.color === Cesium.Color.RED) {
        Cesium.knockout.cleanNode(bar);
        model.color = Cesium.Color.WHITE;
        closeVideo();
        delet(viewshed3D);
      } else {
        Cesium.knockout.cleanNode(bar);
        changeVideo(urls[3]);
        model.color = Cesium.Color.RED;
        cameraDomain(
          viewshed3D,
          viewModel,
          113.66426521462961,34.799448823520365,22.624322142848133
        );
        Cesium.knockout.applyBindings(viewModel, bar);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const createCamera5 = (url, lon, lat, hei) => {
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(lon, lat, hei)
  );

  var scene = viewer.scene;
  var viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3Ds[5] = viewshed3D
  var viewModel = {
    //方向
    direction: 102,
    //翻转度
    pitch: -61,
    //距离
    distance: 38,
    //垂直角
    verticalFov: 41,
    //水平角
    horizontalFov: 82,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };
  viewModels[5] = viewModel
  // 创建模型实例
  var model = Cesium.Model.fromGltf({
    id: "camera5",
    url: url,
    modelMatrix: modelMatrix,
    scale: 15,
  });
  models[5] = model
  // 将模型的方向向量旋转90度
  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(90));
  var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
  model.modelMatrix = Cesium.Matrix4.multiply(
    model.modelMatrix,
    rotationMatrix,
    model.modelMatrix
  );

  // 将模型添加到场景中
  viewer.scene.primitives.add(model);

  //创建一个事件处理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 监听鼠标左键点击事件
  handler.setInputAction((event) => {
    // 使用拾取系统获取鼠标点击位置的实体
    const pickedObject = viewer.scene.pick(event.position);
    newbar();
    // 判断是否点击了长方体
    if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
      if (model.color === Cesium.Color.RED) {
        Cesium.knockout.cleanNode(bar);
        model.color = Cesium.Color.WHITE;
        closeVideo();
        delet(viewshed3D);
      } else {
        Cesium.knockout.cleanNode(bar);
        changeVideo(urls[4]);
        model.color = Cesium.Color.RED;
        cameraDomain(
          viewshed3D,
          viewModel,
          113.6645667537372,34.79984060418346,23.405634874984116
        );
        Cesium.knockout.applyBindings(viewModel, bar);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const createCamera6 = (url, lon, lat, hei) => {
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(lon, lat, hei)
  );

  var scene = viewer.scene;
  var viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3Ds[6] = viewshed3D
  var viewModel = {
    //方向
    direction: 42,
    //翻转度
    pitch: -35,
    //距离
    distance: 76,
    //垂直角
    verticalFov: 45,
    //水平角
    horizontalFov: 95,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };
  viewModels[6] = viewModel
  // 创建模型实例
  var model = Cesium.Model.fromGltf({
    id: "camera6",
    url: url,
    modelMatrix: modelMatrix,
    scale: 15,
  });
  models[6] = model
  // 将模型的方向向量旋转90度
  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(180));
  var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
  model.modelMatrix = Cesium.Matrix4.multiply(
    model.modelMatrix,
    rotationMatrix,
    model.modelMatrix
  );

  // 将模型添加到场景中
  viewer.scene.primitives.add(model);

  //创建一个事件处理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 监听鼠标左键点击事件
  handler.setInputAction((event) => {
    // 使用拾取系统获取鼠标点击位置的实体
    const pickedObject = viewer.scene.pick(event.position);
    newbar();
    // 判断是否点击了长方体
    if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
      if (model.color === Cesium.Color.RED) {
        Cesium.knockout.cleanNode(bar);
        model.color = Cesium.Color.WHITE;
        closeVideo();
        delet(viewshed3D);
      } else {
        Cesium.knockout.cleanNode(bar);
        changeVideo(urls[5]);
        model.color = Cesium.Color.RED;
        cameraDomain(
          viewshed3D,
          viewModel,
          113.6640449591202,34.80059013648921,27.84730666031202
        );
        Cesium.knockout.applyBindings(viewModel, bar);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const createCamera7 = (url, lon, lat, hei) => {
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(lon, lat, hei)
  );

  var scene = viewer.scene;
  var viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3Ds[7] = viewshed3D
  var viewModel = {
    //方向
    direction: 360,
    //翻转度
    pitch: -53,
    //距离
    distance: 82,
    //垂直角
    verticalFov: 53,
    //水平角
    horizontalFov: 68,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };
  viewModels[7] = viewModel
  // 创建模型实例
  var model = Cesium.Model.fromGltf({
    id: "camera7",
    url: url,
    modelMatrix: modelMatrix,
    scale: 15,
  });
  models[7] = model
  // 将模型的方向向量旋转90度
  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(180));
  var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
  model.modelMatrix = Cesium.Matrix4.multiply(
    model.modelMatrix,
    rotationMatrix,
    model.modelMatrix
  );

  // 将模型添加到场景中
  viewer.scene.primitives.add(model);

  //创建一个事件处理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 监听鼠标左键点击事件
  handler.setInputAction((event) => {
    // 使用拾取系统获取鼠标点击位置的实体
    const pickedObject = viewer.scene.pick(event.position);
    newbar();
    // 判断是否点击了长方体
    if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
      if (model.color === Cesium.Color.RED) {
        Cesium.knockout.cleanNode(bar);
        model.color = Cesium.Color.WHITE;
        closeVideo();
        delet(viewshed3D);
      } else {
        Cesium.knockout.cleanNode(bar);
        changeVideo(urls[6]);
        model.color = Cesium.Color.RED;
        cameraDomain(
          viewshed3D,
          viewModel,
          113.66572503260109,34.80028432680672,38.03078632102194
        );
        Cesium.knockout.applyBindings(viewModel, bar);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const createCamera8 = (url, lon, lat, hei) => {
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(lon, lat, hei)
  );

  var scene = viewer.scene;
  var viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3Ds[8] = viewshed3D
  var viewModel = {
    //方向
    direction: 314,
    //翻转度
    pitch: -62,
    //距离
    distance: 61,
    //垂直角
    verticalFov: 41,
    //水平角
    horizontalFov: 82,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };
  viewModels[8] = viewModel
  // 创建模型实例
  var model = Cesium.Model.fromGltf({
    id: "camera8",
    url: url,
    modelMatrix: modelMatrix,
    scale: 15,
  });
  models[8] = model
  // 将模型的方向向量旋转90度
  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(225));
  var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
  model.modelMatrix = Cesium.Matrix4.multiply(
    model.modelMatrix,
    rotationMatrix,
    model.modelMatrix
  );

  // 将模型添加到场景中
  viewer.scene.primitives.add(model);

  //创建一个事件处理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 监听鼠标左键点击事件
  handler.setInputAction((event) => {
    // 使用拾取系统获取鼠标点击位置的实体
    const pickedObject = viewer.scene.pick(event.position);
    newbar();
    // 判断是否点击了长方体
    if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
      if (model.color === Cesium.Color.RED) {
        Cesium.knockout.cleanNode(bar);
        model.color = Cesium.Color.WHITE;
        closeVideo();
        delet(viewshed3D);
      } else {
        Cesium.knockout.cleanNode(bar);
        changeVideo(urls[7]);
        model.color = Cesium.Color.RED;
        cameraDomain(
          viewshed3D,
          viewModel,
          113.66632756736672,34.80149109390199,32.596274827227724
        );
        Cesium.knockout.applyBindings(viewModel, bar);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const createCamera9 = (url, lon, lat, hei) => {
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(lon, lat, hei)
  );

  var scene = viewer.scene;
  var viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3Ds[8] = viewshed3D
  var viewModel = {
    //方向
    direction: 350,
    //翻转度
    pitch: -56,
    //距离
    distance: 35,
    //垂直角
    verticalFov: 114,
    //水平角
    horizontalFov: 78,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };
  viewModels[8] = viewModel
  // 创建模型实例
  var model = Cesium.Model.fromGltf({
    id: "camera8",
    url: url,
    modelMatrix: modelMatrix,
    scale: 15,
  });
  models[8] = model
  // 将模型的方向向量旋转90度
  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(180));
  var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
  model.modelMatrix = Cesium.Matrix4.multiply(
    model.modelMatrix,
    rotationMatrix,
    model.modelMatrix
  );

  // 将模型添加到场景中
  viewer.scene.primitives.add(model);

  //创建一个事件处理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 监听鼠标左键点击事件
  handler.setInputAction((event) => {
    // 使用拾取系统获取鼠标点击位置的实体
    const pickedObject = viewer.scene.pick(event.position);
    newbar();
    // 判断是否点击了长方体
    if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
      if (model.color === Cesium.Color.RED) {
        Cesium.knockout.cleanNode(bar);
        model.color = Cesium.Color.WHITE;
        closeVideo();
        delet(viewshed3D);
      } else {
        Cesium.knockout.cleanNode(bar);
        changeVideo(urls[7]);
        model.color = Cesium.Color.RED;
        cameraDomain(
          viewshed3D,
          viewModel,
          113.6666493954362,34.80058095431328,20.012217957511145
        );
        Cesium.knockout.applyBindings(viewModel, bar);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
const createCamera10 = (url, lon, lat, hei) => {
  var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(lon, lat, hei)
  );

  var scene = viewer.scene;
  var viewshed3D = new Cesium.ViewShed3D(scene);
  viewshed3Ds[8] = viewshed3D
  var viewModel = {
    //方向
    direction: 360,
    //翻转度
    pitch: -56,
    //距离
    distance: 40,
    //垂直角
    verticalFov: 114,
    //水平角
    horizontalFov: 78,
    visibleAreaColor: "#ffffffff",
    invisibleAreaColor: "#ffffffff",
  };
  viewModels[8] = viewModel
  // 创建模型实例
  var model = Cesium.Model.fromGltf({
    id: "camera8",
    url: url,
    modelMatrix: modelMatrix,
    scale: 15,
  });
  models[8] = model
  // 将模型的方向向量旋转90度
  var rotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(180));
  var rotationMatrix = Cesium.Matrix4.fromRotationTranslation(rotation);
  model.modelMatrix = Cesium.Matrix4.multiply(
    model.modelMatrix,
    rotationMatrix,
    model.modelMatrix
  );

  // 将模型添加到场景中
  viewer.scene.primitives.add(model);

  //创建一个事件处理器
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 监听鼠标左键点击事件
  handler.setInputAction((event) => {
    // 使用拾取系统获取鼠标点击位置的实体
    const pickedObject = viewer.scene.pick(event.position);
    newbar();
    // 判断是否点击了长方体
    if (Cesium.defined(pickedObject) && pickedObject.id === model.id) {
      if (model.color === Cesium.Color.RED) {
        Cesium.knockout.cleanNode(bar);
        model.color = Cesium.Color.WHITE;
        closeVideo();
        delet(viewshed3D);
      } else {
        Cesium.knockout.cleanNode(bar);
        changeVideo(urls[7]);
        model.color = Cesium.Color.RED;
        cameraDomain(
          viewshed3D,
          viewModel,
          113.66586558019094,34.80161917992056,26.94357342295838
        );
        Cesium.knockout.applyBindings(viewModel, bar);
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
//获取鼠标点击位置的坐标
const getlat = () => {
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); //此方法获取鼠标点击位置经纬度
  handler.setInputAction(function (e) {
    var position = viewer.scene.pickPosition(e.position);
    //将笛卡尔坐标转化为经纬度坐标
    var cartographic = Cesium.Cartographic.fromCartesian(position);
    var lon = Cesium.Math.toDegrees(cartographic.longitude);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var height = cartographic.height;
    console.log(lon, lat, height);    
    if(lighter.value === true){
      console.log(lighter.value)
      console.log(lon)
      console.log(lat)
      addLightSource(lon,lat)
      createlight4(light,
      lon,lat,0.14584059810533204,45)
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};
//搜索监控摄像头
const SearchCamera = () => {
  SearchCameraApi({
    id: Number(form.number)
  }).then((result) => {
    tableData = result.data;
    //console.log(tableData)
    activeNames.value = ["1"];
  });
};
//定位监控摄像头
const fly = (lon, lat, height) => {
  viewer.camera.flyTo({
    duration: 0,
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
    orientation: {
      heading: Cesium.Math.toRadians(-90),
      pitch: Cesium.Math.toRadians(-20),
      roll: Cesium.Math.toRadians(0),
    },
    complete: function callback() { },
  });
};
const collapseClickOutside = () => {
  activeNames.value = []; // 设置activeNames的值为空数组，即收起el-collapse
};
onMounted(() => {
  $("#camerawrapper").hide();
  $("#wrapper").hide();
  //加载地球
  initCesium();
  creatbar();
  //加载夜市模型
  // createModel(model, 113.666272, 34.797151, 0)
  createModel(grain_model, 113.6654, 34.80065288808717, 0);
  //加载摄像头
  createCamera1(camera, 113.66504419396828,34.801325431669675,48.38117915758383);
  createCamera2(camera, 113.66362967950899,34.80043882483142,17.24388717712603);
  createCamera3(
    camera,
    113.66365609297256,34.799525939561406,22.907455855885093
  );
  createCamera4(
    camera,
    113.66426521462961,34.799448823520365,22.624322142848133
  );
  createCamera5(
    camera,
    113.6645667537372,34.79984060418346,23.405634874984116
  );
  createCamera6(
    camera,
    113.6640449591202,34.80059013648921,27.84730666031202
  );
  createCamera7(
    camera,
    113.66572503260109,34.80028432680672,38.03078632102194
  );
  //113.66633423183066 34.80149120795655
  createCamera9(
    camera,
    113.6666493954362,34.80058095431328,20.012217957511145
  );
  createCamera8(
    camera,
    113.66632756736672,34.80149109390199,32.596274827227724
  );
  getlat();
  addLightSource(113.66328369575724,34.80110184245961);
  createlight1(light,
  113.66328369575724,34.80110184245961,0.14584059810533204)
  addLightSource(113.66333596588025,34.80192926036498)
  createlight2(light,
  113.66333596588025,34.80192926036498,0.14584059810533204)
  addLightSource(113.66466289816763,34.80202392270104)
  createlight3(light,
  113.66466289816763,34.80202392270104,0.14584059810533204)
  addLightSource(113.66608045376015,34.802054675417494)
  createlight4(light,
  113.66608045376015,34.802054675417494,0.14584059810533204,270)
  addLightSource(113.66739090155689,34.80198690117313)
  createlight4(light,
  113.66739090155689,34.80198690117313,0.14584059810533204,225)
  createlight4(light,
  113.66744524895546,34.799303999455894,0.14584059810533204,135)
  addLightSource(113.66618958819248,34.7992369212618)
  createlight4(light,
  113.66618958819248,34.7992369212618,0.14584059810533204,90)
  addLightSource(113.66438863688579,34.799244646104505)
  createlight4(light,
  113.66438863688579,34.799244646104505,0.14584059810533204,90)
  addLightSource(113.66337145003726,34.799335039570856)
  createlight4(light,
  113.66337145003726,34.799335039570856,0.14584059810533204,45)
  addLightSource(113.66330493646855,34.80024955876548)
  createlight4(light,
  113.66330493646855,34.80024955876548,0.14584059810533204,0)
  addLightSource(113.66456709100912,34.80078828551754)
  addLightSource(113.66742848563264,34.79932701751037)
  createlight4(light,
  113.66456709100912,34.80078828551754,0.14584059810533204,315)
  createlight4(light,
  113.66751006515288,34.80071686365746,0.20177831904680885,180)
  addLightSource(113.66751006515288,34.80071686365746)
  createlight4(light,
  113.66616318013382,34.800559881055044,0.06380418668193891,90)
  addLightSource(113.66616318013382,34.800559881055044)
  
});


</script>

<style scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.tool11 {
  position: absolute;
  top: 30px;
  left: 40px;
  z-index: 10;
  background: rgba(255,255,255,0.95);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.12);
  padding: 24px 28px 18px 28px;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border: 1px solid #f0f0f0;
}

.param-container {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.el-button {
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
}

.el-button[type="primary"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.el-button[type="warning"] {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  color: #fff;
}

.el-button[type="danger"] {
  background: linear-gradient(135deg, #ff5858 0%, #f09819 100%);
  border: none;
  color: #fff;
}

.search {
  margin-top: 10px;
  background: rgba(245, 247, 250, 0.95);
  border-radius: 14px;
  padding: 12px 18px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.06);
}

.el-form {
  display: flex;
  align-items: center;
  gap: 12px;
}

.el-input {
  border-radius: 10px;
  background: #f7faff;
  border: 1px solid #e0e7ef;
  transition: box-shadow 0.2s;
}

.el-input:focus-within {
  box-shadow: 0 0 0 2px #667eea33;
}

.button1, .button2, .allCamera {
  margin-left: 8px;
}

#wrapper, #camerawrapper {
  z-index: 1001;
}

.animate.form {
  background: rgba(255,255,255,0.98);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.12);
  padding: 30px 30px 20px 30px;
  min-width: 320px;
  max-width: 400px;
  margin: 0 auto;
}

.animate.form h4 {
  color: #667eea;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 18px;
}

.animate.form label {
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
}

.animate.form input[type="range"] {
  width: 180px;
  margin: 0 8px 0 0;
}

.animate.form input[type="text"] {
  width: 50px;
  border-radius: 6px;
  border: 1px solid #e0e7ef;
  padding: 2px 6px;
  margin-left: 6px;
}

.close {
  position: absolute;
  top: 18px;
  right: 24px;
  font-size: 22px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.close:hover {
  color: #f5576c;
}

.video {
  position: absolute;
  top: 80px;
  right: 40px;
  z-index: 1002;
  background: rgba(0,0,0,0.85);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.18);
  padding: 18px 18px 12px 18px;
  min-width: 320px;
}

.video span {
  color: #fff;
  font-size: 15px;
  margin-right: 10px;
}

.trailer {
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
}

@media (max-width: 900px) {
  .tool11 {
    left: 10px;
    top: 10px;
    min-width: 220px;
    padding: 12px 10px 10px 10px;
  }
  .video {
    right: 10px;
    top: 60px;
    min-width: 180px;
    padding: 10px 8px 8px 8px;
  }
  .animate.form {
    min-width: 180px;
    max-width: 98vw;
    padding: 16px 8px 10px 8px;
  }
}
</style>
