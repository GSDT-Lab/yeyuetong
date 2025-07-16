<template>
  <div class="user-management">
    <!-- 搜索卡片 -->
    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" class="search-form">
        <el-form-item label="用户名:" class="form-item">
          <el-input 
            placeholder="请输入搜索用户名" 
            v-model="keyword"
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
            :disabled="!keyword" 
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

    <!-- 操作和表格卡片 -->
    <el-card class="table-card" shadow="hover">
      <div class="action-bar">
        <el-button 
          type="primary" 
          size="default" 
          @click="addUser"
          class="add-btn"
        >
          <el-icon><Plus /></el-icon>
          添加职工
        </el-button>
        <el-button 
          type="danger" 
          size="default" 
          :disabled="!selectIdArr.length" 
          @click="deleteSelectUser"
          class="delete-btn"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </div>

      <!-- 表格展示用户信息 -->
      <el-table
        @selection-change="selectChange"
        class="user-table"
        border
        :data="userArr"
        stripe
        highlight-current-row
      >
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column label="ID" align="center" type="index" width="80"></el-table-column>
        <el-table-column label="职员名字" align="center" prop="name" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="user-name">
              <el-avatar :size="32" class="user-avatar">
                {{ row.name?.charAt(0) }}
              </el-avatar>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="年龄" align="center" prop="age" width="80"></el-table-column>
        <el-table-column label="职员职位" align="center" prop="position" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag :type="getPositionTagType(row.position)" size="small">
              {{ row.position }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center" prop="gender" width="80">
          <template #default="{ row }">
            <el-tag :type="row.gender === '男' ? 'primary' : 'danger'" size="small">
              {{ row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="所属网格" align="center" prop="suoshugrid" show-overflow-tooltip></el-table-column>
        <el-table-column label="入职时间" align="center" prop="joining_date" show-overflow-tooltip></el-table-column>
        <el-table-column label="工作状态" align="center" prop="work" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag :type="getWorkStatusType(row.work)" size="small">
              {{ row.work }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small" 
              icon="Edit" 
              @click="updateUser(row)"
              class="action-btn edit-btn"
            >
              编辑
            </el-button>
            <el-popconfirm 
              :title="`确定要删除${row.name}的相关信息吗?`" 
              width="260px" 
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <el-button 
                  type="danger" 
                  size="small" 
                  icon="Delete"
                  class="action-btn delete-btn"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 抽屉结构:完成添加新的用户账号|更新已有的账号信息 -->
    <el-drawer v-model="drawer" direction="rtl" size="500px">
      <template #header>
        <div class="drawer-header">
          <h3>{{ userParams.id ? '更新职工' : '添加职工' }}</h3>
        </div>
      </template>
      
      <template #default>
        <el-form :model="userParams" ref="formRef" class="drawer-form">
          <el-form-item label="职员姓名" prop="name">
            <el-input
              placeholder="请输入职员姓名"
              v-model="userParams.name"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="职员年龄" prop="age">
            <el-input
              placeholder="请输入职员年龄"
              v-model="userParams.age"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="职员账号" prop="account" v-if="!userParams.id">
            <el-input
              placeholder="请输入职员账号"
              v-model="userParams.account"
              class="form-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="职员密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请输入职员密码"
              v-model="userParams.password"
              type="password"
              class="form-input"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="职员性别" prop="sex">
            <el-radio-group v-model="userParams.gender" class="gender-group">
              <el-radio label="男" size="large">男</el-radio>
              <el-radio label="女" size="large">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="职员职位" prop="position">
            <el-select
              v-model="userParams.position"
              placeholder="请选择职员职位"
              size="large"
              class="form-select"
            >
              <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属网格" prop="suoshugw" v-if="level=='总端'">
            <el-select
              v-model="userParams.suoshugrid"
              placeholder="请选择所属网格"
              size="large"
              class="form-select"
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
        <div class="drawer-footer">
          <el-button @click="cancel" class="cancel-btn">取消</el-button>
          <el-button type="primary" @click="save" class="save-btn">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 抽屉结构:用户某一个已有的账号进行职位分配 -->
    <el-drawer v-model="drawer1" direction="rtl" size="500px">
      <template #header>
        <div class="drawer-header">
          <h3>分配角色(职位)</h3>
        </div>
      </template>
      
      <template #default>
        <el-form class="drawer-form">
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" :disabled="true" class="form-input"></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox
              @change="handleCheckAllChange"
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              class="check-all"
            >
              全选
            </el-checkbox>
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedCitiesChange"
              class="role-group"
            >
              <el-checkbox
                v-for="(role, index) in allRole"
                :key="index"
                :label="role"
                class="role-checkbox"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawer1 = false" class="cancel-btn">取消</el-button>
          <el-button type="primary" @click="confirmClick" class="save-btn">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/users'
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {GeWang_USER, GeWang_USER_ADD, GeWang_USER_DELETE, GeWang_USER_SEARCH} from '@/api/gewang/index'
import {Last_GeWang_user} from '@/api/last_gewang/index'
let useStore = useUserStore()
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
let level = useStore.level
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
  getHasUser()
})
let postinfor = reactive<any>({
  suoshugrid: ''
})
postinfor.suoshugrid = useStore.level
//获取全部已有的用户信息
const getHasUser = async () => {
  //收集当前页码
  let result = await Last_GeWang_user(postinfor.suoshugrid)
  console.log(result.data)
    userArr.value = result.data
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

// 辅助函数：获取职位标签类型
const getPositionTagType = (position: string) => {
  const typeMap: Record<string, string> = {
    '网格管理员': 'primary',
    '环卫工': 'success',
    '安保人员': 'warning'
  }
  return typeMap[position] || 'info'
}

// 辅助函数：获取工作状态标签类型
const getWorkStatusType = (work: string) => {
  const typeMap: Record<string, string> = {
    '工作中': 'success',
    '空闲中': 'info',
    '请假中': 'warning',
    '离职': 'danger'
  }
  return typeMap[work] || 'info'
}
</script>

<style scoped lang="scss">
.user-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  
  .search-card {
    margin-bottom: 20px;
    border-radius: 16px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    
    .search-form {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      
      .form-item {
        margin-bottom: 0;
        
        .search-input {
          width: 250px;
          
          :deep(.el-input__wrapper) {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            
            &:hover {
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            &.is-focus {
              box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
            }
          }
        }
        
        .search-btn, .reset-btn {
          border-radius: 8px;
          padding: 8px 20px;
          font-weight: 500;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        }
      }
    }
  }
  
  .table-card {
    border-radius: 16px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    
    .action-bar {
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
      
      .add-btn, .delete-btn {
        border-radius: 8px;
        padding: 10px 20px;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
    }
    
    .user-table {
      border-radius: 12px;
      overflow: hidden;
      
      .user-name {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .user-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
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
  
  .drawer-header {
    h3 {
      margin: 0;
      color: #2c3e50;
      font-weight: 600;
    }
  }
  
  .drawer-form {
    padding: 20px 0;
    
    .form-input, .form-select {
      :deep(.el-input__wrapper) {
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        &.is-focus {
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
      }
    }
    
    .gender-group {
      .el-radio {
        margin-right: 20px;
      }
    }
    
    .check-all {
      margin-bottom: 16px;
      font-weight: 600;
    }
    
    .role-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .role-checkbox {
        padding: 8px 12px;
        border-radius: 6px;
        background: rgba(102, 126, 234, 0.05);
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(102, 126, 234, 0.1);
        }
      }
    }
  }
  
  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .cancel-btn, .save-btn {
      border-radius: 8px;
      padding: 10px 24px;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-management {
    padding: 10px;
    
    .search-card .search-form {
      flex-direction: column;
      align-items: stretch;
      
      .form-item .search-input {
        width: 100%;
      }
    }
    
    .table-card .action-bar {
      flex-direction: column;
    }
  }
}
</style>
