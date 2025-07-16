<template>
  <div>
    <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="网格名称:">
        <el-input placeholder="请你输入搜索网格" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @mousedown="e => e.preventDefault()"
          type="primary"
          size="default"
          :disabled="keyword ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
    <el-card style="margin: 10px 0px">
      <div v-show="woc == 0">
        <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" icon="Plus" @click="add">新增规划</el-button>
        <el-table border style="margin: 10px 0px" :data="planArr" :default-sort="{prop: 'state',order: 'descending'}">
        <el-table-column label="序号" type="index" align="center" width = 80px></el-table-column>
        <el-table-column label="规划类型"  align="center" width = 100px prop="renwutype"></el-table-column>
          <el-table-column label="规划详情" align="center" width=400px prop="describle"></el-table-column>
          <el-table-column label="所属网格" align="center" prop="suoshuid"></el-table-column>
          <el-table-column label="具体网格"  align="center" prop="gridsmall"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="time"></el-table-column>
            <!-- <el-table-column label="完成时间" align="center" prop="finishtime"></el-table-column> -->
            <el-table-column label="执行情况" align="center" prop="state"></el-table-column>
          <el-table-column label="操作"  align="center">
            <template #="{ row, $index }">
              <!-- <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" @click="Edit(row)" icon="Edit" v-if="row.state == '未完成'"></el-button> -->
              <el-popconfirm :title="`确定取消${row.planningstyle}吗？`" width="200px" @confirm="Delete(row.id)">
                <template #reference>
                  <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 10, 15,20]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasPlan"
      @size-change="handler"
    />
      </div>
    </el-card>
    <el-dialog v-model="dialogTableVisible" :title="`${title}执行结果`" width="800">
      <el-divider />
      <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item v-for="item in imglist" :key="item">
      <h3 text="2xl" justify="center">{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
      <el-divider />
      <div style="height: 150px;">
        具体实施过程
        <div>
          
        </div>
      </div>
      <el-button @mousedown="e => e.preventDefault()" style="margin-left: 600px;" @click="noproblem(id)" type="success">确认</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="danger" @click="problem(id)">驳回</el-button>

  </el-dialog>
  </div>
</template>
<script setup lang="ts">
//组合式API函数watch
import useLayOutSettingStore from '@/store/modules/setting'
// import { reactive} from 'vue'
import { reactive } from 'vue'
//引入获取已有属性和属性值接口的方法
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { Planning_deletegetcomplete, Planning_getcomplete, Planning_OK, Planning_problem, Planning_searchgetcomplete } from '@/api/planning/index'
let settingStore = useLayOutSettingStore()
let $router = useRouter()
//组件挂载完毕
let imglist = ref([])
let attrArr = ref<Attr[]>([])
let woc = ref(0)
let src = ref("") 
//准备一个数组，将来使用存储对应组件实例
let inputArr = ref<any>([])
let title = ref('')
let id = reactive<any>({
  id: '',
})
  let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(20)
  let total = ref<number>(0)
//存储全部用户的数组
let planArr = ref<Records>([])
//定义响应式数值，控制编辑和查看模式的切换
let flag = ref<boolean>(true)
let gridData = ref([])
  let dialogTableVisible = ref(false)
  const getHasPlan = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager
  let result = await Planning_getcomplete(pageNo.value,pageSize.value)
    total.value = result.data.total
    planArr.value = result.data.rows
    console.log(result)
}
const handler = () => {
  getHasPlan()
}
const Edit =(row)=>{
  dialogTableVisible.value = true
  title = row.renwutype
  src = row.src
  id.id = row.id
}
const noproblem = (id) =>{
  dialogTableVisible.value = false
  Planning_OK(id)
  settingStore.refresh = !settingStore.refresh
}
const problem = (id) =>{
  dialogTableVisible.value = false
  Planning_problem(id)
  settingStore.refresh = !settingStore.refresh
}
let keyword = ref('')
let pipi = 0
const search = () => {
  //根据关键字获取相应的用户数据
  console.log(keyword.value)
  getSearchUser()
  //清空关键字
  keyword.value=('')
  pipi=1
}
const Delete   = async (id) => {
  let result: any = await Planning_deletegetcomplete(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasPlan(planArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
const getSearchUser = async () => {
  //收集当前页码
  let result1 = await Planning_searchgetcomplete(keyword.value)
  console.log(result1)
    total.value = result1.data.total
    planArr.value = result1.data
    console.log(planArr.value)
}
const reset = () => {
  settingStore.refresh = !settingStore.refresh
  pipi = 0
}
onMounted(() => {
  getHasPlan(1)
})

const add = () => {
 $router.push({
  name: 'attrs'
 })
}
</script>
<style>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#container{
    padding:-20px;
    margin-top: -10px;
    width: 100%;
    height: 590px;
}
</style>
