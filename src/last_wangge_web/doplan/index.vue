<template>
  <div>
    <el-card style="margin: 10px 0px">
      <div v-show="woc == 0">
        <el-table border style="margin: 10px 0px" :data="planArr">
        <el-table-column label="序号" type="index" align="center" width = 80px></el-table-column>
        <el-table-column label="规划类型"  align="center" width = 100px prop="renwutype"></el-table-column>
          <el-table-column label="规划详情" align="center" width=400px prop="describle"></el-table-column>
          <el-table-column label="所属网格" align="center" prop="suoshuid"></el-table-column>
          <el-table-column label="具体网格"  align="center" prop="gridsmall"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="time"></el-table-column>
            <el-table-column label="执行情况" align="center" prop="state"></el-table-column>
          <el-table-column label="操作"  align="center">
            <template #="{ row, $index }">
              <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" @click="Edit(row)" icon="Edit" v-if="row.state == '未完成'"></el-button>
              <el-popconfirm :title="`确定取消${row.planningstyle}吗？`" width="200px" @confirm="Delete(row.id)">
                <template #reference>
                  <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 10, 15]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasUser1"
      @size-change="handler"
    /> -->
      </div>
    </el-card>
    <!-- <el-dialog v-model="dialogTableVisible" :title="`${title}执行结果`" width="800">
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
  </el-dialog> -->

  <el-dialog v-model="dialogFormVisible" title="问题处理">
    <el-form style="width: 80%;" :model = 'problemParams' ref="formRef">
      <el-form-item label="选择人员" label-width="100px" prop="name">
        <div>
          <el-checkbox v-model="checked1" label="胡图" size="large" v-if="ae[18]"/>
          <el-checkbox v-model="checked2" label="张笑天" size="large" v-if="ae[20]"/>
          <el-checkbox v-model="checked3" label="燕绍淳" size="large" v-if="ae[4]"/>
          <el-checkbox v-model="checked4" label="潘乃荣" size="large" v-if="ae[22]"/>
          <el-checkbox v-model="checked5" label="罗广" size="large" v-if="ae[19]"/>
          <el-checkbox v-model="checked6" label="李现岱" size="large" v-if="ae[21]" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="cancel">取消</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="right">确定</el-button>
    </template>
  </el-dialog>
  </div>
</template>
<script setup lang="ts">
//组合式API函数watch
import useLayOutSettingStore from '@/store/modules/setting'
import { reactive,watch} from 'vue'
//引入获取已有属性和属性值接口的方法
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { Planning_deletegetcomplete, Planning_getcomplete, Planning_OK, Planning_problem, Planning_searchgetcomplete } from '@/api/planning/index'
import {Last_GeWang_problem_work, Last_GeWang_user} from '@/api/last_gewang/index'
import useUserStore from '@/store/modules/users'
import { describe } from 'node:test'
let useStore = useUserStore()
let settingStore = useLayOutSettingStore()
let $router = useRouter()
//组件挂载完毕
let imglist = ref([])
let attrArr = ref<Attr[]>([])
let woc = ref(0)
let src = ref("") 
let checked1 = ref(false)
  let checked2 = ref(false)
  let checked3 = ref(false)
  let checked4 = ref(false)
  let checked5 = ref(false)
  let checked6 = ref(false)
  let ae=reactive([false,false,false,false,false,false])
//准备一个数组，将来使用存储对应组件实例
let inputArr = ref<any>([])
let title = ref('')
let id = reactive<any>({
  id: '',
})
let selectedNames = ref([]); // 存储被选中的人员名字

// 监听复选框的变化
watch([checked1, checked2, checked3, checked4, checked5, checked6], (newValues) => {
  selectedNames.value = [];
  newValues.forEach((checked, index) => {
    if (checked) {
      const names = ['胡图', '张笑天', '燕绍淳', '潘乃荣', '罗广', '李现岱'];
      selectedNames.value.push(names[index]);
    }
  });
}, { deep: true });
let dialogFormVisible = ref<boolean>(false)
//存储全部用户的数组
let planArr = ref<Records>([])
//定义响应式数值，控制编辑和查看模式的切换
let flag = ref<boolean>(true)
let gridData = ref([])
  let dialogTableVisible = ref(false)
const value = ref('')
const options = [
{
    value: '',
    label: '',
}
]
let postinfor = reactive({
  suoshuid: useStore.level
})
const options1 = [

]
postinfor.suoshugrid = useStore.level
let userArr = ref([])
const getHasUser = async () => {
  //收集当前页码
  let result = await Last_GeWang_user(postinfor.suoshuid);
  userArr.value = result.data;
  console.log(userArr.value)
  for (let i = 0; i < userArr.value.length; i++) {
    if (userArr.value[i].work === '空闲中'&& userArr.value[i].position != '网格管理员') {
      ae[userArr.value[i].id]=true
    }
  }
  console.log(ae)
}
  const getHasPlan = async () => {
  //收集当前页码
  let result = await Planning_searchgetcomplete(useStore.level)
    planArr.value = result.data
    console.log(result)
}
const cancel = () => {
  dialogFormVisible.value = false
}
let ids = ref()
let describle = ref('')
const right = () => {
  value.value = selectedNames.value.join(', ');
  console.log(ids.value)
  Last_GeWang_problem_work(ids.value,value.value,describle.value)
  dialogFormVisible.value = false
  settingStore.refresh = !settingStore.refresh
}
const Edit =(row)=>{
  dialogFormVisible.value = true
  title = row.planningstyle
  src = row.src
  ids.value = row.id
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
const Delete   = async (id) => {
  let result: any = await Planning_deletegetcomplete(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasPlan(planArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
onMounted(() => {
  getHasUser()
  getHasPlan()
})
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
