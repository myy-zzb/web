<template>
  <div class="book-list-container">
    <!-- 顶部搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            placeholder="搜索书名/作者"
            prefix-icon="el-icon-search"
            clearable
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="categoryFilter" placeholder="图书分类" clearable>
            <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>

    <!-- 图书列表区域 -->
    <div class="books-grid">
      <el-row :gutter="20">
        <el-col
          v-for="book in filteredBooks"
          :key="book.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <el-card class="book-card" shadow="hover">
            <div class="book-cover">
              <img :src="book.coverUrl" :alt="book.title">
            </div>
            <div class="book-info">
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <p class="book-category">{{ book.category }}</p>
              <div class="book-actions">
                <el-button type="primary" size="small" @click="readBook(book.id)">
                  开始阅读
                </el-button>
                <el-button type="text" @click="addToFavorites(book.id)">
                  <i class="el-icon-star-off" />
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 分页控件 -->
    <div class="pagination-section">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="filteredTotal"
        layout="total, prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookList',
  data() {
    return {
      searchQuery: '',
      categoryFilter: '',
      currentPage: 1,
      pageSize: 12,
      total: 24,
      books: [
        {
          id: 1,
          title: '三体',
          author: '刘慈欣',
          category: 'fiction',
          coverUrl: require('@/assets/images/三体.png')
        },
        {
          id: 2,
          title: '活法',
          author: '稻盛和夫',
          category: 'business',
          coverUrl: require('@/assets/images/活法.png')
        },
        {
          id: 3,
          title: '人类简史',
          author: '尤瓦尔·赫拉利',
          category: 'social',
          coverUrl: require('@/assets/images/人类简史.png')
        },
        {
          id: 4,
          title: '时间简史',
          author: '史蒂芬·霍金',
          category: 'technology',
          coverUrl: require('@/assets/images/时间简史.png')
        },
        {
          id: 5,
          title: '百年孤独',
          author: '加西亚·马尔克斯',
          category: 'fiction',
          coverUrl: require('@/assets/images/百年孤独.png')
        },
        {
          id: 6,
          title: '原则',
          author: '瑞·达利欧',
          category: 'business',
          coverUrl: require('@/assets/images/原则.png')
        },
        {
          id: 7,
          title: '未来简史',
          author: '尤瓦尔·赫拉利',
          category: 'social',
          coverUrl: require('@/assets/images/未来简史.png')
        },
        {
          id: 8,
          title: '浪潮之巅',
          author: '吴军',
          category: 'technology',
          coverUrl: require('@/assets/images/浪潮之巅.png')
        },
        {
          id: 9,
          title: '解忧杂货店',
          author: '东野圭吾',
          category: 'fiction',
          coverUrl: require('@/assets/images/解忧杂货店.png')
        },
        {
          id: 10,
          title: '定位',
          author: '艾·里斯',
          category: 'business',
          coverUrl: require('@/assets/images/定位.png')
        },
        {
          id: 11,
          title: '枪炮、病菌与钢铁',
          author: '贾雷德·戴蒙德',
          category: 'social',
          coverUrl: require('@/assets/images/枪炮、病菌与钢铁.png')
        },
        {
          id: 12,
          title: '编程珠玑',
          author: '乔恩·本特利',
          category: 'technology',
          coverUrl: require('@/assets/images/编程珠玑.png')
        },
        {
          id: 13,
          title: '镜花缘',
          author: '李汝珍',
          category: 'fiction',
          coverUrl: require('@/assets/images/镜花缘.png')
        },
        {
          id: 14,
          title: '老人与海',
          author: '海明威',
          category: 'fiction',
          coverUrl: require('@/assets/images/老人与海.png')
        },
        {
          id: 15,
          title: '了不起的盖茨比',
          author: '菲茨杰拉德',
          category: 'fiction',
          coverUrl: require('@/assets/images/了不起的盖茨比.png')
        },
        {
          id: 16,
          title: '骆驼祥子',
          author: '老舍',
          category: 'fiction',
          coverUrl: require('@/assets/images/骆驼祥子.png')
        },
        {
          id: 17,
          title: '呐喊',
          author: '鲁迅',
          category: 'fiction',
          coverUrl: require('@/assets/images/呐喊.png')
        },
        {
          id: 18,
          title: '平凡的世界',
          author: '路遥',
          category: 'fiction',
          coverUrl: require('@/assets/images/平凡的世界.png')
        },
        {
          id: 19,
          title: '蛙',
          author: '莫言',
          category: 'fiction',
          coverUrl: require('@/assets/images/蛙.png')
        },
        {
          id: 20,
          title: '边城',
          author: '沈从文',
          category: 'fiction',
          coverUrl: require('@/assets/images/边城.png')
        },
        {
          id: 21,
          title: '追风筝的人',
          author: '卡勒德·胡赛尼',
          category: 'fiction',
          coverUrl: require('@/assets/images/追风筝的人.png')
        },
        {
          id: 22,
          title: '哈姆雷特',
          author: '莎士比亚',
          category: 'fiction',
          coverUrl: require('@/assets/images/哈姆雷特.png')
        },
        {
          id: 23,
          title: '共产党宣言',
          author: '马克思 恩格斯',
          category: 'social',
          coverUrl: require('@/assets/images/共产党宣言.png')
        },
        {
          id: 24,
          title: '简爱',
          author: '夏洛蒂·勃朗特',
          category: 'fiction',
          coverUrl: require('@/assets/images/简爱.png')
        }
      ],
      categories: [
        { label: '文学小说', value: 'fiction' },
        { label: '经管励志', value: 'business' },
        { label: '人文社科', value: 'social' },
        { label: '科技科普', value: 'technology' }
      ]
    }
  },
  computed: {
    filteredBooks() {
      // 先进行过滤
      const filtered = this.books.filter(book => {
        const matchesSearch = this.searchQuery
          ? book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true
        const matchesCategory = this.categoryFilter
          ? book.category === this.categoryFilter
          : true
        return matchesSearch && matchesCategory
      })

      // 然后进行分页
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return filtered.slice(start, end)
    },
    // 添加一个计算总数的属性
    filteredTotal() {
      return this.books.filter(book => {
        const matchesSearch = this.searchQuery
          ? book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true
        const matchesCategory = this.categoryFilter
          ? book.category === this.categoryFilter
          : true
        return matchesSearch && matchesCategory
      }).length
    }
  },
  created() {
    this.fetchBooks()
  },
  methods: {
    readBook(bookId) {
      // 跳转到阅读页面
      this.$router.push(`/bookRead/read` + bookId)
    },
    addToFavorites(bookId) {
      // 模拟收藏功能
      this.$message({
        message: '收藏成功！',
        type: 'success'
      })
    },
    handlePageChange(page) {
      this.currentPage = page
      this.fetchBooks()
    },
    async fetchBooks() {
      // 使用过滤后的总数
      this.total = this.filteredTotal
    }
  }
}
</script>

<style lang="scss" scoped>
.book-list-container {
  padding: 20px;

  .search-filter-section {
    margin-bottom: 20px;
  }

  .books-grid {
    margin-bottom: 20px;

    .book-card {
      margin-bottom: 20px;
      height: 100%;

      .book-cover {
        text-align: center;
        margin-bottom: 10px;

        img {
          max-width: 100%;
          height: 200px;
          object-fit: cover;
        }
      }

      .book-info {
        .book-title {
          font-size: 16px;
          margin: 0 0 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .book-author,
        .book-category {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }

        .book-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
      }
    }
  }

  .pagination-section {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
