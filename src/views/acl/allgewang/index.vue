<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="网格搜索">
        <el-input
          placeholder="请你输入搜索网格关键字"
          v-model="keyword"
        ></el-input>
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
    <el-table border style="margin: 10px 0px" :data="allRole" :default-sort="{ prop: 'point', order: 'descending' }">
      <el-table-column type="index" align="center" label="id"></el-table-column>
      <el-table-column
        label="网格名称"
        align="center"
        prop="suoshugrid"
        show-overflow-tooltip
      ></el-table-column>      
      <el-table-column
        label="网格类型"
        align="center"
        show-overflow-tooltip
        prop="leixing"
      ></el-table-column>
      <el-table-column
        label="网格管理员"
        align="center"
        show-overflow-tooltip
        prop="name"
      ></el-table-column>
      <el-table-column
        label="下属员工数量"
        align="center"
        show-overflow-tooltip
        prop="staff_number"
      ></el-table-column>

      <el-table-column
        label="是否建成"
        align="center"
        show-overflow-tooltip
        prop="build_judgment"
      >
      <template v-slot="scoped">
        <div v-if="scoped.row.build_judgment==0">已建成</div>
        <div v-if="scoped.row.build_judgment==1">未建成</div>
      </template>
    </el-table-column>
      <el-table-column
        label="网格评分"
        align="center"
        show-overflow-tooltip
        prop="point"
      ></el-table-column>
      <el-table-column label="操作" width="380px" align="center">
        <template #="{ row, $index }">
          <el-button @mousedown="e => e.preventDefault()"
            type="primary"
            size="small"
            icon="Edit"
            @click="Edit(row.centerlat,row.centerlon,row.suoshugrid)"
          >
            修改网格
          </el-button>
          <el-button @mousedown="e => e.preventDefault()"
            type="primary"
            size="small"
            icon="Edit"
            @click="LOOK()"
          >
            查看3D网格
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.suoshugrid}相关数据吗?`"
            width="260px"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
//请求方法
import {GeWang_DELETE, GeWang_Information} from '@/api/gewang/index'
//引入骨架的仓库
import useUserStore from '@/store/modules/users'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'
let useStore = useUserStore()
let settingStore = useLayOutSettingStore()
//当前页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(10)
//搜索职位关键字
let keyword = ref<string>('')
//存储全部已有的职位
let allRole = ref<Records>([])
//职位总个数
let total = ref<number>(0)
//控制对话框的显示与隐藏
let dialogVisite = ref<boolean>(false)
//获取form组件实例
let form = ref<any>()
//控制抽屉显示与隐藏
let drawer = ref<boolean>(false)
//收集新增岗位数据
let RoleParams = reactive<RoleData>({
  roleName: '',
})
//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([])
//定义数组存储用户权限的数据
let menuArr = ref<MenuList>([])
//获取tree组件实例
let tree = ref<any>()
  let $router = useRouter()
//组件挂载完毕
onMounted(() => {
  //获取职位请求
  getHasRole()
})
let k = ref('')
//获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  let result = await GeWang_Information()
  allRole.value = result.data
  k = result.data.suoshugrid
  console.log(result)
  }
//下拉菜单的回调
// const sizeChange = () => {
//   getHasRole()
// }
// //搜索按钮的回调
const search = () => {
  //再次发请求根据关键字
  getHasRole()
  keyword.value = ''
}
// //重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
const Edit = (lat:string,lng:string,id:string) => {
  useStore.centerlat = lat;
  useStore.centerlng = lng;
  useStore.centername = id
  $router.push({name: 'change',});
}
const removeRole = async (id: number) => {
  let result: any = await GeWang_DELETE(id)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '删除成功' })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
const LOOK = () =>{
$router.push({
  name: '3Dwangge'
})
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
}
</style>
