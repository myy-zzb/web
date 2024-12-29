<template>
  <div class="ebook-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <el-button icon="el-icon-back" @click="$router.go(-1)">返回</el-button>
      <div class="book-info">
        <span class="title">{{ bookInfo.title }}</span>
        <span class="chapter">第 {{ currentPage }} 页</span>
      </div>
      <div class="tools">
        <el-button-group>
          <el-button icon="el-icon-minus" @click="decreaseFontSize" />
          <el-button icon="el-icon-plus" @click="increaseFontSize" />
        </el-button-group>
        <el-select v-model="theme" size="small" style="margin-left: 10px">
          <el-option label="默认主题" value="default" />
          <el-option label="暖色主题" value="warm" />
          <el-option label="暗黑主题" value="dark" />
        </el-select>
      </div>
    </div>

    <!-- 阅读区域 -->
    <div class="reader-content" :class="theme">
      <div class="content" :style="{ fontSize: fontSize + 'px' }">
        {{ currentContent }}
      </div>
    </div>

    <!-- 底部翻页控制 -->
    <div class="page-control">
      <el-button
        icon="el-icon-arrow-left"
        :disabled="currentPage <= 1"
        @click="prevPage"
      >
        上一页
      </el-button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <el-button
        icon="el-icon-arrow-right"
        :disabled="currentPage >= totalPages"
        @click="nextPage"
      >
        下一页
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EbookReader',
  data() {
    return {
      bookInfo: {
        title: '三体',
        author: '刘慈欣'
      },
      currentPage: 1,
      totalPages: 10,
      fontSize: 18,
      theme: 'default',
      // 模拟书籍内容
      bookContent: [
        '在寂静的太空中，三体文明的探测器正在飞向地球，他们的任务是封锁地球人的科技发展，直至主力舰队抵达。',
        '但他们对地球人的计划低估了人类的智慧，面对前所未有的危局，地球文明开始制定自己的生存战略。',
        '黑暗森林法则被发现，幸存者在冰冷宇宙中寻找希望。',
        '三体文明的威胁阴影笼罩着地球，人类的命运正在经受着前所未有的考验。',
        '在这场文明的生存竞赛中，地球人究竟何去何从？',
        '面对更高级文明的降临，人类如何捍卫自己的生存权利？',
        '这是一个关于宇宙社会学的终极思考。',
        '这是一个关于人性的深刻探讨。',
        '这是一个文明的生存竞赛。',
        '这是一个充满希望与绝望的故事。'
      ]
    }
  },
  computed: {
    currentContent() {
      return this.bookContent[this.currentPage - 1] || ''
    }
  },
  created() {
    // const bookId = this.$route.params.id
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    increaseFontSize() {
      if (this.fontSize < 24) {
        this.fontSize += 2
      }
    },
    decreaseFontSize() {
      if (this.fontSize > 14) {
        this.fontSize -= 2
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ebook-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f6f7;

  .toolbar {
    padding: 15px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

    .el-button {
      &.el-icon-back {
        padding: 10px 20px;
        font-weight: 500;
        transition: all 0.3s;

        &:hover {
          background: #f2f6fc;
          color: #409EFF;
        }
      }
    }

    .book-info {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;

      .title {
        margin-left: 80px;
        font-size: 20px;
        font-weight: 600;
        color: #2c3e50;
        margin-right: 20px;
      }

      .chapter {
        font-size: 15px;
        color: #606266;
        background: #f2f6fc;
        padding: 4px 12px;
        border-radius: 15px;
      }
    }

    .tools {
      display: flex;
      align-items: center;
      gap: 15px;

      .el-button-group {
        .el-button {
          padding: 8px 15px;

          &:hover {
            background: #f2f6fc;
            color: #409EFF;
          }
        }
      }

      .el-select {
        width: 120px;
      }
    }
  }

  .reader-content {
    flex: 1;
    padding: 40px;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    transition: all 0.3s ease;

    .content {
      max-width: 800px;
      line-height: 2;
      letter-spacing: 0.05em;
      text-align: justify;
      padding: 30px 50px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    }

    &.default {
      background: #f5f6f7;
      color: #2c3e50;
    }

    &.warm {
      background: #faf6e9;

      .content {
        background: #fcf9f0;
        color: #5c3e1d;
      }
    }

    &.dark {
      background: #1a1a1a;

      .content {
        background: #2c2c2c;
        color: #e0e0e0;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
      }
    }
  }

  .page-control {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);

    .el-button {
      padding: 12px 25px;
      font-size: 15px;
      transition: all 0.3s;
      border-radius: 20px;

      &:not(:disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
      }

      &[disabled] {
        background: #f5f7fa;
        border-color: #e4e7ed;
        color: #c0c4cc;
      }
    }

    .page-info {
      margin: 0 30px;
      font-size: 15px;
      color: #606266;
      background: #f2f6fc;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 500;
    }
  }

  // 自定义滚动条样式
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 4px;

    &:hover {
      background: #909399;
    }
  }
}
</style>
