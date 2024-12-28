<template>
  <div class="book-borrow-container">
    <!-- 搜索区域 -->
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="请输入图书名称或作者"
        class="search-input"
        @keyup.enter.native="handleSearch"
      >
        <el-button slot="append" icon="el-icon-search" @click="handleSearch">
          搜索
        </el-button>
      </el-input>
    </div>

    <!-- 图书列表 -->
    <el-table
      v-loading="loading"
      :data="bookList"
      border
      style="width: 100%"
      class="book-table"
    >
      <el-table-column prop="bookName" label="图书名称" width="200" />
      <el-table-column prop="author" label="作者" width="150" />
      <el-table-column prop="isbn" label="ISBN" width="150" />
      <el-table-column prop="publisher" label="出版社" width="150" />
      <el-table-column prop="publishDate" label="出版日期" width="120" />
      <el-table-column prop="remainingCount" label="剩余数量" width="100" />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            :disabled="scope.row.remainingCount <= 0"
            @click="handleBorrow(scope.row)"
          >
            借阅
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 借阅确认对话框 -->
    <el-dialog title="借阅确认" :visible.sync="dialogVisible" width="30%">
      <div class="borrow-dialog-content">
        <p>您确定要借阅《{{ selectedBook.bookName }}》吗？</p>
        <p>借阅期限：30天</p>
        <p>应还日期：{{ returnDate }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
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
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      selectedBook: {},
      returnDate: ''
    }
  },
  created() {
    this.getBookList()
  },
  methods: {
    // 获取图书列表
    getBookList() {
      this.loading = true
      // 这里添加获取图书列表的API调用
      // 模拟数据
      setTimeout(() => {
        this.bookList = [
          {
            id: 1,
            bookName: '三体',
            author: '刘慈欣',
            isbn: '9787536692930',
            publisher: '重庆出版社',
            publishDate: '2008-01-01',
            remainingCount: 5
          }
          // 添加更多图书数据...
        ]
        this.total = 100
        this.loading = false
      }, 1000)
    },

    // 搜索处理
    handleSearch() {
      this.currentPage = 1
      this.getBookList()
    },

    // 借阅按钮点击处理
    handleBorrow(book) {
      this.selectedBook = book
      this.dialogVisible = true
      // 计算应还日期（30天后）
      const date = new Date()
      date.setDate(date.getDate() + 30)
      this.returnDate = date.toLocaleDateString()
    },

    // 确认借阅
    confirmBorrow() {
      // 这里添加借阅API调用
      this.$message({
        type: 'success',
        message: '借阅成功！'
      })
      this.dialogVisible = false
      this.getBookList() // 刷新图书列表
    },

    // 分页处理
    handleSizeChange(val) {
      this.pageSize = val
      this.getBookList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getBookList()
    }
  }
}
</script>

<style lang="scss" scoped>
.book-borrow-container {
  padding: 20px;

  .search-section {
    margin-bottom: 20px;
    .search-input {
      width: 400px;
    }
  }

  .book-table {
    margin-bottom: 20px;
  }

  .pagination-container {
    text-align: center;
    margin-top: 20px;
  }

  .borrow-dialog-content {
    p {
      margin: 10px 0;
      font-size: 14px;
    }
  }
}
</style>
