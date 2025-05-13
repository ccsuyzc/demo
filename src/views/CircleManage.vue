<template>
  <el-container>
    <el-main>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>圈子管理</span>
            <el-button type="primary" @click="showCreateDialog">新建圈子</el-button>
          </div>
        </template>

        <el-form :model="searchParams" inline class="search-form">
          <el-form-item label="圈子名称" prop="name">
            <el-input v-model="searchParams.name" placeholder="输入圈子名称" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="searchParams.status" placeholder="全部状态" clearable>
              <el-option label="正常" value="active" />
              <el-option label="已封禁" value="banned" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="circles" stripe style="width: 100%">
          <el-table-column label="封面" width="120">
            <template #default="{ row }">
              <el-image 
                :src="row.cover" 
                fit="cover" 
                style="width: 80px; height: 80px"
                :preview-src-list="[row.cover]"
              />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="圈子名称" width="150" />
          <el-table-column prop="description" label="简介" width="300" />
          <el-table-column prop="founder" label="创始人" width="120" />
          <el-table-column prop="memberCount" label="成员数" width="100" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                {{ row.status === 'active' ? '正常' : '已封禁' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <el-button
                size="small"
                @click="showDetail(row)"
              >详情</el-button>
              <el-button
                :type="row.status === 'active' ? 'danger' : 'success'"
                size="small"
                @click="toggleStatus(row)"
              >{{ row.status === 'active' ? '封禁' : '解封' }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog v-model="createDialogVisible" title="新建圈子" width="500px">
          <el-form :model="newCircle" label-width="80px">
            <el-form-item label="圈子名称">
              <el-input v-model="newCircle.name" />
            </el-form-item>
            <el-form-item label="简介">
              <el-input v-model="newCircle.description" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="封面">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleUpload"
                :disabled="uploadLoading"
              >
                <el-icon>
                  <upload-filled v-if="!uploadLoading" />
                  <el-icon-loading v-else />
                </el-icon>
              </el-upload>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button @click="createDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="createCircle">确认创建</el-button>
          </template>
        </el-dialog>

<el-dialog v-model="detailDialogVisible" title="圈子详情" width="600px" @open="loadDetailFromStorage">
  <el-descriptions :column="1" border>
    <el-descriptions-item label="圈子名称">{{ currentCircleDetail.name }}</el-descriptions-item>
    <el-descriptions-item label="简介">{{ currentCircleDetail.description }}</el-descriptions-item>
    <el-descriptions-item label="创始人">{{ currentCircleDetail.founder }}</el-descriptions-item>
    <el-descriptions-item label="成员数">{{ currentCircleDetail.memberCount }}</el-descriptions-item>
    <el-descriptions-item label="状态">
      <el-tag :type="currentCircleDetail.status === 'active' ? 'success' : 'danger'">
        {{ currentCircleDetail.status === 'active' ? '正常' : '已封禁' }}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="封面">
      <el-image 
        :src="currentCircleDetail.cover"
        style="width: 200px; height: 200px"
        fit="cover"
      />
    </el-descriptions-item>
  </el-descriptions>
</el-dialog>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const circles = ref([])
const searchParams = ref({
  name: '',
  status: ''
})

const createDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentCircleDetail = ref({})
const newCircle = ref({
  name: '',
  description: '',
  avatar: ''
})

const fileList = ref([])
const uploadLoading = ref(false)

// 图片上传处理方法
const handleUpload = async (file) => {
    
  try {
    uploadLoading.value = true
    const formData = new FormData()
    formData.append('image', file.raw)
    
    const response = await axios.post('http://127.0.0.1:8080/api/upload-image', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('Blogtoken')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    
    newCircle.value.avatar = response.data.url
    ElMessage.success('图片上传成功')
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '图片上传失败')
  } finally {
    uploadLoading.value = false
  }
}

// 创建圈子方法
const createCircle = async () => {
    console.log("触发了创建圈子方法");


    const userInfo = JSON.parse(localStorage.getItem('BloguserInfo'))
    
    const payload = {
      name: newCircle.value.name,
      description: newCircle.value.description,
      avatar: newCircle.value.avatar,
      creator_id: userInfo.ID
    }

    const response = await axios.post('http://127.0.0.1:8080/api/groups', payload, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('Blogtoken')}`
      }
    })

    if (response.data.code === 200) {
      ElMessage.success('圈子创建成功')
      createDialogVisible.value = false
      fetchCircles()
    }else {
      ElMessage.error('操作失败：' + (response.data.message || '未知错误'))
    }
}

// 获取圈子列表方法
const fetchCircles = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8080/api/groups', { params: searchParams.value })
    circles.value = response.data.groups.map(group => ({
  ...group,
  name: group.Name,
  description: group.Description,
  cover: "http://127.0.0.1:8080/api"+group.AvatarURL,
  founder: group.Creator.Username,
  memberCount: group.MemberCount,
  status: group.IsLocked ? 'banned' : 'active'
}))
  } catch (error) {
    ElMessage.error('获取圈子列表失败：' + error.message)
  }
}

const showCreateDialog = () => {
  createDialogVisible.value = true
}

// 显示详情弹窗
const showDetail = (circle) => {
  sessionStorage.setItem('currentCircle', JSON.stringify({
    data: circle,
    timestamp: new Date().getTime()
  }))
  detailDialogVisible.value = true
}

// 从sessionStorage加载圈子详情
const loadDetailFromStorage = () => {
  const storedData = sessionStorage.getItem('currentCircle')
  if (!storedData) return

  const { data, timestamp } = JSON.parse(storedData)
  const FIVE_MINUTES = 5 * 60 * 1000
  
  if (Date.now() - timestamp < FIVE_MINUTES) {
    currentCircleDetail.value = data
  } else {
    fetchCircleDetail(data.id)
  }
}

// 获取圈子详情
const fetchCircleDetail = async (id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8080/api/groups/${id}`)
    currentCircleDetail.value = response.data.group
    sessionStorage.setItem('currentCircle', JSON.stringify({
      data: response.data.group,
      timestamp: new Date().getTime()
    }))
  } catch (error) {
    ElMessage.error('获取详情失败：' + error.message)
  }
}



const toggleStatus = async (circle) => {
  try {
    const newStatus = circle.status === 'active' ? 'banned' : 'active'
    await axios.patch(`/api/circles/${circle.id}/status`, { status: newStatus })
    ElMessage.success('操作成功')
    fetchCircles()
  } catch (error) {
    ElMessage.error('操作失败：' + error.message)
  }
}

const handleSearch = () => {
  fetchCircles()
}

const resetSearch = () => {
  searchParams.value = { name: '', status: '' }
  fetchCircles()
}

onMounted(() => {
  fetchCircles()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>