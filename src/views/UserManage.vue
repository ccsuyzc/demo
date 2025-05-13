<template>
  <el-container>
    <el-main>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>用户权限管理</span>
            <el-button type="primary" @click="fetchUsers">刷新列表</el-button>
          </div>
        </template>

        <el-form :model="searchParams" inline class="search-form">
          <el-form-item label="用户ID" prop="id">
            <el-input v-model.number="searchParams.id" placeholder="请输入ID" style="width: 120px" />
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="searchParams.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="searchParams.phone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="searchParams.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="filteredUsers" stripe style="width: 100%">
          <el-table-column prop="username" label="用户名" width="150">
          <template #default="scope">
            <span>{{ scope.row.username }}</span>
            <el-tag v-if="scope.row.isCurrent" type="info" size="small" style="margin-left: 5px">当前用户</el-tag>
          </template>
        </el-table-column>
          <el-table-column prop="email" label="邮箱" width="200" />
          <el-table-column prop="role" label="角色" width="120">
            <template #default="scope">
              <el-tag :type="roleType(scope.row.role)">
                {{ roleText(scope.row.role) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template #default="scope">
              <el-button
                size="small"
                type="info"
                @click="handleDetail(scope.row)"
                >详情</el-button
              >
              <el-button
                v-if="isSuperAdmin"
                type="warning"
                size="small"
                @click="handleRoleChange(scope.row)"
              >
                {{ scope.row.role === 2 ? '撤销管理员' : '设为管理员' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog
        v-model="dialogVisible"
        title="用户详情"
        width="600px"
      >
        <el-tabs>
          <el-tab-pane label="基本信息">
            <el-form
              :model="currentUser"
              :rules="formRules"
              label-width="100px"
              label-position="left"
            >
          <el-form-item label="用户名">
            <el-input v-model="currentUser.username" disabled />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="currentUser.email" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="currentUser.phone" disabled />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select
              v-model="currentUser.role"
              :disabled="!isSuperAdmin"
            >
              <el-option
                v-for="item in roleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="注册时间">
            <el-date-picker
              v-model="currentUser.createTime"
              type="date"
              disabled
            />
          </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="用户行为">
            <el-descriptions :column="2" border>
          <el-descriptions-item label="头像">
            <el-avatar :src="currentUser.avatar" />
          </el-descriptions-item>
          <el-descriptions-item label="个性签名">
            {{ currentUser.signature || '暂无' }}
          </el-descriptions-item>
          <el-descriptions-item label="个人简介">
            {{ currentUser.introduction || '暂无' }}
          </el-descriptions-item>
              <el-descriptions-item label="评论数">15</el-descriptions-item>
              <el-descriptions-item label="收藏文章">8</el-descriptions-item>
              <el-descriptions-item label="最近浏览">2024-03-15 14:30</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
        </el-tabs>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            :disabled="!isSuperAdmin"
          >
            保存
          </el-button>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue'
import axios from 'axios'

const searchParams = ref({
  id: null,
  username: '',
  phone: '',
  email: ''
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    return (
      (!searchParams.value.id || user.id === searchParams.value.id) &&
      (!searchParams.value.username || user.username.includes(searchParams.value.username)) &&
      (!searchParams.value.phone || user.phone.includes(searchParams.value.phone)) &&
      (!searchParams.value.email || user.email.includes(searchParams.value.email))
    )
  })
})

const users = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 2,
    status: 1,
    phone: '13800138000',
    createTime: '2024-03-01'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    role: 1,
    status: 1,
    phone: '13900139000',
    createTime: '2024-03-02'
  }
])

const roleType = (role) => {
  return {
    'root': 'danger',
    'admin': 'success',
    'user': 'info'
  }[role] || 'info'
}

const roleText = (role) => {
  return {
    'root': '超级管理员',
    'admin': '管理员',
    'user': '普通用户'
  }[role] || '未知角色'
}

const roleOptions = [
  { value: 'user', label: '普通用户' },
  { value: 'admin', label: '管理员' },
  { value: 'root', label: '超级管理员' }
]

const isSuperAdmin = computed(() => {
  // TODO: 根据实际权限判断
  return true
})

const fetchUsers = async () => {
  try {
    const { data } = await axios.get('http://127.0.0.1:8080/api/users/all');
    users.value = data.data.map(user => ({
      id: user.ID,
      username: user.Username,
      email: user.Email,
      phone: user.Phone,
      role: user.Role,
      status: user.IsActive ? 1 : 0,
      createTime: new Date(user.CreatedAt).toLocaleDateString(),
      lastLogin: new Date(user.LastLoginTime).toLocaleString(),
      isCurrent: user.ID === 1,
      signature: user.PersonalSignature,
      introduction: user.PersonalIntroduction,
      avatar: user.AvatarURL
    }));
  } catch (error) {
    console.error('获取用户数据失败:', error);
    ElMessage.error('数据加载失败');
  } 
}

const handleStatusChange = (user) => {
  // TODO: 更新用户状态
}

const handleRoleChange = (user) => {
  user.role = user.role === 'admin' ? 'user' : 'admin'
}

const dialogVisible = ref(false)
const currentUser = ref({})
const formRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const handleDetail = (user) => {
  currentUser.value = { ...user }
  dialogVisible.value = true
}

const handleSearch = () => {
  fetchUsers()
}

const resetSearch = () => {
  searchParams.value = {
    id: null,
    username: '',
    phone: '',
    email: ''
  }
}

const handleSubmit = () => {
  if (!isSuperAdmin.value) {
    ElMessage.warning('仅管理员可修改用户信息')
    return
  }
  // TODO: 对接实际API
  ElMessage.success('用户信息已更新')
  dialogVisible.value = false
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>