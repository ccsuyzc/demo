<template>
  <el-container>
    <el-main>
      <el-card>
        <el-tabs v-model="activeTab">
          <el-tab-pane label="待审核" name="pending" />
          <el-tab-pane label="已发布" name="published" />
        </el-tabs>
        <template #header>
          <div class="card-header">
            <span>文章审核管理</span>
            <el-button type="primary" @click="fetchArticles">刷新列表</el-button>
          </div>
        </template>

        <el-form :model="searchParams" inline class="search-form">
          <el-form-item label="作者ID" prop="authorId">
            <el-input v-model.number="searchParams.authorId" placeholder="作者ID" style="width: 120px" />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="searchParams.title" placeholder="输入标题" />
          </el-form-item>
          <el-form-item label="分类" prop="category">
            <el-select v-model="searchParams.category" placeholder="选择分类" clearable>
              <el-option label="技术" value="tech" />
              <el-option label="生活" value="life" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布日期">
            <el-date-picker
              v-model="searchParams.dateRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="filteredArticles" stripe style="width: 100%" v-show="activeTab == 'pending'">
          <el-table-column prop="title" label="标题" width="200" />
          <el-table-column prop="author" label="作者" width="120" />
          <el-table-column label="发布状态" width="120">
            <template #default="scope">
              <el-tag type="success" v-if="activeTab === 'published'">已发布</el-tag>
              <el-tag :type="statusType(scope.row.status)" v-else>
                {{ statusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="180">
            <template #default="scope">
              {{ new Date(scope.row.createTime).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template #default="scope">
              <el-button
                size="small"
                @click="handlePreview(scope.row)"
                >预览</el-button
              >
              <el-button
                type="info"
                size="small"
                @click="showComments(scope.row)"
                >查看评论</el-button
              >
              <template v-if="activeTab === 'pending'">
                <el-button
                  type="success"
                  size="small"
                  @click="handleApprove(scope.row)"
                  >通过</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  @click="handleReject(scope.row)"
                  >驳回</el-button
                >
              </template>
              <template v-else>
                <el-button
                  type="warning"
                  size="small"
                  @click="handleUnpublish(scope.row)"
                  v-if="scope.row.status === 'published'"
                  >下架</el-button
                >
                <el-button
                  type="success"
                  size="small"
                  @click="handleShelving(scope.row)"
                  v-else
                  >上架</el-button
                >
              </template>
              
            </template>
          </el-table-column>
        </el-table>

        <el-table :data="publishedArticles" stripe style="width: 100%" v-show="activeTab == 'published'">
          <el-table-column prop="title" label="标题" width="200" />
          <el-table-column prop="author" label="作者" width="120" />
          <el-table-column label="发布状态" width="120">
            <template #default="scope">
              <el-tag type="success" v-if="activeTab === 'published'">已发布</el-tag>
              <el-tag :type="statusType(scope.row.status)" v-else>
                {{ statusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="180">
            <template #default="scope">
              {{ new Date(scope.row.createTime).toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template #default="scope">
              <el-button
                size="small"
                @click="handlePreview(scope.row)"
                >预览</el-button
              >
              <el-button
                type="info"
                size="small"
                @click="showComments(scope.row)"
                >查看评论</el-button
              >
              <template v-if="activeTab === 'pending'">
                <el-button
                  type="success"
                  size="small"
                  @click="handleApprove(scope.row)"
                  >通过</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  @click="handleReject(scope.row)"
                  >驳回</el-button
                >
              </template>
              <template v-else>
                <el-button
                  type="warning"
                  size="small"
                  @click="handleUnpublish(scope.row)"
                  v-if="activeTab === 'published'"
                  >下架</el-button
                >
              </template>
              
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog
        v-model="previewVisible"
        title="文章预览"
        width="60%"
        top="5vh"
      >
        <!-- <div class="markdown-preview" v-html="compiledMarkdown" /> -->
        <v-md-preview :text="compiledMarkdown"></v-md-preview>
      </el-dialog>

      <el-dialog
        v-model="commentDialogVisible"
        title="文章评论"
        width="60%"
        top="5vh"
      >
        <el-table :data="currentArticleComments" stripe>
          <el-table-column prop="content" label="评论内容" width="300" />
          <el-table-column prop="userName" label="评论者" width="100" />
          <el-table-column prop="createTime" label="时间" width="180" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'warning'">
                {{ row.status === 1 ? '已审核' : '待审核' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button
                size="small"
                :type="row.status === 1 ? 'warning' : 'success'"
                @click="toggleCommentStatus(row)"
              >
                {{ row.status === 1 ? '取消审核' : '通过审核' }}
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteComment(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog
        v-model="rejectDialogVisible"
        title="填写驳回原因"
        width="30%"
      >
        <el-form :model="rejectReason" label-width="80px">
          <el-form-item label="驳回原因">
            <el-input
              v-model="rejectReason"
              type="textarea"
              :rows="4"
              placeholder="请输入驳回原因"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitReject">确定</el-button>
            <el-button @click="rejectDialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed,watch } from 'vue'
import { ElMessage } from 'element-plus'
import markdownIt from 'markdown-it'
import hljs from 'highlight.js'
// import { useRoute } from 'vue-router'
import axios from 'axios'
import 'highlight.js/styles/monokai-sublime.css'

const previewVisible = ref(false)
const previewContent = ref('')

const searchParams = ref({
  authorId: null,
  title: '',
  category: '',
  dateRange: []
})

const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const matchesAuthor = !searchParams.value.authorId || article.authorId === searchParams.value.authorId
    const matchesTitle = !searchParams.value.title || article.title.includes(searchParams.value.title)
    const matchesCategory = !searchParams.value.category || article.category === searchParams.value.category
    const matchesDate = !searchParams.value.dateRange?.length || 
      (new Date(article.createTime) >= new Date(searchParams.value.dateRange[0]) &&
       new Date(article.createTime) <= new Date(searchParams.value.dateRange[1]))
    
    return matchesAuthor && matchesTitle && matchesCategory && matchesDate
  })
})

const articles = ref([])
const publishedArticles = ref([])

 



const statusText = (status) => {
  const texts = { 
    'pending': '待审核',
    'approved': '已通过',
    'rejected': '已驳回'
  }
  return texts[status] || ''
}

const statusType = (status) => {
  const types = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return types[status] || ''
}

const comments = ref([])



const toggleCommentStatus = (comment) => {
  comment.status = comment.status === 1 ? 0 : 1
  // TODO: 调用API更新状态
}

const deleteComment = async (comment) => {
  // TODO: 调用删除API
  comments.value = comments.value.filter(c => c.id !== comment.id)
}

const activeTab = ref('pending')

watch(activeTab, (newVal) => {
  if(newVal === 'pending') fetchArticles()
  if(newVal === 'published') fetchPublishedArticles()
})

const fetchArticles = async () => {
    // const apiUrl = activeTab.value === 'pending' 
    //   ? '/api/articles/pending'
    //   : '/api/articles/published'
    const response = await axios.get(`http://127.0.0.1:8080/api/articles/pending`)
    console.log("this data1",response)
    const { data } = response.data
    articles.value = data.map(item => ({ 
      id: item.ID,
      author: item.UserName,
      createTime: new Date(item.CreatedAt).toLocaleString(),
      title: item.Title,
      status: item.AuditStatus,
      Content: item.Content
    }))
}

const fetchPublishedArticles = async () => {
  const response = await axios.get(`http://127.0.0.1:8080/api/articles/publishedall`)
  const { data } = response.data
  publishedArticles.value = data.map(item => ({ 
    id: item.ID,
    author: item.UserName,
    createTime: new Date(item.CreatedAt).toLocaleString(),
    title: item.Title,
    status: item.AuditStatus,
    Content: item.Content
  }))
}

const compiledMarkdown = ref('')

onMounted(() => {
  const md = new markdownIt({
  highlight: function(code, lang) {
    return hljs.highlightAuto(code).value
  },
  html: true
})

  fetchArticles()
  fetchPublishedArticles()
})

const handlePreview = (article) => {
  // compiledMarkdown.value = md.render(article.Content)
  compiledMarkdown.value = article.Content
  previewVisible.value = true
}

const handleShelving = async (article) => {
  try {
    await axios.get(`http://127.0.0.1:8080/api/articles/shelving/${article.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    ElMessage.success('上架成功')
    await fetchPublishedArticles()
  } catch (error) {
    ElMessage.error('操作失败：' + (error.response?.data?.error || error.message))
  }
}

const handleUnpublish = async (article) => {
  try {
    await axios.get(`http://127.0.0.1:8080/api/articles/delisting/${article.id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    ElMessage.success('下架成功')
    await fetchPublishedArticles()
  } catch (error) {
    ElMessage.error('操作失败：' + (error.response?.data?.error || error.message))
  }
}
const handleApprove = async (article) => {
  try {
    await axios.put(`http://127.0.0.1:8080/api/articles/publish-status/${article.id}`)
    ElMessage.success('审核通过成功')
    await fetchArticles()
  } catch (error) {
    ElMessage.error('审核失败：' + error.message)
  }
}

const handleSearch = () => {
  fetchArticles()
  fetchPublishedArticles()
}

const resetSearch = () => {
  searchParams.value = {
    authorId: null,
    title: '',
    category: '',
    dateRange: []
  }
}

const rejectDialogVisible = ref(false)
const currentArticle = ref(null)
const rejectReason = ref('')

const handleReject = (article) => {
  currentArticle.value = article
  rejectDialogVisible.value = true
}

const submitReject = async () => {
  try {
    await axios.post('http://127.0.0.1:8080/api/articles/reject', {
      article_id: currentArticle.value.id,
      user_id: 1,
      reject_reason: rejectReason.value
    })
    ElMessage.success('驳回成功')
    rejectDialogVisible.value = false
    rejectReason.value = ''
    await fetchArticles()
  } catch (error) {
    ElMessage.error('驳回失败：' + error.message)
  }
}

const commentDialogVisible = ref(false)
const currentArticleId = ref(null)
const currentArticleComments = ref([])
const publishedArticleComments = ref([])

const showComments = (article) => {
  currentArticleId.value = article.id
  fetchComments(article.id)
  commentDialogVisible.value = true
}

const fetchComments = async (articleId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8080/api/articles/${articleId}/comments`)
    currentArticleComments.value = response.data.data.map(comment => ({
      id: comment.ID,
      content: comment.Content,
      createTime: new Date(comment.CommentTime).toLocaleString(),
      status: comment.IsApproved ? 1 : 0,
      userName: comment.UserName,
      parentUser: comment.ParentUserName || ''
    }))
  } catch (error) {
    ElMessage.error('获取评论失败：' + error.message)
  }
}
</script>
<style  scoped>
.card-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>



.markdown-preview {
  padding: 20px;
  pre {
    background: #2d2d2d;
    padding: 1em;
    border-radius: 5px;
    code {
      color: #f8f8f2;
    }
  }
  code:not(pre code) {
    background: #f3f3f3;
    padding: 0.2em 0.4em;
    border-radius: 3px;
  }
}



