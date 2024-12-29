<template>
  <div class="book-borrow-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-wrapper">
        <el-input
          v-model="searchQuery"
          placeholder="请输入图书名称或作者"
          class="search-input"
          prefix-icon="el-icon-search"
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" type="primary" @click="handleSearch">
            搜索
          </el-button>
        </el-input>
      </div>
    </div>

    <!-- 图书列表 -->
    <el-card class="book-list-card" shadow="hover">
      <el-table
        v-loading="loading"
        :data="bookList"
        border
        style="width: 100%"
        class="book-table"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      >
        <el-table-column prop="title" label="图书名称" width="200">
          <template slot-scope="scope">
            <div class="book-title">
              <span class="title-text">{{ scope.row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="150" />
        <el-table-column prop="publisher" label="出版社" width="150" />
        <el-table-column prop="isbn" label="ISBN" width="150" />
        <el-table-column prop="quantity" label="总数" width="120" />
        <el-table-column prop="update_time" label="出版日期" width="200" />
        <el-table-column prop="available_quantity" label="库存" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.available_quantity > 0 ? 'success' : 'danger'">
              {{ scope.row.available_quantity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="封面" width="120">
          <template slot-scope="scope">
            <el-image
              style="width: 80px; height: 120px;"
              :src="scope.row.image"
              fit="cover"
              :preview-src-list="[scope.row.image]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="简介" width="300" />
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.remainingCount <= 0"
              class="borrow-button"
              @click="handleBorrow(scope.row)"
            >
              归还
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          :current-page="queryForm.pageNum"
          :page-sizes="[5,10, 20, 30]"
          :page-size="queryForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total*queryForm.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 借阅确认对话框 -->
    <el-dialog
      title="借阅确认"
      :visible.sync="dialogVisible"
      width="400px"
      center
      custom-class="borrow-dialog"
    >
      <div class="borrow-dialog-content">
        <div class="book-info">
          <i class="el-icon-reading book-icon" />
          <h3>{{ selectedBook.title }}</h3>
        </div>
        <div class="borrow-details">
          <div class="borrow-period">
            <p>
              <i class="el-icon-time" /> 借阅期限：
              <el-input-number
                v-model="borrowDays"
                :min="1"
                :max="90"
                size="small"
                @change="updateReturnDate"
              />
              天
            </p>
          </div>
          <p><i class="el-icon-date" /> 应还日期：{{ returnDate }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBorrow">确认借阅</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BookBorrow',
  data() {
    return {
      searchQuery: '',
      loading: false,
      bookList: [],
      total: 0,
      dialogVisible: false,
      selectedBook: {},
      returnDate: '',
      queryForm: {
        'keyWords': '',
        'pageNum': 1,
        'pageSize': 5
      },
      borrowForm: {
        'userId': this.$store.state.user.id,
        'bookId': 1,
        'borrowDate': Date.now() },
      borrowDays: 30 // 默认借阅30天
    }
  },
  created() {
    this.getBookList()
  },
  methods: {
    // 获取图书列表
    getBookList() {
      this.loading = true
      const url = 'http://localhost:8696/librarymasts/BorrowRecordController/findRecordById'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.queryForm)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.bookList = data.data.pageInfo.pageData
          this.total = data.data.pageInfo.totalPage
          this.bookList.forEach(item => {
            item.image = 'data:image/png;base64,' + item.image
          })
        })
        .catch(error => {
          console.error('Error:', error)
          this.$message.error('获取数据失败')
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 搜索处理
    handleSearch() {
      this.queryForm.pageNum = 1
      this.queryForm.keyWords = this.searchQuery
      this.getBookList()
    },

    // 借阅按钮点击处理
    handleBorrow(book) {
      this.selectedBook = book
      this.dialogVisible = true
      this.borrowDays = 30 // 重置为默认30天
      this.updateReturnDate() // 计算初始归还日期
    },

    // 确认借阅
    confirmBorrow() {
      // 这里添加借阅API调用
      const url = 'http://localhost:8696/librarymasts/BorrowRecordController/addBorrowRecord'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.borrowForm)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
        })
      this.$message({
        type: 'success',
        message: '借阅成功！'
      })
      this.dialogVisible = false
      this.getBookList() // 刷新图书列表

      const urll = 'http://localhost:8696/librarymasts/book/updatebook'
      fetch(urll, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'title': this.selectedBook.title,
          'availableQuantity': this.selectedBook.available_quantity - 1
        })
      })
    },

    // 分页处理
    handleSizeChange(val) {
      this.queryForm.pageSize = val
      this.getBookList()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNum = val
      this.getBookList()
    },

    // 更新归还日期
    updateReturnDate() {
      const date = new Date()
      date.setDate(date.getDate() + this.borrowDays)
      this.returnDate = date.toLocaleDateString()
    }
  }
}
</script>

<style lang="scss" scoped>
.book-borrow-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);

  .search-section {
    margin-bottom: 20px;

    .search-wrapper {
      display: flex;
      justify-content: center;

      .search-input {
        width: 500px;

        :deep(.el-input__inner) {
          border-radius: 4px;
          height: 40px;
          line-height: 40px;
        }

        :deep(.el-input-group__append) {
          background-color: #409EFF;
          border-color: #409EFF;
          color: white;
          padding: 0 20px;
        }
      }
    }
  }

  .book-list-card {
    border-radius: 8px;

    .book-table {
      margin-bottom: 20px;

      .book-title {
        .title-text {
          font-weight: 500;
          color: #303133;
          &:hover {
            color: #409EFF;
            cursor: pointer;
          }
        }
      }

      :deep(.el-button.borrow-button) {
        padding: 7px 15px;
        &.is-disabled {
          color: #C0C4CC;
          background-color: #F5F7FA;
          border-color: #E4E7ED;
        }
      }
    }
  }

  .pagination-container {
    text-align: center;
    margin-top: 30px;
    padding: 10px 0;
  }

  .borrow-dialog {
    .book-info {
      text-align: center;
      margin-bottom: 20px;

      .book-icon {
        font-size: 40px;
        color: #409EFF;
        margin-bottom: 10px;
      }

      h3 {
        margin: 10px 0;
        color: #303133;
      }
    }

    .borrow-details {
      background-color: #f5f7fa;
      padding: 15px;
      border-radius: 4px;

      p {
        margin: 10px 0;
        color: #606266;

        i {
          margin-right: 8px;
          color: #409EFF;
        }
      }

      .borrow-period {
        display: flex;
        align-items: center;

        .el-input-number {
          width: 100px;
          margin: 0 8px;
        }
      }
    }
  }
}

// 图片加载失败时的样式
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 20px;
}
</style>
