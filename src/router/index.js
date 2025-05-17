import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
  {
    path: '/ai-settings',
    name: 'AIModelSettings',
    component: () => import('../views/AIModelSettings.vue'),
    meta: { 
    title: 'AI模型设置',
    icon: 'MagicStick',
    showInMenu: true
  }
  },
  {
    path: '/comment',
    name: 'CommentManage',
    component: () => import('@/views/CommentManage.vue')
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/home',
    // meta: { requiresAuth: true },
    children: [
      { path: 'home', component: Dashboard, meta: { title: '首页',showInMenu: true } },
      // { path: 'data', component: () => import('@/views/Dashboard.vue'), meta: { title: '数据看板' } },
      { path: 'article-manage', name: 'ArticleManage', component: () => import('@/views/ArticleManage.vue'), meta: { title: '文章管理',showInMenu: true } },
      {
        path: 'circle-manage',
        name: 'CircleManage',
        component: () => import('@/views/CircleManage.vue'),
        meta: { title: '圈子管理', showInMenu: true }
      },
      {
        path: '/ai-settings',
        name: 'AIModelSettings',
        component: () => import('../views/AIModelSettings.vue'),
        meta: { 
          title: 'AI模型设置',
          icon: 'MagicStick',
          showInMenu: true
        }
      },
      { path: 'user', component: () => import('@/views/UserManage.vue'), meta: { title: '用户管理', roles: ['admin'], showInMenu: true } },
      { path: 'banner', component: () => import('@/views/BannerManage.vue'), meta: { title: '轮播图管理' , showInMenu: false }},
      { path: 'question', component: () => import('@/views/QuestionManage.vue'), meta: { title: '题库管理' , showInMenu: false} },
      { path: 'course', component: () => import('@/views/CourseManage.vue'), meta: { title: '课程管理' , showInMenu: false} },
      {
        path: 'category',
        component: () => import('@/views/CategoryManage.vue'),
        meta: { title: '分类管理', icon: 'folder-opened', showInMenu: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   if (!token && to.path !== '/login') {
//     next('/login')
//   } else {
    next()
//   }
})

export default router