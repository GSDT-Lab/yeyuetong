<template>
    <el-card style="margin: 10px 0px"> 
        <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" icon="Plus" @click="add">新增活动规划</el-button>
      <div>
        <el-table style="margin: 10px 0px" border :data="getactionArr">
          <el-table-column label="序号" type="index" align="center" width = 80px></el-table-column>
          <el-table-column label="活动名称" prop="name"></el-table-column>
          <el-table-column label="活动所在网格" prop="suoshuid" show-overflow-tooltip></el-table-column>
          <el-table-column label="活动图片" prop="image" show-overflow-tooltip>
            <template #="{ row, $index }">
          <img :src="row.image" alt="图片暂未加载" style="width: 100px; height: 100px;">
        </template>
          </el-table-column>
          <el-table-column label="活动时间" prop="time" show-overflow-tooltip></el-table-column>
          <el-table-column label="活动状态" prop="state" show-overflow-tooltip></el-table-column>        
          <el-table-column label="审批结果" prop="check" show-overflow-tooltip></el-table-column>
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
      <el-dialog :title=title v-model="show">
        <el-form>      
          <el-form-item label="活动详情">
          <div>{{ describle }}</div>
        </el-form-item>
        <el-form-item label="活动描述">
          <div>{{ describle }}</div>
        </el-form-item>
        </el-form>
      </el-dialog>
    </el-card>
    <el-dialog v-model="dialogFormVisible" title="添加活动">
    <el-form style="width: 80%;" :model = 'trademarkParams' ref="formRef">
      <el-form-item label="活动名称" label-width="100px" prop="name">
        <el-input placeholder="请输入活动名称" v-model="trademarkParams.name"></el-input>
      </el-form-item>
      <el-form-item label="活动图片" label-width="100px" prop="logoUrl">
        <!-- action是请求链接,要带api -->
        <el-upload
  class="avatar-uploader"
  action="/api/planning/action/image"
  :show-file-list="true"
  :on-success="handleAvatarSuccess"
  :before-upload = "beforeAvatarUpload"
  :headers="uploadHeaders">
  <!-- 图片区 -->
  <img
    v-if="trademarkParams.image"
    :src="trademarkParams.image"
    class="avatar"
  />
  <el-icon v-else class="avatar-uploader-icon">
  <Plus />
  </el-icon>
     </el-upload>
      </el-form-item>
      <el-form-item label="活动描述" label-width="100px" prop="describle">
        <el-input type="textarea" v-model="trademarkParams.describle"></el-input>
      </el-form-item>
      <el-form-item label="活动内容" label-width="100px" prop="content">
        <el-input type="textarea" v-model="trademarkParams.content"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" label-width="100px" prop="tmName">
        <el-date-picker
        v-model="trademarkParams.time"
        type="daterange"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        :size="size"
      />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="cancel">取消</el-button>
      <el-button @mousedown="e => e.preventDefault()" type="primary" size="default" @click="right">确定</el-button>
    </template>
  </el-dialog>
  </template>
  <script setup lang="ts">
  import { ref, watch, onBeforeMount, onMounted, reactive } from 'vue'
  //场景数值
  import { ElMessage } from 'element-plus'
  import useLayOutSettingStore from '@/store/modules/setting'
  import { Last_GeWang_action, Last_GeWang_action_send } from '@/api/last_gewang/index'
  import useUserStore from '@/store/modules/users'
let useStore = useUserStore()
  let LayOutSettingStore = useLayOutSettingStore()
  let Spu = ref<any>()
  let scene = ref<number>(0)
  //存储已有的spu数据
  let records = ref<Records>([])
  let getactionArr = ref([])
  //获取子组件示例
  let show = ref<boolean>(false)
  let Sku = ref<any>()
    const getHasgetAction = async () => {
    //收集当前页码
    let result = await Last_GeWang_action(useStore.level)
      getactionArr.value = result.data
      console.log(result)
  }
  let describle = ref('')
  let title = ref('')
  let dialogFormVisible = ref(false)
  const look=(row) => {
    show.value = true
    describle.value = row.describle
    title = row.name
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
  const uploadHeaders = { Token: useStore.token }
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发,上传文件之前可以约束文件类型与大小
  //要求:上传文件格式png|jpg|gif 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}
  const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址,添加一个新的品牌的时候带给服务器
  trademarkParams.image = response.data
  //图片上传成功,清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}
  let ids = reactive({
   id: '',
  });
const add= () => {
dialogFormVisible.value = true
}
const cancel = () => {
  dialogFormVisible.value = false
}
const right = () => {
    trademarkParams.time = trademarkParams.time.join(', ');
    console.log(trademarkParams)
    Last_GeWang_action_send(trademarkParams)
    dialogFormVisible.value = false
    LayOutSettingStore.refresh = !LayOutSettingStore.refresh
}
  onMounted(()=>{
    getHasgetAction()
  })
  
  </script>
  <style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
  