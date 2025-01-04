<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>

      <el-form ref="form" :model="userInfo" label-width="120px">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled />
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="userInfo.name" disabled />
        </el-form-item>

        <el-form-item label="角色">
          <el-tag v-if="userInfo.roles.includes('admin')" type="success">管理员</el-tag>
          <el-tag v-else>普通用户</el-tag>
        </el-form-item>

        <el-form-item v-if="!userInfo.roles.includes('admin')" label="学号">
          <el-input v-model="userInfo.studentId" />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email" />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="userInfo.phone" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateInfo">更新信息</el-button>
        </el-form-item>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserInfo',
  data() {
    return {
      userInfo: {
        username: '',
        name: '',
        roles: [],
        email: '',
        phone: '',
        studentId: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      // 从vuex获取基本信息
      this.userInfo.username = this.name
      this.userInfo.name = this.name
      this.userInfo.roles = this.roles

      // TODO: 从后端获取详细信息
      // 这里需要调用后端API获取email、phone和studentId信息
    },
    updateInfo() {
      this.$message({
        message: '更新成功',
        type: 'success'
      })
      // TODO: 调用后端API更新用户信息
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;

  .box-card {
    width: 600px;
    margin: 0 auto;
  }
}
</style>
