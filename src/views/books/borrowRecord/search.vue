<template>
  <div class="borrow-record-container">
    <!-- 搜索条件区域 -->
    <el-card class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="图书名称">
          <el-input
            v-model="searchForm.bookName"
            placeholder="请输入图书名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="借阅时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="借阅状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="借阅中" value="borrowed" />
            <el-option label="已归还" value="returned" />
            <el-option label="已逾期" value="overdue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 借阅记录表格 -->
    <el-card class="record-table">
      <div slot="header" class="table-header">
        <span>借阅记录列表</span>
        <el-button
          type="text"
          icon="el-icon-download"
          @click="exportRecords"
        >
          导出记录
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="records"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="book_title" label="图书名称" min-width="150" />
        <el-table-column prop="user_name" label="借阅人" width="120" />
        <el-table-column prop="borrow_date" label="借阅时间" width="180">
          <template slot-scope="scope">
            {{ formatDate(scope.row.borrow_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="ying_return_date" label="应还时间" width="180">
          <template slot-scope="scope">
            {{ formatDate(scope.row.ying_return_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="day" label="借阅天数" width="180" />
        <el-table-column prop="return_date" label="实际归还时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.return_date ? formatDate(scope.row.return_date) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="return_record" label="审核状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.return_record === 'yes' ? 'success' : 'warning'">
              {{ scope.row.return_record === 'yes' ? '已审核' : '未审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-view"
              @click="viewDetail(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="page.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.size"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog
      title="借阅详情"
      :visible.sync="detailDialogVisible"
      width="700px"
      :before-close="handleClose"
      top="5vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
    >
      <div v-if="currentDetail" class="detail-content">
        <el-form :model="book" class="detail-form" label-width="100px">
          <div class="book-info">
            <div class="book-cover">
              <el-image
                style="width: 160px; height: 220px; border-radius: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1)"
                :src="book.image"
                fit="cover"
                :preview-src-list="[book.image]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" style="font-size: 30px; color: #909399" />
                </div>
              </el-image>
            </div>
            <div class="book-details">
              <h3 style="font-size: 20px; font-weight: 600; color: #303133; margin-bottom: 16px">
                {{ book.title || '-' }}
              </h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span style="font-size: 14px; color: #606266">作者:</span>
                  <span style="font-size: 14px; color: #303133; font-weight: 500">{{ book.author || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span style="font-size: 14px; color: #606266">出版社:</span>
                  <span style="font-size: 14px; color: #303133; font-weight: 500">{{ book.publisher || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span style="font-size: 14px; color: #606266">ISBN:</span>
                  <span style="font-size: 14px; color: #303133; font-weight: 500">{{ book.isbn || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span style="font-size: 14px; color: #606266">出版日期:</span>
                  <span style="font-size: 14px; color: #303133; font-weight: 500">{{ book.update_time || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <el-divider content-position="left" style="margin: 24px 0">借阅信息</el-divider>

          <div class="borrow-info-grid">
            <el-form-item label="借阅人">
              <span style="font-size: 14px; color: #303133">{{ currentDetail.user_name || '-' }}</span>
            </el-form-item>
            <el-form-item label="借阅时间">
              <span style="font-size: 14px; color: #303133">{{ formatDate(currentDetail.borrow_date) || '-' }}</span>
            </el-form-item>
            <el-form-item label="应还时间">
              <span style="font-size: 14px; color: #303133">{{ formatDate(currentDetail.ying_return_date) || '-' }}</span>
            </el-form-item>
            <el-form-item label="借阅天数">
              <span style="font-size: 14px; color: #303133">{{ currentDetail.day || 0 }} 天</span>
            </el-form-item>
            <el-form-item label="实际归还时间">
              <span style="font-size: 14px; color: #303133">{{ currentDetail.return_date ? formatDate(currentDetail.return_date) : '-' }}</span>
            </el-form-item>
            <el-form-item label="借阅状态">
              <el-tag v-if="currentDetail.status" :type="getStatusType(currentDetail.status)" effect="dark">
                {{ getStatusText(currentDetail.status) }}
              </el-tag>
              <span v-else>-</span>
            </el-form-item>
            <el-form-item label="审核状态">
              <el-tag :type="currentDetail.return_record === 'yes' ? 'success' : 'warning'" effect="dark">
                {{ currentDetail.return_record === 'yes' ? '已审核' : '未审核' }}
              </el-tag>
            </el-form-item>
            <el-form-item label="备注" class="remark-item">
              <span style="font-size: 14px; color: #303133">{{ currentDetail.remark || '-' }}</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div v-else class="no-data">
        <i class="el-icon-document" style="font-size: 48px; color: #909399" />
        <p>暂无详情数据</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="detailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  name: 'BorrowRecordSearch',
  data() {
    return {
      loading: false,
      searchForm: {
        'keyWords': this.$store.state.user.name,
        'pageNum': 1,
        'pageSize': 10
      },
      book: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      records: [],
      Allrecords: [],
      detailDialogVisible: false,
      currentDetail: {}
    }
  },
  created() {
    this.getRecords()
  },
  methods: {
    formatDate(date) {
      if (!date) return '-'
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    getbook(name) {
      const url = 'http://localhost:8696/librarymasts/book/findbookbytitle'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'keyWords': name,
          'pageNum': 1,
          'pageSize': 10
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          this.book = data.data.pageInfo.pageData[0]
          console.log(this.book)
          this.book.image = 'data:image/png;base64,' + this.book.image
        })
        .catch(error => {
          console.error('Error:', error)
          this.$message.error('获取数据失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    getRecords() {
      this.loading = true
      const url = 'http://localhost:8696/librarymasts/BorrowRecordController/findRecordById'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.searchForm)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('获取数据失败')
          }
          return response.json()
        })
        .then(data => {
          this.records = data.data.pageInfo.pageData
          this.records.forEach(record => {
            const returnDate = new Date(record.borrow_date)
            returnDate.setDate(returnDate.getDate() + record.day)
            record.return_date = this.formatDate(returnDate)
            record.borrow_date = this.formatDate(record.borrow_date)
            // 检查是否逾期
            const today = new Date()
            const returnDate1 = new Date(record.return_date)
            if (!record.actual_return_date && today > returnDate1) {
              record.status = 'overdue'
            }
            // 计算应还日期（ying_return_date）
            const yingReturnDate = new Date(record.borrow_date)
            yingReturnDate.setDate(yingReturnDate.getDate() + record.day)
            record.ying_return_date = this.formatDate(yingReturnDate)
            this.Allrecords = this.records
          })
          this.page.total = data.data.pageInfo.totalPage
        })
        .catch(error => {
          console.error('Error:', error)
          this.$message.error('获取数据失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleSearch() {
      this.loading = true
      // 从现有records中筛选
      const filteredRecords = this.Allrecords.filter(record => {
        // 匹配图书名称
        if (this.searchForm.bookName &&
            !record.book_title.toLowerCase().includes(this.searchForm.bookName.toLowerCase())) {
          return false
        }

        // 匹配借阅状态
        if (this.searchForm.status && record.status !== this.searchForm.status) {
          return false
        }

        // 匹配日期范围
        if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
          const borrowDate = new Date(record.borrow_date)
          const startDate = new Date(this.searchForm.dateRange[0])
          const endDate = new Date(this.searchForm.dateRange[1])
          if (borrowDate < startDate || borrowDate > endDate) {
            return false
          }
        }

        return true
      })

      this.records = filteredRecords
      this.loading = false
    },
    resetSearch() {
      this.searchForm = {
        'keyWords': '',
        'pageNum': 1,
        'pageSize': 10
      }
      this.getRecords()
    },
    handleSizeChange(val) {
      this.page.size = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.handleSearch()
    },
    getStatusType(status) {
      const types = {
        borrowed: 'primary',
        returned: 'success',
        overdue: 'danger'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        borrowed: '借阅中',
        returned: '已归还',
        overdue: '已逾期'
      }
      return texts[status] || status
    },
    viewDetail(row) {
      this.getbook(row.book_title)
      this.currentDetail = { ...row }
      this.detailDialogVisible = true
    },
    exportRecords() {
      // 获取要导出的数据
      const exportData = this.records.map(record => ({
        '图书名称': record.book_title,
        '借阅人': record.user_name,
        '借阅时间': this.formatDate(record.borrow_date),
        '应还时间': this.formatDate(record.return_date),
        '借阅天数': record.day,
        '实际归还时间': record.actual_return_date ? this.formatDate(record.actual_return_date) : '-',
        '状态': this.getStatusText(record.status),
        '审核状态': record.return_record === 'yes' ? '已审核' : '未审核'
      }))

      // 创建工作簿和工作表
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // 设置列宽
      const colWidths = [
        { wch: 30 }, // 图书名称
        { wch: 15 }, // 借阅人
        { wch: 15 }, // 借阅时间
        { wch: 15 }, // 应还时间
        { wch: 10 }, // 借阅天数
        { wch: 15 }, // 实际归还时间
        { wch: 10 }, // 状态
        { wch: 10 } // 审核状态
      ]
      worksheet['!cols'] = colWidths

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, '借阅记录')

      // 生成文件并下载
      const date = new Date().toLocaleDateString().replace(/\//g, '')
      XLSX.writeFile(workbook, `借阅记录_${date}.xlsx`)

      this.$message.success('导出成功')
    }
  }
}
</script>

<style lang="scss">
.borrow-record-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);

  .search-area {
    margin-bottom: 20px;
    border-radius: 8px;

    .el-form {
      padding: 20px 20px 0;

      .el-form-item {
        margin-bottom: 20px;

        .el-input, .el-select, .el-date-picker {
          width: 220px;
        }
      }
    }
  }

  .record-table {
    border-radius: 8px;

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #ebeef5;

      span {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }

      .el-button {
        padding: 6px 15px;

        i {
          margin-right: 5px;
        }
      }
    }

    .el-table {
      .el-table__header-wrapper {
        th {
          background-color: #f5f7fa;
          color: #606266;
          font-weight: 500;
        }
      }

      .el-table__row {
        td {
          padding: 12px 0;
        }
      }

      .el-tag {
        border-radius: 4px;
        padding: 0 10px;
        height: 24px;
        line-height: 22px;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    padding: 10px 20px;
    text-align: right;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }

  .el-dialog {
    border-radius: 8px;
    overflow: hidden;

    .el-dialog__header {
      padding: 20px;
      border-bottom: 1px solid #ebeef5;
      margin: 0;

      .el-dialog__title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }

      .el-dialog__headerbtn {
        top: 20px;
      }
    }

    .el-dialog__body {
      padding: 30px;
    }

    .el-dialog__footer {
      padding: 15px 20px;
      border-top: 1px solid #ebeef5;
      text-align: right;
    }
  }

  .detail-content {
    .book-info {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
    }

    .book-details {
      flex: 1;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .detail-item {
      display: flex;
      gap: 8px;
    }

    .borrow-info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;

      .remark-item {
        grid-column: span 2;
      }
    }
  }

  .no-data {
    text-align: center;
    padding: 40px 0;
    color: #909399;

    p {
      margin-top: 16px;
      font-size: 14px;
    }
  }

  .el-button {
    padding: 8px 16px;
    border-radius: 4px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    & + .el-button {
      margin-left: 20px;
    }

    i {
      margin-right: 5px;
    }
  }
}
</style>
