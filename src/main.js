import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import router from './router'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import hljs from 'highlight.js';
// 引入mkdown展示
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css'
VMdPreview.use(githubTheme, {
    Hljs: hljs,
  });
  

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(VMdPreview);
app.mount('#app')
