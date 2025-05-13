<template>
  <el-container>
    <el-main>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>轮播图管理</span>
            <el-upload
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
            >
              <el-button type="primary">上传新图片</el-button>
            </el-upload>
          </div>
        </template>

        <el-table :data="banners" stripe style="width: 100%">
          <el-table-column prop="title" label="标题" width="150" />
          <el-table-column label="图片" width="250">
            <template #default="scope">
              <el-image
                :src="scope.row.url"
                style="width: 200px; height: 100px"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column prop="link" label="跳转链接" />
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

const banners = ref([
  {
    id: 1,
    title: '春季活动',
    url: 'https://picsum.photos/200/100',
    link: '/promotion'
  },
  {
    id: 2,
    title: '新课程上线',
    url: 'https://picsum.photos/201/100',
    link: '/courses'
  }
])

const beforeUpload = (file) => {
  // TODO: 实现图片上传逻辑
  return false
}

const handleDelete = (banner) => {
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