<template>
  <el-container>
    <el-main>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>课程管理</span>
            <el-upload
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <el-button type="primary">上传课程</el-button>
            </el-upload>
          </div>
        </template>

        <el-table :data="courses" stripe style="width: 100%">
          <el-table-column prop="title" label="课程名称" width="200" />
          <el-table-column label="封面" width="180">
            <template #default="scope">
              <el-image
                :src="scope.row.cover"
                style="width: 120px; height: 80px"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="120">
            <template #default="scope">
              <span>¥{{ scope.row.price }}</span>
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
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
                >下架</el-button
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

const courses = ref([
  {
    id: 1,
    title: 'Vue3实战开发',
    cover: 'https://picsum.photos/120/80',
    price: 99,
    status: 1
  },
  {
    id: 2,
    title: 'Pinia状态管理',
    cover: 'https://picsum.photos/121/80',
    price: 49,
    status: 0
  }
])

const beforeUpload = (file) => {
  // TODO: 实现课程上传逻辑
  return false
}

const handleStatusChange = (course) => {
  // TODO: 更新课程状态
}

const handleDelete = (course) => {
  // TODO: 实现下架逻辑
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>