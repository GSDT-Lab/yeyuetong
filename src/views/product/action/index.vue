<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌内容按钮 -->
    <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" icon="plus" @click="ADD">添加活动</el-button>
    <!-- 表格组件用于展示已有的品牌数据 -->
    <!-- table
    ---- border:可以设置表格纵向是否有边框
      -- label 设置每列标题
      -- align
   -->
    <el-table style="margin: 10px 0px" :border="true" :data="actionArr">
      <el-table-column label= "序号" width= "80px" align= "center" type="index"></el-table-column>
      <!-- table-column默认展示数据用div -->
      <el-table-column align= "center"  label="活动名称">
        <template # = "{ row, $index }">
          <h5>{{ row.name }}</h5>
        </template>
      </el-table-column>
      <el-table-column align= "center"  label="活动图片">
        <template #="{ row, $index }">
          <img :src="row.image" alt="图片暂未加载" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label= "参加活动夜市网格" width= "180px" align= "center" prop="suoshuid"></el-table-column>
      <el-table-column label= "活动时间" width= "138px" align= "center" prop="time"></el-table-column>
      <el-table-column label= "活动状态" width= "100px" align= "center" prop="state"></el-table-column>
      <el-table-column align= "center"  label="操作">
        <template #="{ row, $index }">
          <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="List" @click="$event => details(row)"></el-button>
          <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Edit" @click="$event =>List(row)"></el-button>
          <!-- <el-popconfirm :title="`确认删除${row.name}吗？`" width="250px" icon="delete" @confirm="remove(row.id)">
            <template #reference>
            <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Delete" ></el-button>
            </template>
          </el-popconfirm> -->
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 对话框组件 添加修改-->
  <!-- V-MODEL控制对话框显示隐藏 
        TITLE设置左上方标题-->
  <el-dialog v-model="dialogFormVisible" title="添加活动">
    <el-form style="width: 80%;" :model = 'trademarkParams1' ref="formRef">
      <el-form-item label="活动名称" label-width="100px" prop="name">
        <el-input placeholder="请输入活动名称" v-model="trademarkParams1.name"></el-input>
      </el-form-item>      
      <el-form-item label="活动类型" label-width="100px" prop="name">
        <el-select
      v-model="selectvalue"
      placeholder="Select"
      size="large"
      style="width: 240px"
    >
      <el-option
        v-for="item in selectoptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
      </el-form-item>
      <el-form-item label="活动描述" label-width="100px" prop="name">
        <el-input placeholder="请输入活动描述" v-model="trademarkParams1.describle" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="活动内容" label-width="100px" prop="name">
        <el-input placeholder="请输入活动内容" v-model="trademarkParams1.content" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="活动预计人数" label-width="100px" prop="name">
        <el-input placeholder="请输入活动预计人数" v-model="trademarkParams1.renshu" type="text"></el-input>
      </el-form-item>
      <el-form-item label="活动图片" label-width="100px" prop="logoUrl">
        <!-- action是请求链接,要带api -->
        <el-upload
  class="avatar-uploader"
  action="/api/planning/action/image"
  :show-file-list="true"
  :on-success="handleAvatarSuccess"
  :before-upload = "beforeAvatarUpload"
  :headers="uploadHeaders">
  <!-- 图片区 -->
  <img
    v-if="trademarkParams1.image"
    :src="trademarkParams1.image"
    class="avatar"
  />
  <el-icon v-else class="avatar-uploader-icon">
  <Plus />
  </el-icon>
     </el-upload>
      </el-form-item>
      <el-form-item label="活动时间" label-width="100px" prop="tmName">
        <el-date-picker
        v-model="trademarkParams1.time"
        type="daterange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        :size="size"
      />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="cancel">取消</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="nextpager">下一页</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogFormVisible1" title="查看活动详情">
    <el-form>
      <el-form-item label="活动详情">
        <div>{{ content }}</div>
      </el-form-item>
      <el-form-item label="活动描述">
        <div>{{ describle }}</div>
      </el-form-item>
    </el-form>
    <el-form-item label="活动图片">
        <img :src=img alt="" style="width: 100px; height: 100px;">
      </el-form-item>
  </el-dialog>
  <el-dialog v-model="nextpage" title="添加活动">
    <el-form-item label="推荐参与活动网格" label-width="140px" prop="name">
        <el-checkbox v-model="checked1" :label=ae[0] size="large" :style="{color: col[0]}"/>
        <el-checkbox v-model="checked2" :label=ae[1] size="large" :style="{color: col[1]}"/>
        <el-checkbox v-model="checked3" :label=ae[2] size="large" :style="{color: col[2]}"/>
        <el-checkbox v-model="checked4" :label=ae[3] size="large" :style="{color: col[3]}"/>
        <el-checkbox v-model="checked5" :label=ae[4] size="large" :style="{color: col[4]}"/>
        <el-checkbox v-model="checked6" :label=ae[5] size="large" :style="{color: col[5]}"/>
        <el-checkbox v-model="checked7" :label=ae[6] size="large" :style="{color: col[6]}"/>
        <el-checkbox v-model="checked8" :label=ae[7] size="large" :style="{color: col[7]}"/>
        <el-checkbox v-model="checked9" :label=ae[8] size="large" :style="{color: col[8]}"/>
        <el-checkbox v-model="checked10" :label=ae[9] size="large" :style="{color: col[9]}"/>
        <el-checkbox v-model="checked11" :label=ae[10] size="large" :style="{color: col[10]}"/>
        <el-checkbox v-model="checked12" :label=ae[11] size="large" :style="{color: col[11]}"/>
        <el-checkbox v-model="checked13" :label=ae[12] size="large" :style="{color: col[12]}"/>
        <el-checkbox v-model="checked14" :label=ae[13] size="large" :style="{color: col[13]}"/>
      </el-form-item>
      <template #footer>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="lastpager">上一页</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="right">确定</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogpot" title="分配任务">
    <el-form>
      <el-form-item label="参与网格">
        {{ addressesvalue[page] }}
      </el-form-item>
      <el-form-item label="具体任务">
        <el-input type="text" v-model="value2"></el-input>
      </el-form-item>
      <el-form-item label="详细描述">
        <el-input type="textarea" v-model="value1"></el-input>
      </el-form-item>
      <el-form-item>        
        <el-button @mousedown="e => e.preventDefault()" type="primary" @click="last" :disabled="page<=0" style="margin-left: 550px">
          上一个
        </el-button>
        <el-button @mousedown="e => e.preventDefault()" type="primary" @click="next" :disabled="page>=length-1" v-if="page!=length-1">
          下一个
        </el-button>
        <el-button @mousedown="e => e.preventDefault()" type="primary" @click="post"  v-if="page==length-1">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, UploadProps } from 'element-plus'
import useUserStore from '@/store/modules/users'
import { Planning_action, Planning_action_fenpei, Planning_ADD_action } from '@/api/planning/index'
import useLayOutSettingStore from '@/store/modules/setting'
import { log } from 'console'
let LayOutSettingStore = useLayOutSettingStore()
let usestore = useUserStore()
let pageNo = ref<number>(1)
let nextpage = ref(false)
let limit = ref<number>(3)
let total = ref<number>(0)
let value1 =ref('')
let value2 = ref('')
let selectvalue = ref('')
//存储已有品牌数据
//控制对话框显示影藏
let dialogFormVisible = ref<boolean>(false)
  let dialogFormVisible1 = ref<boolean>(false)
    let dialogpot = ref<boolean>(false)
let headtitle = ref<string>('')
  let trademarkParams1 = reactive({
  name: '',
  image: '',
  time: '',
  suoshuid: '',
  content: '',
  renshu: '',
  describle: '', // 确保这里是一个数组
  state: ''
});

let be = reactive ([" (合适)"," (较为合适)"])
let ae=reactive(["公园茂","正弘汇","欣悦荟","德化","油化厂","农科路","星河里","银基广场","晶悦城","瑞光","艺茂仓","海汇港","磨街文创","龙湖里"])
let col = reactive(['black','black','black','black','black','black','black','black','black','black','black','black','black'])
let col1 = reactive(['black','black','black','black','black','black','black','black','black','black','black','black','black'])
let ce = reactive(["公园茂","正弘汇","欣悦荟","德化","油化厂","农科路","星河里","银基广场","晶悦城","瑞光","艺茂仓","海汇港","磨街文创","龙湖里"])
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const heshi = () => {
  for(let o = 0; o<=ce.length;o++){
    ae[o] = ce[o]
    col[o] = col1[o]
  }
  const i = getRandomInt(4, 7);
console.log(i)
let usedIndices = new Set(); // 使用Set来存储已经使用的索引

for (let j = 1; j <= i; j++) {
  let a;
  do {
    a = getRandomInt(0, 13);
  } while (usedIndices.has(a)); // 检查是否已经存在
  usedIndices.add(a); // 将新生成的随机数添加到已用集合
  console.log(a);
  const b = getRandomInt(0, 1);
  ae[a] += be[b]; // 直接拼接字符串
  col[a] = 'green'
}
console.log(ae)
console.log(ce)
}
const selectoptions = [
  {
    value: '文化活动',
    label: '文化活动',
  },
  {
    value: '购物活动',
    label: '购物活动',
  },
  {
    value: '旅游活动',
    label: '旅游活动',
  },
  {
    value: '美食活动',
    label: '美食活动',
  },
  {
    value: '狂欢活动',
    label: '狂欢活动',
  },
]
let test1 = reactive({
  name: '',
  suoshuid: '',
  details: '',
  maindescrible: '',
})
const lastpager =()=>{
  dialogFormVisible.value = true
  nextpage.value = false
}
const nextpager =()=>{
  console.log(1)
heshi()
console.log(1)
  dialogFormVisible.value = false
  nextpage.value = true
}
let trademarkParams = reactive({
  name: '',
  image: '',
  time: '',
  content: '',
  describle: '', // 确保这里是一个数组
  state: '',
  gridm: [], // 确保这里是一个数组
});
const timevalue = ref('')
const last =() =>{
  page.value--
}
const next =()=>{

test1.name = action.value
test1.suoshuid = addressesvalue.value[page.value]
test1.details = value2.value
test1.maindescrible = value1.value
console.log(test1)
Planning_action_fenpei(test1)
page.value++
value1.value = ''
value2.value = ''
}
const post = () => {
  test1.name = action.value
test1.suoshuid = addressesvalue.value[page.value]
test1.details = value2.value
test1.maindescrible = value1.value
console.log(test1)
Planning_action_fenpei(test1)
dialogpot.value = false
page.value++
value1.value = ''
value2.value = ''
}

//获取el-form组件实例
let formRef = ref()
const size = ref<'default' | 'large' | 'small'>('default')
//获取已有品牌封装为一个函数，在任何情况下获取数据，调用次函数即可
//网格选择
const checked1 = ref(false)
const checked2 = ref(false)
const checked3 = ref(false)
const checked4 = ref(false)
const checked5 = ref(false)
const checked6 = ref(false)
const checked7 = ref(false)
const checked8 = ref(false)
const checked9 = ref(false)
const checked10 = ref(false)
const checked11= ref(false)
const checked12 = ref(false)
const checked13 = ref(false)
const checked14 = ref(false)
const uploadHeaders = { Token: usestore.token }
//添加
const ADD = () => {
  headtitle.value = '添加活动'
  dialogFormVisible.value = true
  trademarkParams1.name = ''
  trademarkParams1.image = ''
  trademarkParams1.content = ''
  trademarkParams1.describle=''
  trademarkParams1.suoshuid=''
  trademarkParams.id = undefined
  console.log(uploadHeaders)
}
//详情
let content = ref('')
let describle = ref('')
let img = ref('')
let page = ref(0)
const details = (row) => {
  console.log(row)
  dialogFormVisible1.value = true
  content = row.content
  describle = row.describle
  img = row.image
}
let actionArr = ref('')
const cancel = () => {
  dialogFormVisible.value = false
}
let pagesize = ref<number>(10)
const getHasAction = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager
  let result = await Planning_action(pageNo.value,pagesize.value)
    total.value = result.data.total
    actionArr.value = result.data.rows
    console.log(result)
}

//添加修改已有品牌
const right = async() => {
console.log(timevalue.value)
if (checked1.value) trademarkParams.gridm.push('公园茂');
  if (checked2.value) trademarkParams.gridm.push('正弘汇');
  if (checked3.value) trademarkParams.gridm.push('欣悦荟');  
  if (checked4.value) trademarkParams.gridm.push('德化');
  if (checked5.value) trademarkParams.gridm.push('油化厂');
  if (checked6.value) trademarkParams.gridm.push('农科路');
  if (checked7.value) trademarkParams.gridm.push('星河里');
  if (checked8.value) trademarkParams.gridm.push('银基广场');
  if (checked9.value) trademarkParams.gridm.push('晶悦城');
  if (checked10.value) trademarkParams.gridm.push('瑞光');
  if (checked11.value) trademarkParams.gridm.push('艺茂仓');
  if (checked12.value) trademarkParams.gridm.push('海汇港');
  if (checked13.value) trademarkParams.gridm.push('磨街文创');
  if (checked14.value) trademarkParams.gridm.push('龙湖里');
  console.log(trademarkParams1)
  trademarkParams1.suoshuid = trademarkParams.gridm.join(', ');
  trademarkParams1.time = trademarkParams1.time.join(', ');
  await Planning_ADD_action(trademarkParams1)
  dialogFormVisible.value = false
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
//分页器页数变化时触发
//此时也会回传一些数据，子组件给父组件
// const changepageno = () => {
//   //切换就触发
// }
//组件挂载完毕请求--发一次请求
onMounted(() => {
  getHasAction()
})
let addressesvalue = ref([])
//存储已有品牌数据总量
//上传图片之前进行一些限制
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
  //要求:上传文件格式png|jpg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}
let action = ref('')
let length = ref(0)
const List  = (row) => {
  page.value = 0
  action.value = row.name
  const name = row.suoshuid
  // 使用逗号分隔字符串，然后去除多余的空格
const addresses = name.split(',').map(address => address.trim());
// 输出结果
console.log(addresses);
addressesvalue.value = addresses
length.value = addressesvalue.value.length
console.log(length.value)
dialogpot.value = true
}
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  trademarkParams1.image = response.data
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
