<template>
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
    <el-table border style="margin: 10px 0px;" :data="skuArr" :default-sort="{prop: 'state',order: 'descending'}">
      <el-table-column label="序号" type="index" align="center" width="80px" ></el-table-column>
      <el-table-column label="规划类型" show-overflow-tooltip width="100px"  align="center" prop="renwutype"></el-table-column>
      <el-table-column label="详细规划" show-overflow-tooltip width="300px"   align="center" prop="describle"></el-table-column>
      <el-table-column label="所属网格"  align="center" prop="suoshuid" width="100px"></el-table-column>
      <el-table-column label="具体位置"  align="center" width="100px" prop="gridsmall"></el-table-column>
      <el-table-column label="申请人员" width="100px"  align="center" prop="gridman"></el-table-column>
      <el-table-column label="申请时间" width="100px"  align="center" prop="time"></el-table-column>
      <el-table-column label="审批结果" width="100px"  align="center" prop="state"></el-table-column>
      <el-table-column label="操作"   align="center">
        <template #="{row, $index}">
          <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="List" @click="findplan(row)">详情</el-button>
          <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Check" @click="believe(row)" v-if="row.state == '未审批'">确认</el-button>
          <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Close" @click="Delete(row)" v-if="row.state == '未审批'">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getHasplan1"
      @size-change="handel2"
      v-model:current-page="pageNo"
      :page-sizes="[10, 20, 30, 40]"
      v-model:page-size="pagesize"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      :background="true">
    </el-pagination>
  </el-card>
  <el-dialog
    v-model="dialogVisiblerr"
    title="规划驳回"
    width="500"
  >
    <span>驳回原因</span>
    <el-select v-model="bohui" placeholder="Select" style="width: 240px;margin-left: 20px;">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <template #footer>
      <div class="dialog-footer">
        <el-button @mousedown="e => e.preventDefault()" @click="dialogVisiblerr = false">取消</el-button>
        <el-button @mousedown="e => e.preventDefault()" type="primary" @click="cooler()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted,reactive} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus';
import useLayOutSettingStore from '@/store/modules/setting'
import { Planning_your_complete, Planning_your_complete_ok, Planning_your_complete_problem, Planning_your_complete_search } from '@/api/planning/index';
import useUserStore from '@/store/modules/users';
let useStore = useUserStore()
let settingStore = useLayOutSettingStore()
let pageNo = ref<number>(1)
let pagesize = ref<number>(20)
let total = ref<number>(0)
let $router = useRouter()
  let keyword = ref('')
  let bohui =ref('')
let pipi = 0
const options = [
  {
    value: '与其他夜市同质化高',
    label: '与其他夜市同质化高',
  },
  {
    value: '噪声污染大',
    label: '噪声污染大',
  },
  {
    value: '空气污染大',
    label: '空气污染大',
  },
  {
    value: '易造成人流拥堵',
    label: '易造成人流拥堵',
  },
  {
    value: '资金预算过高',
    label: '资金预算过高',
  },
]
let dialogVisiblerr = ref(false)
const search = () => {
  //根据关键字获取相应的用户数据
  console.log(keyword.value)
  getSearchplan()
  //清空关键字
  keyword.value=('')
  pipi=1
}
let id = reactive<any>({
  id: '',
})
let skuArr = ref([])
let planArr = ref([])
const getHasplan1=()=>{
  if(pipi == 0){
    getHasplan()
  }
}
const getSearchplan = async () => {
  //收集当前页码
  let result1 = await Planning_your_complete_search(keyword.value)
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
  getHasplan()
})
//商品详情按钮
const findplan = async (row) => {
  //抽屉展示
$router.push({
  name: 'comfirmer',
  query: {
  paramName: row.id  // 参数名和值
}
})  
useStore.id = row.id
}
const Delete = async (row) => {
  id.id = row.id
  dialogVisiblerr.value=true
  // Planning_your_complete_problem(id)
  // settingStore.refresh = !settingStore.refresh
}
const cooler =()=>{
  console.log(id.id)
  dialogVisiblerr.value=false
  Planning_your_complete_problem(id.id)
  settingStore.refresh = !settingStore.refresh
}
const getHasplan = async (pager = 1) => {
  //当前分页器页码
  pageNo.value = pager
  let result = await Planning_your_complete(pageNo.value, pagesize.value)
    total.value = result.data.total
    skuArr.value = result.data.rows
    console.log(result)
}
const handel2 = async (pagesizes: number) => {
  getHasplan()
}
const believe = (row) => {
  id.id = row.id
  console.log(id)
  Planning_your_complete_ok(id)
  settingStore.refresh = !settingStore.refresh
}
</script>
<style></style>
