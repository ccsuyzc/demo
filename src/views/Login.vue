<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2>后台管理系统登录</h2>
      <el-form :model="form" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号"
            prefix-icon="i-ep-user"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="i-ep-lock"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          @click="handleLogin"
          :loading="loading"
          style="width: 100%"
        >
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const loading = ref(false)
const router = useRouter()

import axios from 'axios';
import { ElMessage } from 'element-plus';

const handleLogin = async () => {
  try {
    loading.value = true;
    const response = await axios.post('http://localhost:8080/api/login', {
      username: form.value.username,
      password: form.value.password
    });

    if (response.data.code === 200) {
      localStorage.setItem('Blogtoken', response.data.token);
      localStorage.setItem('BloguserInfo', JSON.stringify(response.data.data));
      ElMessage.success(response.data.message);
      router.push('/');
    } else {
      ElMessage.error(response.data.message || '登录失败');
    }
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '网络请求失败');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}
.login-box {
  width: 400px;
  padding: 30px;
}
h2 {
  text-align: center;
  margin-bottom: 30px;
}
</style>