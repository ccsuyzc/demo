<template>
  <el-container>
    <el-main>
      <el-card>
        <template #header>
          <div class="card-header">
            <span>AI模型配置管理</span>
            <el-button type="primary" @click="saveSettings">保存配置</el-button>
          </div>
        </template>

        <el-form :model="form" label-width="120px">
          <el-form-item label="模型选择">
            <el-select v-model="form.model" placeholder="请选择模型">
              <el-option
                v-for="item in modelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="温度参数">
            <el-slider
              v-model="form.temperature"
              :min="0"
              :max="1"
              :step="0.1"
              show-input
            />
          </el-form-item>

          <el-form-item label="最大Token数">
            <el-input-number
              v-model="form.max_tokens"
              :min="100"
              :max="4000"
              :step="100"
            />
          </el-form-item>

          <el-form-item label="API密钥">
            <el-input
              v-model="form.api_key"
              type="password"
              show-password
              placeholder="请输入API密钥"
            />
          </el-form-item>

          <el-form-item label="推理端点">
            <el-input
              v-model="form.api_endpoint"
              placeholder="https://api.example.com/v1/chat/completions"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 2000,
  api_key: '',
  api_endpoint: ''
})

const modelOptions = [
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5', label: 'GPT-3.5' },
  { value: 'claude-2', label: 'Claude 2' }
]

const saveSettings = async () => {
  try {
    // 这里添加保存到后端的逻辑
    ElMessage.success('配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
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