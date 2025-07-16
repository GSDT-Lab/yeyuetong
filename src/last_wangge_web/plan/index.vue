<template>
  <div class="plan-management">
    <el-card class="plan-card" shadow="hover">
      <div v-show="woc == 0" class="plan-content">
        <div class="action-header">
          <el-button 
            type="primary" 
            size="default" 
            icon="Plus" 
            @click="add"
            class="add-plan-btn"
          >
            新增规划
          </el-button>
        </div>
        
        <el-table 
          border 
          class="plan-table" 
          :data="planArr"
          stripe
          highlight-current-row
        >
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="规划类型" align="center" width="120" prop="renwutype">
            <template #default="{ row }">
              <el-tag :type="getPlanTypeTag(row.renwutype)" size="small">
                {{ row.renwutype }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="规划详情" align="center" width="400" prop="describle" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属网格" align="center" prop="suoshuid"></el-table-column>
          <el-table-column label="具体网格" align="center" prop="gridsmall"></el-table-column>
          <el-table-column label="创建时间" align="center" prop="time"></el-table-column>
          <el-table-column label="审批情况" align="center" prop="state">
            <template #default="{ row }">
              <el-tag 
                :type="getStatusTagType(row.state)" 
                size="small"
                :class="{ 'clickable': row.state === '已驳回' }"
                @click="row.state === '已驳回' ? toClick() : null"
              >
                {{ row.state }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 规划驳回对话框 -->
    <el-dialog
      v-model="bohuiss"
      title="规划驳回"
      width="500px"
      class="reject-dialog"
    >
      <div class="reject-content">
        <span class="reject-label">驳回原因：</span>
        <span class="reject-reason">{{ optioners[randomNumber] }}</span>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="bohuiss = false" class="cancel-btn">取消</el-button>
          <el-button type="primary" @click="bohuiss = false" class="confirm-btn">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 问题处理对话框 -->
    <el-dialog 
      v-model="dialogFormVisible111" 
      title="问题处理"
      width="600px"
      class="problem-dialog"
    >
      <el-form style="width: 80%;" :model="userParams" ref="formRef" class="problem-form">
        <el-form-item label="选择人员" label-width="100px" prop="name">
          <div class="personnel-selection">
            <el-checkbox v-model="checked1" label="胡图" size="large" v-if="ae[0]" class="personnel-checkbox">
              <div class="personnel-item">
                <el-avatar :size="32" class="personnel-avatar">胡</el-avatar>
                <span>胡图</span>
              </div>
            </el-checkbox>
            <el-checkbox v-model="checked2" label="张笑天" size="large" v-if="ae[1]" class="personnel-checkbox">
              <div class="personnel-item">
                <el-avatar :size="32" class="personnel-avatar">张</el-avatar>
                <span>张笑天</span>
              </div>
            </el-checkbox>
            <el-checkbox v-model="checked3" label="燕绍淳" size="large" v-if="ae[2]" class="personnel-checkbox">
              <div class="personnel-item">
                <el-avatar :size="32" class="personnel-avatar">燕</el-avatar>
                <span>燕绍淳</span>
              </div>
            </el-checkbox>
            <el-checkbox v-model="checked4" label="潘乃荣" size="large" v-if="ae[3]" class="personnel-checkbox">
              <div class="personnel-item">
                <el-avatar :size="32" class="personnel-avatar">潘</el-avatar>
                <span>潘乃荣</span>
              </div>
            </el-checkbox>
            <el-checkbox v-model="checked5" label="罗广" size="large" v-if="ae[4]" class="personnel-checkbox">
              <div class="personnel-item">
                <el-avatar :size="32" class="personnel-avatar">罗</el-avatar>
                <span>罗广</span>
              </div>
            </el-checkbox>
            <el-checkbox v-model="checked6" label="李现岱" size="large" v-if="ae[5]" class="personnel-checkbox">
              <div class="personnel-item">
                <el-avatar :size="32" class="personnel-avatar">李</el-avatar>
                <span>李现岱</span>
              </div>
            </el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="info" size="default" @click="cancel" class="cancel-btn">取消</el-button>
          <el-button type="primary" size="default" @click="right" class="confirm-btn">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
//组合式API函数watch
import useLayOutSettingStore from '@/store/modules/setting'
import { reactive} from 'vue'
//引入获取已有属性和属性值接口的方法
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { Planning_deletegetcomplete,Planning_OK, Planning_problem, Planning_searchgetcomplete, Planning_your_complete_search } from '@/api/planning/index'
import useUserStore from '@/store/modules/users'
import {Last_GeWang_user} from '@/api/last_gewang/index'
let useStore = useUserStore()
let settingStore = useLayOutSettingStore()
let $router = useRouter()
//组件挂载完毕
  let checked1 = ref(false)
  let checked2 = ref(false)
  let checked3 = ref(false)
  let checked4 = ref(false)
  let checked5 = ref(false)
  let checked6 = ref(false)
  let ae=reactive([false,false,false,false,false,false])
  
let imglist = ref([])
let bohuiss = ref(false)
let attrArr = ref<Attr[]>([])
let woc = ref(0)
let src = ref("") 
const value = ref('')
const toClick = () => {
  bohuiss.value = true
}
const optioners = [
   '与其他夜市同质化高',
    '噪声污染大',
    '空气污染大',
   '易造成人流拥堵',
    '资金预算过高',
]
let randomNumber =  ref(Math.floor(Math.random() * 5));
const options = [
{
    value: '',
    label: '',
}
]
const options1 = [

]
let postinfor = reactive({
  suoshuid: useStore.level
})
const getHasUser = async () => {
  //收集当前页码
  let result = await Last_GeWang_user(postinfor.suoshuid);
  userArr.value = result.data;
  console.log(userArr.value)
  for (let i = 0; i < userArr.value.length; i++) {
    if (userArr.value[i].work === '空闲中') {
      ae[i]=true
      options0.value.push({
        value: userArr.value[i].name,
        label: userArr.value[i].name,
      });
    }
  }
  console.log(ae)
  options0.value.splice(0, 1);
}
//准备一个数组，将来使用存储对应组件实例
let inputArr = ref<any>([])
let title = ref('')
let id = reactive<any>({
  id: '',
})
//存储全部用户的数组
let planArr = ref<Records>([])
//定义响应式数值，控制编辑和查看模式的切换
let flag = ref<boolean>(true)
let gridData = ref([])
  let dialogTableVisible = ref(false)
  const getHasdoPlan = async () => {
  //收集当前页码
  let result = await Planning_your_complete_search(useStore.level)
  console.log(result)
    planArr.value = result.data
    console.log(result)
}
const Edit =(row)=>{
  dialogTableVisible.value = true
  title = row.planningstyle
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
  getHasUser()
  getHasdoPlan()
})

const add = () => {
 $router.push({
  name: 'gewangtoplaner'
 })
}

// 辅助函数：获取规划类型标签
const getPlanTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    '环境整治': 'success',
    '设施维护': 'primary',
    '安全管理': 'warning',
    '活动策划': 'info'
  }
  return typeMap[type] || 'info'
}

// 辅助函数：获取状态标签类型
const getStatusTagType = (state: string) => {
  const typeMap: Record<string, string> = {
    '已通过': 'success',
    '待审批': 'warning',
    '已驳回': 'danger',
    '执行中': 'primary'
  }
  return typeMap[state] || 'info'
}
</script>
<style scoped lang="scss">
.plan-management {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  
  .plan-card {
    border-radius: 16px;
    border: none;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    
    .plan-content {
      .action-header {
        margin-bottom: 20px;
        
        .add-plan-btn {
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: 500;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        }
      }
      
      .plan-table {
        border-radius: 12px;
        overflow: hidden;
      }
    }
  }
  
  .reject-dialog {
    :deep(.el-dialog) {
      border-radius: 16px;
      overflow: hidden;
      
      .el-dialog__header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        
        .el-dialog__title {
          color: white;
          font-weight: 600;
        }
      }
      
      .el-dialog__body {
        padding: 30px 20px;
        
        .reject-content {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .reject-label {
            font-weight: 600;
            color: #2c3e50;
          }
          
          .reject-reason {
            color: #e74c3c;
            font-weight: 500;
            padding: 8px 16px;
            background: rgba(231, 76, 60, 0.1);
            border-radius: 8px;
            border-left: 4px solid #e74c3c;
          }
        }
      }
    }
  }
  
  .problem-dialog {
    :deep(.el-dialog) {
      border-radius: 16px;
      overflow: hidden;
      
      .el-dialog__header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        
        .el-dialog__title {
          color: white;
          font-weight: 600;
        }
      }
      
      .el-dialog__body {
        padding: 30px 20px;
        
        .problem-form {
          .personnel-selection {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            
            .personnel-checkbox {
              padding: 12px;
              border-radius: 8px;
              background: rgba(102, 126, 234, 0.05);
              transition: all 0.3s ease;
              border: 1px solid transparent;
              
              &:hover {
                background: rgba(102, 126, 234, 0.1);
                border-color: rgba(102, 126, 234, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }
              
              .personnel-item {
                display: flex;
                align-items: center;
                gap: 12px;
                
                .personnel-avatar {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  font-weight: 600;
                }
                
                span {
                  font-weight: 500;
                  color: #2c3e50;
                }
              }
            }
          }
        }
      }
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px;
    
    .cancel-btn, .confirm-btn {
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
  .plan-management {
    padding: 10px;
    
    .plan-card .plan-content .plan-table {
      font-size: 12px;
    }
    
    .problem-dialog :deep(.el-dialog__body) .problem-form .personnel-selection {
      grid-template-columns: 1fr;
    }
  }
}
</style>
