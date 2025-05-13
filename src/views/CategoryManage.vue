<template>
  <el-container>
    <el-main>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>文章分类管理</span>
            <el-button type="primary" @click="handleAdd">新增分类</el-button>
          </div>
        </template>

        <el-table :data="categories" stripe style="width: 100%">
          <el-table-column prop="name" label="分类名称" width="200" />
          <el-table-column prop="slug" label="标识符" width="150" />
          <el-table-column prop="description" label="分类描述" />
          <el-table-column prop="articleCount" label="文章数量" width="120" />
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
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

      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
        <el-form :model="currentCategory" label-width="80px">
          <el-form-item label="分类名称">
            <el-input v-model="currentCategory.name" />
          </el-form-item>
          <el-form-item label="标识符">
            <el-input v-model="currentCategory.slug" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])

const fetchCategories = async () => {
  try {
    const categoriesRes = await axios.get('http://localhost:8080/api/categories')
    
    const categoriesWithCount = await Promise.all(
      categoriesRes.data.map(async item => {
        try {
          const countRes = await axios.get(`http://localhost:8080/api/categories/${item.ID}/articlecount`)
          return {
            id: item.ID,
            name: item.Name,
            slug: item.Tap,
            description: item.Description,
            articleCount: countRes.data.data || 0
          }
        } catch (e) {
          return {
            id: item.ID,
            name: item.Name,
            slug: item.Tap,
            description: item.Description,
            articleCount: 0
          }
        }
      })
    )

    categories.value = categoriesWithCount
  } catch (error) {
    ElMessage.error('获取分类失败')
  }
}

onMounted(() => {
  fetchCategories()
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const currentCategory = ref({
  id: null,
  name: '',
  slug: ''
})

const handleAdd = () => {
  currentCategory.value = { id: null, name: '', slug: '' }
  dialogTitle.value = '新增分类'
  dialogVisible.value = true
}

const handleEdit = (category) => {
  currentCategory.value = { ...category }
  dialogTitle.value = '编辑分类'
  dialogVisible.value = true
}

const submitForm = async () => {
  try {
    const payload = {
      ID: currentCategory.value.id,
      Name: currentCategory.value.name,
      Tap: currentCategory.value.slug,
      Description: currentCategory.value.description
    };

    if (currentCategory.value.id) {
      await axios.put(`http://localhost:8080/api/categories/${currentCategory.value.id}`, payload);
    } else {
      await axios.post('http://localhost:8080/api/categories', payload);
    }

    await fetchCategories();
    ElMessage.success('操作成功');
  } catch (error) {
    ElMessage.error('操作失败: ' + error.message);
  } finally {
    dialogVisible.value = false;
  }
}

const handleDelete = async (category) => {
  try {
    const countRes = await axios.get(`http://localhost:8080/api/categories/${category.id}/articlecount`);
    if (countRes.data.data > 0) {
      ElMessage.error('该分类下存在文章，禁止删除');
      return;
    }

    await ElMessageBox.confirm('确认删除该分类？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await axios.delete(`http://localhost:8080/api/categories/${category.id}`);
    await fetchCategories();
    ElMessage.success('删除成功');
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败: ' + (error.response?.data?.message || error.message));
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>