<template>
  <div class="user-list-container">
    <!-- 搜索区域 -->
    <el-card class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择角色" clearable>
            <el-option label="管理员" value="admin" />
            <el-option label="用户" value="student" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表表格 -->
    <el-card class="user-table">
      <div slot="header" class="table-header">
        <span>用户列表</span>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加用户</el-button>
      </div>

      <el-table v-loading="loading" :data="userList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="role" label="角色" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'primary'">
              {{ getRoleText(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" plain @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="warning" size="small" plain @click="handleReset(scope.row)">重置密码</el-button>
            <el-button type="danger" size="small" plain @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          :current-page="page.current"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="page.size"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      loading: false,
      searchForm: {
        username: '',
        role: ''
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      // 模拟用户数据
      userList: [
        {
          id: 1,
          username: 'admin',
          name: '超级管理员',
          role: 'admin',
          email: 'admin@example.com',
          createTime: '2023-01-01'
        },
        {
          id: 2,
          username: 'student',
          name: '张三',
          role: 'student',
          email: 'student@example.com',
          createTime: '2023-01-02'
        },
        {
          id: 4,
          username: 'student1',
          name: '王五',
          role: 'student',
          email: 'student1@example.com',
          createTime: '2023-01-04'
        }
      ]
    }
  },
  methods: {
    getRoleText(role) {
      const roleMap = {
        admin: '管理员',
        student: '学生',
        teacher: '教师'
      }
      return roleMap[role] || role
    },
    handleSearch() {
      // 实现搜索逻辑
      this.loading = true
      const { username, role } = this.searchForm

      // 过滤用户列表
      const filteredList = this.userList.filter(user => {
        const matchUsername = !username || user.username.toLowerCase().includes(username.toLowerCase())
        const matchRole = !role || user.role === role
        return matchUsername && matchRole
      })

      // 更新分页数据
      this.page.total = filteredList.length
      const start = (this.page.current - 1) * this.page.size
      const end = start + this.page.size
      this.userList = filteredList.slice(start, end)

      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    resetSearch() {
      this.searchForm = {
        username: '',
        role: ''
      }
      this.handleSearch()
    },
    handleAdd() {
      this.$message.success('点击了添加用户')
    },
    handleEdit(row) {
      this.$message.success(`编辑用户：${row.username}`)
    },
    handleReset(row) {
      this.$confirm('确定要重置该用户的密码吗？', '提示', {
        type: 'warning'
      }).then(() => {
        // 这里添加重置密码的逻辑
        const defaultPassword = '123456'
        // 模拟API调用
        setTimeout(() => {
          this.$message.success(`用户 ${row.username} 的密码已重置为: ${defaultPassword}`)
        }, 500)
      }).catch(() => {
        this.$message.info('已取消重置密码操作')
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除该用户吗？此操作不可恢复！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 从列表中删除用户
        const index = this.userList.findIndex(item => item.id === row.id)
        if (index > -1) {
          this.userList.splice(index, 1)
          this.page.total--
          this.$message({
            type: 'success',
            message: `成功删除用户：${row.username}`
          })
        }
      }).catch(() => {
        this.$message.info('已取消删除操作')
      })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.handleSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list-container {
  padding: 20px;

  .search-area {
    margin-bottom: 20px;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
