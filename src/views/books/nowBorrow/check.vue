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
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
          :index="indexMethod"
        />
        <el-table-column prop="book_title" label="图书名称" min-width="150" />
        <el-table-column prop="user_name" label="借阅人" width="120" />
        <el-table-column prop="borrow_date" label="借阅时间" width="180">
          <template slot-scope="scope">
            {{ formatDate(scope.row.borrow_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="return_date" label="申请日期" width="180">
          <template slot-scope="scope">
            {{ formatDate(scope.row.return_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="day" label="借阅天数" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-check"
              :disabled="scope.row.status !== 'returned'"
              @click="handleCheck(scope.row)"
            >
              审核
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

    <!-- 审核确认弹窗 -->
    <el-dialog
      title="审核确认"
      :visible.sync="checkDialogVisible"
      width="400px"
      center
      custom-class="rounded-dialog"
    >
      <div class="return-dialog-content">
        <div>确认通过{{ currentBook.user_name }}的{{ currentBook.book_title }}的归还申请？</div>
        <div class="return-info">
          <p><i class="el-icon-date" /> 借阅日期：{{ formatDate(currentBook.borrow_date) }}</p>
          <p><i class="el-icon-time" /> 申请日期：{{ formatDate(currentBook.return_date) }}</p>
          <p><i class="el-icon-info" /> 借阅天数：{{ currentBook.day }} 天</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCheck">确认通过</el-button>
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
        'keyWords': '',
        'pageNum': 1,
        'pageSize': 10
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      records: [],
      Allrecords: [],
      checkDialogVisible: false,
      currentBook: {}
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
          // 只保留未归还的书本（借阅中或已逾期）
          this.records = data.data.pageInfo.pageData.filter(record =>
            record.return_record === 'no'
          )

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
            if (record.actual_return_date) {
              record.actual_return_date = this.formatDate(record.actual_return_date)
            }
          })

          this.Allrecords = this.records
          this.page.total = Math.ceil(this.records.length / this.page.size)
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

      // 重置序号从1开始
      this.records = filteredRecords
      this.page.current = 1 // 重置到第一页
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
        returned: 'warning',
        checked: 'success',
        overdue: 'danger'
      }
      return types[status] || 'info'
    },
    getStatusText(status) {
      const texts = {
        borrowed: '借阅中',
        returned: '申请归还',
        checked: '已归还',
        overdue: '已逾期'
      }
      return texts[status] || status
    },
    handleCheck(row) {
      this.currentBook = { ...row }
      this.checkDialogVisible = true
    },
    confirmCheck() {
      const url = 'http://localhost:8696/librarymasts/BorrowRecordController/updateReturnRecord'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'id': this.currentBook.id,
          'returnRecord': 'yes'
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.code === 200) {
            this.$message.success('审核通过')
            this.checkDialogVisible = false
            this.getRecords()
          } else {
            throw new Error(data.message || '操作失败')
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    exportRecords() {
      // 获取要导出的数据
      const exportData = this.records.map(record => ({
        '序号': this.records.indexOf(record) + 1,
        '图书名称': record.book_title,
        '借阅人': record.user_name,
        '借阅时间': this.formatDate(record.borrow_date),
        '申请时间': this.formatDate(record.return_date),
        '借阅天数': record.day,
        '实际归还时间': record.actual_return_date ? this.formatDate(record.actual_return_date) : '-',
        '状态': this.getStatusText(record.status),
        '备注': record.remark || '-'
      }))

      // 创建工作簿和工作表
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(exportData)

      // 设置列宽
      const colWidths = [
        { wch: 8 }, // 序号
        { wch: 30 }, // 图书名称
        { wch: 15 }, // 借阅人
        { wch: 15 }, // 借阅时间
        { wch: 15 }, // 应还时间
        { wch: 10 }, // 借阅天数
        { wch: 15 }, // 实际归还时间
        { wch: 10 }, // 状态
        { wch: 20 } // 备注
      ]
      worksheet['!cols'] = colWidths

      // 设置表头样式
      const range = XLSX.utils.decode_range(worksheet['!ref'])
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + '1'
        if (!worksheet[address]) continue
        worksheet[address].s = {
          font: { bold: true },
          alignment: { horizontal: 'center' },
          fill: { fgColor: { rgb: 'CCCCCC' }}
        }
      }

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, '借阅记录')

      // 生成文件并下载
      const now = new Date()
      const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
      XLSX.writeFile(workbook, `借阅记录_${timestamp}.xlsx`)

      this.$message.success('导出成功')
    },
    indexMethod(index) {
      // 因为是前端分页，所以直接使用当前数组的索引加1即可
      return index + 1
    }
  }
}
</script>

<style lang="scss" scoped>
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
    }

    :deep(.el-table) {
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
  }

  .return-dialog-content {
    text-align: center;
    padding: 30px 20px;

    p {
      margin: 10px 0;
      font-size: 16px;
      color: #303133;
    }

    .return-info {
      margin-top: 25px;
      text-align: left;
      background-color: #f5f7fa;
      padding: 20px;
      border-radius: 12px;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);

      p {
        font-size: 14px;
        color: #606266;
        margin: 12px 0;
        display: flex;
        align-items: center;

        i {
          color: #409EFF;
          margin-right: 10px;
          font-size: 16px;
        }
      }
    }
  }

  :deep(.rounded-dialog) {
    border-radius: 32px;
    overflow: hidden;

    .el-dialog__header {
      border-radius: 32px 32px 0 0;
    }

    .el-dialog__footer {
      border-radius: 0 0 32px 32px;
    }
  }
}
</style>
