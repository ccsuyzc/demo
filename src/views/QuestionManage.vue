<template>
  <el-container>
    <el-main>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>题库管理</span>
            <el-upload
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <el-button type="primary">上传题目</el-button>
            </el-upload>
          </div>
        </template>

        <el-table :data="questions" stripe style="width: 100%">
          <el-table-column prop="title" label="题目名称" width="200" />
          <el-table-column prop="type" label="题型" width="120">
            <template #default="scope">
              <el-tag>{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="difficulty" label="难度" width="120">
            <template #default="scope">
              <el-rate
                v-model="scope.row.difficulty"
                disabled
                :max="3"
                :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

const questions = ref([
  {
    id: 1,
    title: 'Vue3响应式原理',
    type: '单选题',
    difficulty: 2
  },
  {
    id: 2,
    title: 'Pinia状态管理',
    type: '多选题',
    difficulty: 1
  }
])

const beforeUpload = (file) => {
  // TODO: 实现题目上传逻辑
  return false
}

const handleDelete = (question) => {
  // TODO: 实现删除逻辑
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>