<template>
  <div class="problem-management">
    <!-- 搜索卡片 -->
    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" class="search-form">
        <el-form-item label="网格编码:" class="form-item">
          <el-input 
            placeholder="请输入搜索网格编码" 
            v-model="encodes"
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="form-item">
          <el-button 
            type="primary" 
            size="default" 
            :disabled="!encodes" 
            @click="search"
            class="search-btn"
          >
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button 
            type="info" 
            size="default" 
            @click="reset"
            class="reset-btn"
          >
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 问题表格卡片 -->
    <el-card class="table-card" shadow="hover">
      <el-table 
        class="problem-table" 
        :border="true" 
        :data="problemArr" 
        :default-sort="{ prop: 'state', order: 'descending' }"
        stripe
        highlight-current-row
      >
        <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
        
        <el-table-column 
          align="center" 
          label="问题类型"
          :filters="[
            { text: '人流拥挤', value: '人流拥挤' },
            { text: '垃圾桶满溢', value: '垃圾桶满溢' },
            { text: '噪声过大', value: '噪声过大' },
            { text: '小摊违停', value: '小摊违停' },
          ]"
          :filter-method="filterHandler"
        >
          <template #default="{ row }">
            <el-tag :type="getProblemTypeTag(row.renwutype)" size="small">
              {{ row.renwutype }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="问题图片">
          <template #default="{ row }">
            <!-- <img 
              :src="row.image" 
              alt="图片暂未加载" 
              class="problem-image"
            > -->
            <img 
              src="/img/屏幕截图 2025-06-27 203801.png" 
              alt="图片暂未加载" 
              class="problem-image"
              v-if="row.renwutype == '垃圾桶满溢'"
            >
            <img 
              src="/img/屏幕截图 2025-06-27 203801.png" 
              alt="图片暂未加载" 
              class="problem-image"
              v-if="row.renwutype == '噪声过大'"
            >
            <img 
              src="/img/屏幕截图 2025-06-27 203801.png" 
              alt="图片暂未加载" 
              class="problem-image"
              v-if="row.renwutype == '小摊违停'"
            >
            <img 
              src="/img/屏幕截图 2025-06-27 203801.png" 
              alt="图片暂未加载"  
              class="problem-image"
              v-if="row.renwutype == '人流拥挤'"
            >
          </template>
        </el-table-column>
        
        <el-table-column label="问题所在具体网格" width="180" align="center" prop="gridsmall"></el-table-column>
        
        <el-table-column label="发现问题时间" width="138" align="center">
          <template #default="{ row }">
            {{ timer(row.time) }}
          </template>
        </el-table-column>
        
        <el-table-column label="问题上报处" width="138" align="center" prop="findpeople"></el-table-column>
        
        <el-table-column 
          label="问题状态" 
          width="100" 
          align="center" 
          prop="state"
          :filters="[
            { text: '未处理', value: '未处理' },
            { text: '已派遣', value: '已派遣' },
            { text: '已完成', value: '已完成' },
          ]"
          :filter-method="filterHandler2"
        >
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.state)" size="small">
              {{ row.state }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column align="center" label="操作" width="150">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small" 
              icon="List" 
              @click="edit(row)"
              class="action-btn"
            >
              详情
            </el-button>
            <el-button 
              type="success" 
              size="small" 
              icon="Position" 
              @click="solve(row)" 
              v-if="row.state == '未处理'"
              class="action-btn"
            >
              处理
            </el-button>  
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Last_GeWang_problem, Last_GeWang_problem_search, Last_GeWang_problem_work, Last_GeWang_problem_work_pro } from '@/api/last_gewang/index'
import useUserStore from '@/store/modules/users'
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router'
import {Last_GeWang_user} from '@/api/last_gewang/index'
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
let problemArr = ref([])
let $router = useRouter()
let useStore = useUserStore()
let settingStore = useLayOutSettingStore()
let dialogFormVisible = ref(false)
let problemParams = reactive({
    id: '',
    name: '',
    time: '',
})
let postinfor = reactive({
  suoshugrid: ''
})
let encodes = ref('')
let pipi = 0
const search = () => {
  //根据关键字获取相应的用户数据
  console.log(encodes.value)
  getSearchUser()
  //清空关键字
  encodes.value=('')
  pipi=1
}
const reset = () => {
  settingStore.refresh = !settingStore.refresh
  pipi = 0
}
const getSearchUser = async () => {
  //收集当前页码
  let num = parseInt(encodes.value)
  console.log(num)
  console.log(typeof num)
  let result1 = await Last_GeWang_problem_search(num)
  console.log(result1)
    problemArr.value = result1.data
    console.log(userArr.value)
}
interface problemArr {
  id: string
  problem: string
  img: string
  littlewg: string
  time: string
  uppeople: string
  state: string
}
const filterHandler = (value: string,row: problemArr,column:any) => {
  // console.log(value)
  const property = column['filteredValue']
  // console.log(property[0])
  return row.renwutype === value
}
const filterHandler2 = (value: string,row: problemArr,column:any) => {
  console.log(value)
  const property = column['filteredValue']
  console.log(property[0])
  return row.state === value
}
const timer = (time) => {
  const date = new Date(time);
      return date.toLocaleString();
}
const value = ref('')
const options = [
{
    value: '',
    label: '',
}
]
const options1 = [

]
const cancel =()=>{
    dialogFormVisible.value = false
}
const right =()=>{
    Last_GeWang_problem_work_pro(problemArr.id, value.value)
    dialogFormVisible.value = false
    LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
postinfor.suoshugrid = useStore.level
//获取全部已有的用户信息
let userArr = ref([])
const getHasUser = async () => {
  //收集当前页码
  let result = await Last_GeWang_user(postinfor.suoshugrid)
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
var member = []
  // 使用URLSearchParams获取参数
const getProblem =async() =>{
   let result =  await Last_GeWang_problem()
   console.log(result)
   problemArr.value = result.data
   console.log(problemArr.value)
}
const solve=(row)=> {
  $router.push({
    name: 'solvegewangproble'
})
useStore.id = row.id
  
}
const edit =(row)=>{
$router.push({
    name: 'gewangproblemer'
})
useStore.id = row.id
}
onMounted(()=>{
getHasUser()
getProblem()
})

// 辅助函数：获取问题类型标签
const getProblemTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    '人流拥挤': 'danger',
    '垃圾桶满溢': 'warning',
    '噪声过大': 'warning',
    '小摊违停': 'info'
  }
  return typeMap[type] || 'info'
}

// 辅助函数：获取状态标签类型
const getStatusTagType = (state: string) => {
  const typeMap: Record<string, string> = {
    '未处理': 'danger',
    '已派遣': 'warning',
    '已完成': 'success'
  }
  return typeMap[state] || 'info'
}
</script>

<style scoped lang="scss">
.problem-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  
  .search-card {
    margin-bottom: 20px;
    border-radius: 16px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
  }
  
  .table-card {
    border-radius: 16px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    
    .problem-table {
      border-radius: 12px;
      overflow: hidden;
      
      .problem-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        object-fit: cover;
        border: 2px solid #e2e8f0;
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
      
      .action-btn {
        border-radius: 6px;
        margin: 0 4px;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .problem-management {
    padding: 10px;
    
    .search-card .search-form {
      flex-direction: column;
      align-items: stretch;
      
      .form-item .search-input {
        width: 100%;
      }
    }
    
    .table-card .problem-table {
      font-size: 12px;
      
      .problem-image {
        width: 60px;
        height: 60px;
      }
    }
  }
}
</style>