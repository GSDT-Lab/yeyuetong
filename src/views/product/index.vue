<template>
  <div class="product-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">产品中心</h1>
      <p class="page-subtitle">发现我们的优质产品和服务</p>
    </div>
    
    <!-- 产品分类 -->
    <div class="category-tabs">
      <el-tabs v-model="activeCategory" class="custom-tabs">
        <el-tab-pane label="全部产品" name="all">
          <div class="products-grid">
            <div class="product-card" v-for="product in filteredProducts" :key="product.id" @click="viewProduct(product)">
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
                <div class="product-overlay">
                  <el-button type="primary" size="small" class="view-btn">查看详情</el-button>
                </div>
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-meta">
                  <span class="product-price">¥{{ product.price }}</span>
                  <span class="product-category">{{ product.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="网格管理" name="grid">
          <div class="products-grid">
            <div class="product-card" v-for="product in gridProducts" :key="product.id" @click="viewProduct(product)">
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
                <div class="product-overlay">
                  <el-button type="primary" size="small" class="view-btn">查看详情</el-button>
                </div>
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-meta">
                  <span class="product-price">¥{{ product.price }}</span>
                  <span class="product-category">{{ product.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据分析" name="analytics">
          <div class="products-grid">
            <div class="product-card" v-for="product in analyticsProducts" :key="product.id" @click="viewProduct(product)">
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
                <div class="product-overlay">
                  <el-button type="primary" size="small" class="view-btn">查看详情</el-button>
                </div>
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-meta">
                  <span class="product-price">¥{{ product.price }}</span>
                  <span class="product-category">{{ product.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 快速操作 -->
    <div class="quick-actions">
      <el-card class="action-card">
        <template #header>
          <div class="card-header">
            <i class="el-icon-star-on"></i>
            <span>热门推荐</span>
          </div>
        </template>
        <div class="featured-products">
          <div class="featured-item" v-for="item in featuredProducts" :key="item.id" @click="viewProduct(item)">
            <img :src="item.image" :alt="item.name">
            <div class="featured-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeCategory = ref('all')

// 产品数据
const products = [
  {
    id: 1,
    name: '网格管理系统',
    description: '智能化的网格管理解决方案，提供全面的数据分析和可视化功能',
    price: '2999',
    category: '网格管理',
    image: '/public/img/123456.png'
  },
  {
    id: 2,
    name: '数据分析平台',
    description: '强大的数据分析工具，支持多维度数据挖掘和智能报表生成',
    price: '1999',
    category: '数据分析',
    image: '/public/img/898.png'
  },
  {
    id: 3,
    name: '地图可视化系统',
    description: '基于地理信息的数据可视化平台，支持多种地图展示方式',
    price: '3999',
    category: '网格管理',
    image: '/public/img/666.png'
  },
  {
    id: 4,
    name: '实时监控系统',
    description: '24小时实时监控和数据采集，确保系统稳定运行',
    price: '4999',
    category: '数据分析',
    image: '/public/img/111.jpg'
  },
  {
    id: 5,
    name: '智能预警系统',
    description: '基于AI的智能预警机制，提前发现潜在问题和风险',
    price: '5999',
    category: '网格管理',
    image: '/public/img/222.jpg'
  },
  {
    id: 6,
    name: '移动端应用',
    description: '支持移动端访问的管理应用，随时随地处理业务',
    price: '999',
    category: '数据分析',
    image: '/public/img/22333.png'
  }
]

// 计算属性
const filteredProducts = computed(() => {
  if (activeCategory.value === 'all') {
    return products
  }
  return products.filter(product => {
    if (activeCategory.value === 'grid') {
      return product.category === '网格管理'
    }
    if (activeCategory.value === 'analytics') {
      return product.category === '数据分析'
    }
    return true
  })
})

const gridProducts = computed(() => products.filter(p => p.category === '网格管理'))
const analyticsProducts = computed(() => products.filter(p => p.category === '数据分析'))
const featuredProducts = computed(() => products.slice(0, 3))

const viewProduct = (product: any) => {
  console.log('查看产品:', product.name)
  // 这里可以跳转到产品详情页
}
</script>

<style lang="scss" scoped>
.product-container {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeInUp 0.8s ease;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.category-tabs {
  margin-bottom: 40px;
  
  :deep(.el-tabs__header) {
    margin-bottom: 30px;
  }
  
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  
  :deep(.el-tabs__item) {
    font-size: 16px;
    font-weight: 500;
    color: #666;
    padding: 0 30px;
    height: 50px;
    line-height: 50px;
    border-radius: 25px;
    margin-right: 10px;
    transition: all 0.3s ease;
    
    &:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.1);
    }
    
    &.is-active {
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
  }
  
  :deep(.el-tabs__active-bar) {
    display: none;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  animation: fadeInUp 0.8s ease 0.2s both;
}

.product-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    
    .product-overlay {
      opacity: 1;
    }
  }
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .product-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(102, 126, 234, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .view-btn {
    background: white;
    color: #667eea;
    border: none;
    font-weight: 600;
    
    &:hover {
      background: #f0f0f0;
    }
  }
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.product-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.product-category {
  font-size: 12px;
  color: #999;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.quick-actions {
  margin-top: 40px;
}

.action-card {
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  :deep(.el-card__header) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px 25px;
  }
  
  :deep(.el-card__body) {
    padding: 25px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  
  i {
    color: #667eea;
    font-size: 20px;
  }
}

.featured-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.featured-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
    transform: translateX(5px);
  }
  
  img {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    object-fit: cover;
  }
}

.featured-info {
  flex: 1;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #333;
  }
  
  p {
    font-size: 12px;
    color: #666;
    margin: 0;
    line-height: 1.4;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .product-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .featured-products {
    grid-template-columns: 1fr;
  }
  
  :deep(.el-tabs__item) {
    padding: 0 20px;
    font-size: 14px;
  }
}
</style>
