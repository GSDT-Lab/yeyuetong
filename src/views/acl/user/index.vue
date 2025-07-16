<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
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
    <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button @mousedown="e => e.preventDefault()"
      type="primary"
      size="default"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser"
    >
      批量删除
    </el-button>
    <!-- table展示用户信息 -->
    <el-table
      @selection-change="selectChange"
      style="margin: 10px 0px"
      border
      :data="userArr"
      :default-sort="{ prop: 'suoshugrid', order: 'descending' }"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="id" align="center" type="index"></el-table-column>
      <el-table-column label="职员名字" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="年龄" align="center" prop="age" show-overflow-tooltip></el-table-column>
      <el-table-column label="职员职位" align="center" prop="position" show-overflow-tooltip></el-table-column>
      <el-table-column label="性别" align="center" prop="gender" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属网格" align="center" prop="suoshugrid" show-overflow-tooltip></el-table-column>
      <el-table-column label="入职时间" align="center" prop="joining_date" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Edit" @click="updateUser(row)">编辑</el-button>
          <el-popconfirm :title="`你确定要删除${row.name}的相关信息吗?`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button @mousedown="e => e.preventDefault()" type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 10, 15]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasUser1"
      @size-change="handler"
    />
  </el-card>
  <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
  <el-drawer v-model="drawer">
    <!-- 头部标题:将来文字内容应该动态的 -->
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <!-- 身体部分 -->
    <template #default>
      <el-form :model="userParams" ref="formRef">
        <el-form-item label="职员姓名" prop="name">
          <el-input
            placeholder="请您输入职员姓名"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="职员年龄" prop="age">
          <el-input
            placeholder="请您输入职员年龄"
            v-model="userParams.age"
          ></el-input>
        </el-form-item>
        <el-form-item label="职员账号" prop="account" v-if="!userParams.id">
          <el-input
            placeholder="请您输入职员账号"
            v-model="userParams.account"
          ></el-input>
        </el-form-item>
          <el-form-item label="职员密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请您输入职员密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="职员性别" prop="sex">
          <el-radio-group v-model="userParams.gender">
          <el-radio label="男" size="large">男</el-radio>
          <el-radio label="女" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="职员职位" prop="position">
          <el-select
        v-model="userParams.position"
        placeholder="请选择职员职位"
        size="large"
        style="width: 240px"
      >
      <el-option
        v-for="item in options1"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
        </el-form-item>
        <el-form-item label="所属网格" prop="suoshugw">
          <el-select
      v-model="userParams.suoshugrid"
      placeholder="请选择所属网格"
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
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @mousedown="e => e.preventDefault()" @click="cancel">取消</el-button>
        <el-button @mousedown="e => e.preventDefault()" type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            @change="handleCheckAllChange"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
          >
            全选
          </el-checkbox>
          <!-- 显示职位的的复选框 -->
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(role, index) in allRole"
              :key="index"
              :label="role"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @mousedown="e => e.preventDefault()" @click="drawer1 = false">取消</el-button>
        <el-button @mousedown="e => e.preventDefault()" type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {GeWang_USER, GeWang_USER_ADD, GeWang_USER_DELETE, GeWang_USER_SEARCH} from '@/api/gewang/index'
let LayOutSettingStore = useLayOutSettingStore()
//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(10)
//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
//控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
//存储全部职位的数据
let allRole = ref<AllRole>([])
//当前用户已有的职位
let userRole = ref<AllRole>([])
//收集用户信息的响应式数据
let userParams = reactive<any>({
  id: '',
  age: '',
  name: '',
  password: '',
  sex: '男',
  account:'',
  position:'',
  suoshugrid:'',
})
const value = ref('')
const getHasUser1=()=>{
  console.log(pageNo.value)
  if(pipi == 0){
    getHasUser(pageNo.value)
  }
}
const options = [
  {
    value: '银基广场',
    label: '银基广场',
  },
  {
    value: '晶悦城',
    label: '晶悦城',
  },
  {
    value: '农科路',
    label: '农科路',
  },
  {
    value: '欣悦荟',
    label: '欣悦荟',
  },
  {
    value: '油化厂',
    label: '油化厂',
  },
  {
    value: '星河里',
    label: '星河里',
  },
  {
    value: '磨街文创',
    label: '磨街文创',
  },
  {
    value: '艺茂仓',
    label: '艺茂仓',
  },
  {
    value: '瑞光',
    label: '瑞光',
  },
  {
    value: '海汇港',
    label: '海汇港',
  },
  {
    value: '正弘汇',
    label: '正弘汇',
  },
  {
    value: '公园茂',
    label: '公园茂',
  },
  {
    value: '龙湖里',
    label: '龙湖里',
  },
  {
    value: '德化',
    label: '德化',
  },
]
const options1 = [
{
    value: '网格管理员',
    label: '网格管理员',
  },
  {
    value: '环卫工',
    label: '环卫工',
  },
  {
    value: '安保人员',
    label: '安保人员',
  },
]
//准备一个数组存储批量删除的用户的ID
let selectIdArr = ref<User[]>([])
//获取form组件实例
let formRef = ref<any>()
//定义响应式数据:收集用户输入进来的关键字
let keyword = ref<string>('')
//获取模板setting仓库
let settingStore = useLayOutSettingStore()
//组件挂载完毕
onMounted(() => {
  getHasUser(1)
})
//获取全部已有的用户信息
const getHasUser = async (pager) => {
  //收集当前页码
  pageNo.value = pager
  let result = await GeWang_USER(pageNo.value,pageSize.value)
    total.value = result.data.total
    userArr.value = result.data.rows
    console.log(userArr.value)
}
const getSearchUser = async () => {
  //收集当前页码
  let result1 = await GeWang_USER_SEARCH(keyword.value)
  console.log(result1)
    total.value = result1.data.total
    userArr.value = result1.data
    console.log(userArr.value)
}
//分页器下拉菜单的自定义事件的回调
const handler = () => {
  getHasUser()
}
//添加用户按钮的回调
const addUser = () => {
  //抽屉显示出来
  drawer.value = true
  //清空数据
  Object.assign(userParams, {
    id: '',
    age: '',
    name: '',
    password: '',
    sex: '0',
    account:'',
    position:'',
    suoshugw:'',
  })
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
//更新已有的用户按钮的回调
//row:即为已有用户的账号信息
const updateUser = (row: User) => {
  //抽屉显示出来
  drawer.value = true
  //存储收集已有的账号信息
  Object.assign(userParams, row)
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
//保存按钮的回调
const save = async () => {
  //点击保存按钮的时候,务必需要保证表单全部复合条件在去发请求
  await formRef.value.validate()
  //保存按钮:添加新的用户|更新已有的用户账号信息
  let result: any = await GeWang_USER_ADD(userParams)
  //添加或者更新成功
  if (result.code == 200) {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    console.log(result.data)
    LayOutSettingStore.refresh = !LayOutSettingStore.refresh
    //获取最新的全部账号的信息
    //浏览器自动刷新一次
  } else {
    //关闭抽屉
    drawer.value = false
    //提示消息
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}
//取消按钮的回调
const cancel = () => {
  //关闭抽屉
  drawer.value = false
}
//校验用户名字回调函数
//表单校验的规则对象
//分配角色按钮的回调

//收集顶部复选框全选数据
const checkAll = ref<boolean>(false)
//控制顶部全选复选框不确定的样式
const isIndeterminate = ref<boolean>(true)
//顶部的全部复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  //val:true(全选)|false(没有全选)
  userRole.value = val ? allRole.value : []
  //不确定的样式(确定样式)
  isIndeterminate.value = false
}
//顶部全部的复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
  //顶部复选框的勾选数据
  //代表:勾选上的项目个数与全部的职位个数相等，顶部的复选框勾选上
  checkAll.value = value.length === allRole.value.length
  //不确定的样式
  isIndeterminate.value = value.length !== allRole.value.length
}
//确定按钮的回调(分配职位)
const confirmClick = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  //分配用户的职位
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    //提示信息
    ElMessage({ type: 'success', message: '分配职务成功' })
    //关闭抽屉
    drawer1.value = false
    //获取更新完毕用户的信息,更新完毕留在当前页
    getHasUser(pageNo.value)
  }
}

//删除某一个用户
const deleteUser = async (userId: number) => {
  let result: any = await GeWang_USER_DELETE(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
//table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}
//批量删除按钮的回调
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idsList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  //批量删除的请求
  let result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
let pipi = 0
//搜索按钮的回调
const search = () => {
  //根据关键字获取相应的用户数据
  console.log(keyword.value)
  getSearchUser()
  //清空关键字
  keyword.value=('')
  pipi=1
}
//重置按钮
const reset = () => {
  settingStore.refresh = !settingStore.refresh
  pipi = 0
}
</script>

<style scoped>
.user-manage-container {
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

.el-form.form {
  display: flex;
  align-items: center;
  gap: 18px;
}

.el-form-item {
  margin-bottom: 0;
}

.el-input {
  border-radius: 12px;
  background: #f7faff;
  border: 1px solid #e0e7ef;
  transition: box-shadow 0.2s;
}

.el-input:focus-within {
  box-shadow: 0 0 0 2px #667eea33;
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
}

.el-pagination {
  margin-top: 10px;
  justify-content: center;
}

.el-drawer__header {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  background: transparent;
  border-bottom: 1px solid #f0f0f0;
}

.el-drawer__body {
  background: #f7faff;
}

.el-drawer__footer {
  background: #f7faff;
}

@media (max-width: 900px) {
  .user-manage-container {
    padding: 8px;
  }
  .el-card {
    padding: 8px;
  }
  .el-form.form {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
