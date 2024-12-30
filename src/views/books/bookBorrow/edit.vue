<template>
  <div class="add-book-container">
    <el-card class="form-card">
      <div slot="header" class="card-header">
        <span>新增图书</span>
      </div>

      <el-form
        ref="bookForm"
        :model="bookForm"
        :rules="rules"
        label-width="100px"
        class="book-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="图书名称" prop="title">
              <el-input v-model="bookForm.title" placeholder="请输入图书名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="bookForm.author" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ISBN" prop="isbn">
              <el-input v-model="bookForm.isbn" placeholder="请输入ISBN" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社" prop="publisher">
              <el-input
                v-model="bookForm.publisher"
                placeholder="请输入出版社"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出版日期" prop="publishDate">
              <el-date-picker
                v-model="bookForm.publishDate"
                type="date"
                placeholder="选择出版日期"
                style="width: 100%"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图书数量" prop="quantity">
              <el-input-number
                v-model="bookForm.quantity"
                :min="1"
                :max="999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="图书封面" prop="image">
          <el-upload
            class="book-cover-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeImageUpload"
            :http-request="handleImageUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="book-cover">
            <i v-else class="el-icon-plus book-cover-uploader-icon" />
          </el-upload>
          <div class="upload-tip">建议尺寸: 300x400像素，支持jpg、png格式</div>
        </el-form-item>

        <el-form-item label="图书简介" prop="description">
          <el-input
            v-model="bookForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入图书简介"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BookBorrowAdd',
  data() {
    return {
      bookForm: {
        title: '',
        author: '',
        isbn: '',
        publisher: '',
        publishDate: '',
        quantity: 1,
        available_quantity: 1,
        description: '',
        image: null
      },
      queryForm: {
        'keyWords': '',
        'pageNum': 1,
        'pageSize': 10
      },
      imageUrl: '',
      rules: {
        title: [
          { required: true, message: '请输入图书名称', trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ],
        author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        publisher: [
          { required: true, message: '请输入出版社', trigger: 'blur' }
        ],
        publishDate: [
          { required: true, message: '请选择出版日期', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.queryForm.keyWords = this.$route.params.title || ''
    this.getBookList()
  },
  methods: {

    getBookList() {
      this.loading = true
      const url = 'http://localhost:8696/librarymasts/book/findbookbytitle'
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
          const bookData = data.data.pageInfo.pageData[0]
          this.bookForm = {
            ...bookData,
            publishDate: bookData.update_time,
            quantity: bookData.quantity || 1,
            available_quantity: bookData.available_quantity || 1
          }
          if (bookData.image) {
            this.imageUrl = 'data:image/png;base64,' + bookData.image
            this.bookForm.image = bookData.image
          }
        })
        .catch(error => {
          console.error('Error:', error)
          this.$message.error('获取数据失败')
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 图片上传前的验证
    beforeImageUpload(file) {
      const isJPGOrPNG =
        file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPGOrPNG) {
        this.$message.error('图书封面只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isJPGOrPNG && isLt2M
    },

    // 处理图片上传
    handleImageUpload(options) {
      const file = options.file
      // 将文件转换为base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.imageUrl = reader.result
        this.bookForm.image = reader.result.split(',')[1] // 保存base64数据
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.bookForm.validate((valid) => {
        if (valid) {
          const submitData = {
            ...this.bookForm
          }

          const url = 'http://localhost:8696/librarymasts/book/update'
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submitData)
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.code === 200) {
                this.$message.success('更新成功')
                this.$router.push('/bookBorrow/borrow')
              } else {
                this.$message.error(data.msg || '更新失败')
              }
            })
            .catch((error) => {
              console.error('Error:', error)
              this.$message.error('更新失败')
            })
        }
      })
    },

    // 重置表单
    resetForm() {
      this.$refs.bookForm.resetFields()
      this.imageUrl = ''
      this.bookForm.image = null
    }
  }
}
</script>

<style lang="scss" scoped>
.add-book-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 84px);

  .form-card {
    max-width: 1200px;
    margin: 0 auto;

    .card-header {
      font-size: 18px;
      font-weight: bold;
    }

    .book-form {
      padding: 20px;
    }
  }

  .book-cover-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s;

      &:hover {
        border-color: #409eff;
      }
    }

    .book-cover-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 200px;
      line-height: 200px;
      text-align: center;
    }

    .book-cover {
      width: 150px;
      height: 200px;
      display: block;
      object-fit: cover;
    }
  }

  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
  }
}
</style>
