<template>
    <el-card style="margin: 10px 0px"> 
      <div>
        <el-table style="margin: 10px 0px" border :data="getactionArr">
          <el-table-column label="序号" type="index" align="center" width = 80px></el-table-column>
          <el-table-column label="活动名称" prop="name"></el-table-column>
          <el-table-column label="活动所在网格" prop="suoshuid" show-overflow-tooltip></el-table-column>
          <el-table-column label="活动时间" prop="time" show-overflow-tooltip></el-table-column>
          <el-table-column label="活动状态" prop="state" show-overflow-tooltip></el-table-column>        
          <el-table-column label="完成情况" prop="finish" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="300px">
            
            <template #="{row, $index}">            
              <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="View" title="查看详情" @click="look(row)"></el-button>
              <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" @click="Edit(row)" icon="Edit" v-if="row.finish == '未完成'"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination
          @size-change="ChangeSize"
          @current-change="getSpu"
          v-model:current-page="pageNo"
          :page-sizes="[3, 5, 7, 9]"
          background="true"
          v-model:page-size="pageSize"
          layout="  prev, pager, next, jumper,->,sizes,total"
          :total="total">
        </el-pagination> -->
      </div>
      <!-- dialog对话框,已有sku属性 -->
      <el-dialog v-model="dialogFormVisiblee" title="问题处理">
    <el-form style="width: 80%;" :model = 'problemParams' ref="formRef">
      <el-form-item label="选择人员" label-width="100px" prop="name">
        <el-select
      v-model="value"
      placeholder="Select"
      size="large"
      style="width: 240px"
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
    <template #footer>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="cancel">取消</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="right">确定</el-button>
    </template>
  </el-dialog>
      <el-dialog :title=title v-model="show">
        <el-form>      
          <el-form-item label="活动详情">
          <div>{{ describle }}</div>
        </el-form-item>
        <el-form-item label="活动描述">
          <div>{{ describle }}</div>
        </el-form-item>
        <el-form-item label="活动图片">
          <img :src="image" alt="" width="200px" height="200px">
        </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
  </template>
  <script setup lang="ts">
  import { ref, watch, onBeforeMount, onMounted, reactive } from 'vue'
  //场景数值
  import { ElMessage } from 'element-plus'
  import useLayOutSettingStore from '@/store/modules/setting'
  import { Last_GeWang_action, Last_GeWang_action_all, Last_GeWang_action_send, Last_GeWang_problem_work, Last_GeWang_user } from '@/api/last_gewang/index'
  import useUserStore from '@/store/modules/users'
let useStore = useUserStore()
let dialogFormVisiblee = ref(false)
  let LayOutSettingStore = useLayOutSettingStore()
  let settingStore = useLayOutSettingStore()
  let Spu = ref<any>()
  let scene = ref<number>(0)
  //存储已有的spu数据
  let records = ref<Records>([])
  let getactionArr = ref([])
  //获取子组件示例
  let show = ref<boolean>(false)
  let Sku = ref<any>()
  let i
  const value = ref('')
const options = [
{
    value: '',
    label: '',
}
]
const cancel = () => {
  dialogFormVisible.value = false
}
let ids2 = ref()
const right = () => {
  console.log(id.value)
  console.log(value.value)
  Last_GeWang_problem_work(id.value,value.value)
  dialogFormVisible.value = false
  settingStore.refresh = !settingStore.refresh
}
let postinfor = reactive({
  suoshugrid: ''
})
let id = ref()
const options1 = []
const Edit =(row)=>{
  dialogFormVisiblee.value = true
  title = row.renwutype
  ids2.value = row.id
  id.value = row.id
  console.log(row.id)
}
postinfor.suoshugrid = useStore.level
let userArr = ref([])
const getHasUser = async () => {
  //收集当前页码
  let result = await Last_GeWang_user(postinfor.suoshugrid)
  
  console.log(result)
    userArr.value = result.data
    console.log(userArr.value)
    console.log(userArr.value.length)
    let i
    for(i=0;i<userArr.value.length;i++){
        if (userArr.value[i].work == '空闲中') { // 只有当work为'空闲'时才添加到options数组中
        console.log(userArr.value[i].name);
        options1.push({
            value: userArr.value[i].name,
            label: userArr.value[i].name,
        })
    }  
}
console.log(options1)
for(i=0;i<options1.length;i++){
    if (i >= options.length) {
        options[i] = {}; // 创建一个新的对象
    }
    options[i].label = options1[i].label
    options[i].value = options1[i].value
    console.log(options[i]);
}
}
    const getHasgetAction = async () => {
    //收集当前页码
    let result = await Last_GeWang_action_all(useStore.level)
    console.log(result)
      getactionArr.value = result.data
      console.log(getactionArr.value)
  }
  let describle = ref('')
  let title = ref('')
  let dialogFormVisible = ref(false)
  let image = ref('')
  const look=(row) => {
    show.value = true
    describle.value = row.describle
    title = row.name
    image = row.image
    console.log(row)
  }
  let trademarkParams = reactive({
    name: '',
    image: '',
    time: '',
    suoshuid: useStore.level,
    describle: '',
    content: '',
  })
  let ids = reactive({
   id: '',
  });
const add= () => {
dialogFormVisible.value = true
}
  onMounted(()=>{
    getHasUser()
    getHasgetAction()
  })
  
  </script>
  <style scoped>
.youractivity-container {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.el-card {
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.08);
  border: none;
  background: rgba(255,255,255,0.97);
  margin-bottom: 18px;
}

.el-table {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255,255,255,0.98);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.06);
}

.el-table th, .el-table td {
  font-size: 15px;
  color: #333;
}

.el-table th {
  background: #f5f7fa;
  font-weight: 700;
}

.el-table .el-button {
  margin: 0 4px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
}

.el-button[type="primary"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.el-dialog__header {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  background: transparent;
  border-bottom: 1px solid #f0f0f0;
}

.el-dialog__body {
  background: #f7faff;
}

.el-dialog__footer {
  background: #f7faff;
}

.el-form {
  margin: 0 auto;
  padding: 10px 0;
}

.el-form-item {
  margin-bottom: 18px;
}

.el-input, .el-select {
  border-radius: 10px;
  background: #f7faff;
  border: 1px solid #e0e7ef;
  transition: box-shadow 0.2s;
}

.el-input:focus-within, .el-select:focus-within {
  box-shadow: 0 0 0 2px #667eea33;
}

@media (max-width: 900px) {
  .youractivity-container {
    padding: 8px;
  }
  .el-card {
    padding: 8px;
  }
}
</style>
  