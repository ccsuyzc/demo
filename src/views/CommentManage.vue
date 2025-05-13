<template>
  <el-container>
    <el-main>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>评论审核管理</span>
            <el-button type="primary" @click="fetchComments">刷新列表</el-button>
          </div>
        </template>

        <el-form :model="searchParams" inline>
          <el-form-item label="内容" prop="content">
            <el-input v-model="searchParams.content" placeholder="搜索评论内容" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="searchParams.status" clearable>
              <el-option label="待审核" :value="0" />
              <el-option label="已通过" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        
        <el-table :data="comments" stripe>
          <el-table-column prop="content" label="评论内容" width="400" />
          <el-table-column prop="author" label="作者" width="150" />
          <el-table-column prop="articleTitle" label="所属文章" width="200" />
          <el-table-column label="状态" width="120">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
                {{ scope.row.status === 1 ? '已通过' : '待审核' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button
                size="small"
                :type="scope.row.status === 1 ? 'warning' : 'success'"
                @click="toggleStatus(scope.row)"
              >
                {{ scope.row.status === 1 ? '撤回' : '通过' }}
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :current-page="pagination.current"
          :page-size="pagination.size"
          :total="pagination.total"
          @current-change="handlePageChange"
          layout="prev, pager, next"
          class="pagination"
        />
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

const searchParams = ref({
  content: '',
  status: null
})

const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

const comments = ref([
  {
    id: 1,
    content: '非常实用的教程',
    author: '用户A',
    articleTitle: 'Vue3实战指南',
    status: 1,
    createTime: '2024-03-15'
  },
  {
    id: 2,
    content: '请求添加更多示例',
    author: '用户B',
    articleTitle: 'TypeScript入门',
    status: 0,
    createTime: '2024-03-16'
  }
])

const fetchComments = async () => {
  // TODO: 对接后端API
}

const toggleStatus = (comment) => {
  comment.status = comment.status === 1 ? 0 : 1
  // TODO: 调用状态更新API
}

const handleDelete = async (comment) => {
  // TODO: 调用删除API
  comments.value = comments.value.filter(c => c.id !== comment.id)
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchComments()
}

const resetSearch = () => {
  searchParams.value = {
    content: '',
    status: null
  }
}

const handlePageChange = (page) => {
  pagination.value.current = page
  fetchComments()
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  justify-content: center;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>