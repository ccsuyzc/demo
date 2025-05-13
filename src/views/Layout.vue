<script setup>
import { useRoute, useRouter } from 'vue-router'
const currentRoute = useRoute()
const $router = useRouter()
import { onMounted } from 'vue'

onMounted(() => {
  if (!localStorage.getItem('Blogtoken') ) {
    $router.push('/login')
  }
})

</script>

<template>
  <div class="app-root">
    <el-container>
      <el-aside width="200px" class="sidebar">
        <div class="logo">Blog Admin</div>
        <el-menu
          :default-active="currentRoute.path"
          class="nav-menu"
          router
        >
          <el-menu-item
            v-for="route in $router.options.routes.find(r => r.path === '/').children.filter(r => r.meta?.showInMenu)"
            :key="route.path"
            :index="route.path"
            :exact="true"
          >
            <el-icon><component :is="route.meta.icon" /></el-icon>
            <span>{{ route.meta.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-container>
        <el-header class="header">
          <div class="title">{{ currentRoute.meta.title }}</div>
          <div class="user-avatar">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-avatar :size="32">User</el-avatar>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.app-root {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  background: #fff;
  box-shadow: 2px 0 6px rgba(0,21,41,.05);
  height: 100vh;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 0 24px;
}

.user-avatar {
  display: flex;
  align-items: center;
}

.main-content {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.logo {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 30px;
}
</style>
