<template>
  <el-card style="margin: 10px 0px"> 
    <div>
      <el-table style="margin: 10px 0px" border :data="getactionArr" :default-sort="{prop: 'check',order: 'descending'}">
        <el-table-column label="序号" type="index" align="center" width = 80px></el-table-column>
        <el-table-column label="活动名称" prop="name"></el-table-column>
        <el-table-column label="活动所在网格" prop="suoshuid" show-overflow-tooltip></el-table-column>
        <el-table-column label="活动时间" prop="time" show-overflow-tooltip></el-table-column>
        <el-table-column label="活动状态" prop="state" show-overflow-tooltip></el-table-column>        
        <el-table-column label="审批结果" prop="check" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="300px">
          <template #="{row, $index}">            
            <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="View" title="查看详情" @click="look(row)"></el-button>
            <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Plus" v-if="row.check == '未审批'" title="确认活动" @click="add(row)"></el-button>
            <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Edit" v-if="row.check == '未审批'" title="驳回活动" @click="refuse(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handler"
        @current-change="getHasgetAction"
        v-model:current-page="pageNo"
        :page-sizes="[3, 5, 7, 9]"
        background="true"
        v-model:page-size="pageSize"
        layout="  prev, pager, next, jumper,->,sizes,total"
        :total="total">
      </el-pagination>
    </div>
    <!-- dialog对话框,已有sku属性 -->
    <el-dialog :title=title v-model="show">
      <el-form>      
        <el-form-item label="活动详情">
        <div>{{ describle }}</div>
      </el-form-item>
      <el-form-item label="活动描述">
        <div>{{ describle }}</div>
      </el-form-item>
      <el-form-item label="活动图片">
        <img :src="image" alt="" style="width: 200px;height: 200px;">
      </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
  <el-dialog
    v-model="dialogVisiblerr"
    title="活动驳回"
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
import { ref, watch, onBeforeMount, onMounted, reactive } from 'vue'
//场景数值
import { ElMessage } from 'element-plus'
import { Planning_action_get, Planning_action_OK, Planning_action_REFUSE, Planning_your_complete_problem } from '@/api/planning/index'
import useLayOutSettingStore from '@/store/modules/setting'
let LayOutSettingStore = useLayOutSettingStore()
let Spu = ref<any>()
let settingStore = useLayOutSettingStore()
let scene = ref<number>(0)
//分页器默认页码
let pageNo = ref<number>(1)
//每页展示数量
let pagesize = ref<number>(5)
//存储已有的spu数据
let records = ref<Records>([])
let total = ref<number>(0)
let getactionArr = ref([])
//获取子组件示例
let show = ref<boolean>(false)
let Sku = ref<any>()
  let dialogVisiblerr = ref(false)
  let bohui =ref('')
  let id = reactive<any>({
  id: '',
})
  const cooler =()=>{
  let ider = parseInt(id.id)
  console.log(ider)
  dialogVisiblerr.value=false
  Planning_action_REFUSE(ider)
  settingStore.refresh = !settingStore.refresh
}
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
  const getHasgetAction = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager
  let result = await Planning_action_get(pageNo.value,pagesize.value)
    total.value = result.data.total
    getactionArr.value = result.data.rows
    console.log(result)
}
let describle = ref('')
let title = ref('')
let image = ref('')
const look=(row) => {
  show.value = true
  describle.value = row.describle
  title = row.name
  image = row.image
  console.log(row)
}
let ids = reactive({
 id: '',
});
const handler = () => {
  getHasgetAction()
}
const add = (row) => {
  console.log(row.id)
  ids.id = row.id
  Planning_action_OK(ids)
  LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
const refuse = (row) => {
  id.id = row.id
  dialogVisiblerr.value=true
}
onMounted(()=>{
  getHasgetAction()
})

</script>
<style></style>
