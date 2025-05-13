<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用博客后台管理系统</div>
    <div class="dashboard-cards">
      <div class="dashboard-box">当前时间：{{ new Date().toLocaleString() }}</div>
      <div class="dashboard-box">当前文章数：{{ aCount }}</div>
      <div class="dashboard-box">当前用户数：{{ userCount }}</div>
    </div>

    <div id="visitorChart" style="width: 100%; height: 400px;"></div>
    <div id="regionChart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, onUnmounted,ref} from 'vue'

const aCount = ref(100)
const userCount = ref(50)

const fetchData = async () => {
  try {
    // 获取用户总数
    const userResponse = await fetch('http://127.0.0.1:8080/api/stat/user-count')
    if (userResponse.ok) {
      const userData = await userResponse.json()
      userCount.value = userData.data
    }
    
    // 获取文章总数
    const articleResponse = await fetch('http://127.0.0.1:8080/api/stat/article-count')
    if (articleResponse.ok) {
      const articleData = await articleResponse.json()
      aCount.value = articleData.data
    }
  } catch (error) {
    console.error('数据获取失败:', error)
  }
}
let visitorChart, regionChart

onMounted(async () => {
  await fetchData()
  // 初始化访客量图表
  visitorChart = echarts.init(document.getElementById('visitorChart'))
  const visitorOption = {
    title: { text: '近7日访客量' },
    xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 80, 70, 110, 130], type: 'line' }]
  }
  visitorChart.setOption(visitorOption)

  // 初始化地域分布图表
  regionChart = echarts.init(document.getElementById('regionChart'))
  const regionOption = {
    title: { text: '用户地域分布' },
    tooltip: {},
    legend: { data: ['用户数'] },
    xAxis: { type: 'category', data: ['北京','上海','广州','深圳','成都'] },
    yAxis: { type: 'value' },
    series: [{ name: '用户数', data: [350, 280, 420, 310, 260], type: 'bar' }]
  }
  regionChart.setOption(regionOption)

  // 窗口大小变化时重绘图表
  const resizeHandler = () => {
    visitorChart.resize()
    regionChart.resize()
  }
  window.addEventListener('resize', resizeHandler)
  onUnmounted(() => window.removeEventListener('resize', resizeHandler))
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-cards {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
}

.dashboard-text {
  font-size: 24px;
  font-weight: 600;
  padding: 20px;
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
  text-align: center;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(
    to right,
    var(--el-color-primary),
    var(--el-color-danger)
  );
  transition: all 0.3s ease;
}

.dashboard-box {
  padding: 24px;
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  box-shadow: var(--el-box-shadow-light);
  font-size: 18px;
  color: var(--el-text-color-regular);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.dashboard-box:hover {
  transform: translateY(-5px);
  box-shadow: var(--el-box-shadow-dark);
}

.dashboard-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to right,
    var(--el-color-primary),
    var(--el-color-danger)
  );
}

#visitorChart,
#regionChart {
  background: var(--el-bg-color);
  border-radius: 6px;
  padding: 15px;
  box-shadow: var(--el-box-shadow-light);
}
</style>