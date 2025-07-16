<template>
  <template v-for="(item, index) in menuList" :key="item.path" >
    <template v-if="!item.children">

      <el-menu-item @click="goRoute" v-if="item.meta.index == 1" :index="item.path" collapse>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template> 
      </el-menu-item>
    </template>
    <template v-if="item.children && item.children.length == 1&&item.meta.index == 0">
      <el-menu-item @click="goRoute" :index="item.children[0].path" collapse>
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!--  子路由大于1个 -->
    <el-sub-menu :index="item.path" v-if="item.children && item.children.length>1&&item.meta.index == 1" collapse>
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>

  </template>
</template>
<script setup lang="ts">
defineProps(['menuList'])
import { onMounted,ref } from 'vue';
import { useRouter } from 'vue-router';
import { GeWang_PROBLEM_NUMBER } from '@/api/gewang';
import useUserStore from '@/store/modules/users';
let useStore = useUserStore()
let $router = useRouter();
let req = ref(true)

const goRoute = (vc:any) => {
  $router.push(vc.index);
}
const cool = async() =>{
  if(useStore.pronum){
  useStore.pronum = false
  let result = await GeWang_PROBLEM_NUMBER()
  console.log(result)
  useStore.pron1 = result.data[0]
  useStore.pron2 = result.data[1]
  useStore.pron3 = result.data[2]
  useStore.pron4 = result.data[3]
  useStore.pron5 = result.data[4]
}
}
onMounted(()=>{
  cool()
})
</script>
<script lang="ts">
export default {
  name: 'Menu'
}
</script>
<style scoped>

</style>
