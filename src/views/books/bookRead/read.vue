<template>
  <div class="book-reader-container">
    <!-- 左侧目录 -->
    <div class="catalog-sidebar" :class="{ collapsed: !showCatalog }">
      <div class="catalog-header">
        <h3>目录</h3>
        <el-button type="text" icon="el-icon-close" @click="toggleCatalog" />
      </div>
      <div class="catalog-content">
        <el-tree
          :data="catalogData"
          :props="defaultProps"
          highlight-current
          default-expand-all
          @node-click="handleNodeClick"
        />
      </div>
    </div>

    <!-- 主阅读区域 -->
    <div class="reader-main">
      <!-- 顶部工具栏 -->
      <div class="reader-toolbar">
        <el-button
          type="text"
          icon="el-icon-menu"
          @click="toggleCatalog"
        >
          目录
        </el-button>
        <div class="title-container">
          <span class="book-title">{{ bookTitle }}</span>
          <span class="chapter-title">{{ currentChapter }}</span>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="reader-content">
        <div
          ref="pageContent"
          class="page-content"
          v-html="currentPageContent"
        />
      </div>

      <!-- 底部页码导航 -->
      <div class="page-navigation">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            上一页
          </el-button>
          <el-button type="primary" plain>
            {{ currentPage }} / {{ totalPages }}
          </el-button>
          <el-button
            type="primary"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
            下一页<i class="el-icon-arrow-right el-icon--right" />
          </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
import { processTextFile } from '@/utils/textProcessor'

export default {
  name: 'BookReader',
  data() {
    return {
      showCatalog: true,
      bookTitle: '三体',
      currentPage: 1,
      totalPages: 1,
      currentPageContent: '',
      catalogData: [],
      chapterContents: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentChapter: '',
      pages: [],
      pageHeight: 0,
      contentRef: null
    }
  },
  async created() {
    await this.loadBookContent()
  },
  mounted() {
    this.$nextTick(() => {
      this.contentRef = this.$refs.pageContent
      this.initPages()
    })
  },
  methods: {
    async loadBookContent() {
      try {
        // 从assets加载txt文件
        const response = await fetch('/books/三体.txt')
        if (!response.ok) {
          throw new Error('无法加载文件')
        }
        const text = await response.text()
        // 处理文本内容
        this.chapterContents = processTextFile(text)
        // 生成目录数据
        this.catalogData = Object.keys(this.chapterContents).map(chapter => ({
          label: chapter
        }))

        // 设置初始章节
        if (this.catalogData.length > 0) {
          this.currentChapter = this.catalogData[0].label
          this.$nextTick(() => {
            this.initPages()
          })
        }
      } catch (error) {
        console.error('加载文件失败:', error)
        this.$message.error('加载文件失败')
      }
    },
    toggleCatalog() {
      this.showCatalog = !this.showCatalog
    },
    handleNodeClick(data) {
      this.currentChapter = data.label
      this.currentPage = 1
      this.$nextTick(() => {
        this.initPages()
      })
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.currentPageContent = this.pages[this.currentPage - 1]
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.currentPageContent = this.pages[this.currentPage - 1]
      }
    },
    initPages() {
      this.pageHeight = this.contentRef.clientHeight
      const tempDiv = document.createElement('div')
      tempDiv.style.cssText = window.getComputedStyle(this.contentRef).cssText
      tempDiv.style.position = 'absolute'
      tempDiv.style.visibility = 'hidden'
      document.body.appendChild(tempDiv)

      const content = this.chapterContents[this.currentChapter]
      const paragraphs = content.split('<br />')
      let currentPage = ''
      this.pages = []

      for (const paragraph of paragraphs) {
        const testContent = currentPage + paragraph + '<br />'
        tempDiv.innerHTML = testContent
        const newHeight = tempDiv.offsetHeight

        if (newHeight > this.pageHeight && currentPage) {
          this.pages.push(currentPage)
          currentPage = paragraph + '<br />'
        } else {
          currentPage = testContent
        }
      }

      // 添加最后一页
      if (currentPage) {
        this.pages.push(currentPage)
      }

      document.body.removeChild(tempDiv)
      this.totalPages = this.pages.length
      this.currentPageContent = this.pages[this.currentPage - 1]
    },
    loadPageContent() {
      this.currentPageContent = this.pages[this.currentPage - 1]
    }
  }
}
</script>

<style lang="scss" scoped>
.book-reader-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;

  .catalog-sidebar {
    width: 280px;
    background: #fff;
    border-right: 1px solid #e6e6e6;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;

    &.collapsed {
      width: 0;
      overflow: hidden;
    }

    .catalog-header {
      padding: 16px;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 16px;
        color: #303133;
      }
    }

    .catalog-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px;

      :deep(.el-tree-node__content) {
        height: 32px;
      }
    }
  }

  .reader-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .reader-toolbar {
      padding: 12px 24px;
      background: #fff;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
      gap: 16px;

      .title-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .book-title {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
        }

        .chapter-title {
          font-size: 20px;
          font-weight: bold;
          color: #303133;
        }
      }
    }

    .reader-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;

      .page-content {
        height: 100%;
        width: 800px;
        max-width: min(800px, 90%);
        margin: 0 auto;
        background: #fff;
        padding: 40px 60px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        font-size: 16px;
        line-height: 2;
        color: #333;
        text-align: justify;
        overflow: hidden;
      }
    }

    .page-navigation {
      padding: 16px;
      background: #fff;
      border-top: 1px solid #e6e6e6;
      display: flex;
      justify-content: center;

      .el-button-group {
        .el-button {
          padding: 10px 20px;

          &.is-plain {
            min-width: 100px;
          }
        }
      }
    }
  }
}
</style>
