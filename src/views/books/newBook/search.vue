<template>
  <div class="upload-container">
    <el-card class="upload-card" shadow="hover">
      <h2 class="title">鸟类识别</h2>

      <!-- 上传图片的表单 -->
      <el-upload
        class="upload-demo"
        action="/api/upload"
        list-type="picture-card"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :show-file-list="false"
      >
        <el-button class="upload-btn" icon="el-icon-upload2">
          点击上传图片
        </el-button>
      </el-upload>

      <!-- 识别结果展示 -->
      <el-dialog :visible.sync="dialogVisible" title="鸟类识别结果" width="400px">
        <div v-if="birdInfo">
          <el-image style="width: 100%;" :src="birdInfo.image" fit="contain" />
          <p><strong>鸟类名称:</strong> {{ birdInfo.name }}</p>
          <p><strong>描述:</strong> {{ birdInfo.description }}</p>
        </div>
        <div v-else>
          <p>正在等待识别结果...</p>
        </div>
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, // 控制弹框显示与否
      birdInfo: null // 保存鸟类识别信息
    }
  },
  methods: {
    // 上传图片之前的检查
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        this.$message.error('请上传图片文件')
      }
      return isImage
    },
    // 上传成功的回调
    handleSuccess(response, file, fileList) {
      // 假设后端返回的是识别的鸟类信息
      this.birdInfo = response.data
      this.dialogVisible = true // 显示识别结果
    },
    // 上传失败的回调
    handleError() {
      this.$message.error('上传失败')
    }
  }
}
</script>

<style scoped>
.upload-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f7f9fc;
}

.upload-card {
  width: 500px;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.upload-btn {
  width: 60% !important;
  height: 100px;
  font-size: 18px;
  background-color: #20a0ff;
  color: white;
  border-radius: 8px;
}

.upload-btn:hover {
  background-color: #409eff;
}

.el-dialog__header {
  background-color: #409eff;
  color: white;
  border-radius: 8px 8px 0 0;
}

.el-button {
  width: 100%;
  margin-top: 20px;
}

.el-image {
  margin-bottom: 10px;
  border-radius: 8px;
}

.el-dialog {
  border-radius: 10px;
}

.el-message {
  background-color: #f2dede;
  border-color: #ebccd1;
}
</style>
