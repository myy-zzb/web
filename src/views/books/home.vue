<template>
  <div class="dashboard-container">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <svg-icon icon-class="book" class="card-icon" />
            <div class="data-content">
              <div class="data-title">总藏书量</div>
              <div class="data-number">{{ totalBooks }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <svg-icon icon-class="peoples" class="card-icon" />
            <div class="data-content">
              <div class="data-title">借阅人数</div>
              <div class="data-number">{{ borrowUsers }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <svg-icon icon-class="message" class="card-icon" />
            <div class="data-content">
              <div class="data-title">今日借出</div>
              <div class="data-number">{{ todayBorrow }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="data-item">
            <svg-icon icon-class="list" class="card-icon" />
            <div class="data-content">
              <div class="data-title">待归还</div>
              <div class="data-number">{{ pendingReturn }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作区 -->
    <el-row :gutter="20" class="operation-area">
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header">
            <span>快捷操作</span>
          </div>
          <div class="operation-buttons">
            <el-button style="display: block; margin-left: 10px;" type="primary" @click="$router.push('/newBook/borrow')">
              <svg-icon icon-class="search" /> 图书查询
            </el-button>
            <el-button style="display: block;" type="success" @click="$router.push('/newBook/borrow')">
              <svg-icon icon-class="list" /> 借阅图书
            </el-button>
            <el-button style="display: block;" type="warning" @click="$router.push('/nowBorrow/returnBook')">
              <svg-icon icon-class="list" /> 归还图书
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 最近借阅记录 -->
      <el-col :span="16">
        <el-card shadow="hover">
          <div slot="header">
            <span>最近借阅记录</span>
          </div>
          <el-table :data="recentBorrows" style="width: 100%">
            <el-table-column prop="book_title" label="书名" width="180" />
            <el-table-column prop="user_name" label="借阅人" width="120" />
            <el-table-column prop="borrow_date" label="借阅时间" width="180" />
            <el-table-column prop="day" label="借阅期限（天）" width="180" />
            <el-table-column prop="ying_return_date" label="应还时间" width="180" />
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === '已归还' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增图书推荐和借阅排行 -->
    <el-row :gutter="20" class="book-stats">
      <!-- 每日推荐 -->
      <el-col :span="12">
        <el-card shadow="hover" class="daily-recommend">
          <div slot="header">
            <span>每日图书推荐</span>
          </div>
          <el-carousel height="240px" indicator-position="outside">
            <el-carousel-item v-for="book in recommendBooks" :key="book.id">
              <div class="book-recommend">
                <div class="book-cover">
                  <img :src="book.cover" alt="book cover">
                </div>
                <div class="book-info">
                  <h3>{{ book.name }}</h3>
                  <p class="author">作者：{{ book.author }}</p>
                  <p class="description">{{ book.description }}</p>
                  <el-rate
                    v-model="book.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}"
                  />
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </el-card>
      </el-col>

      <!-- 借阅排行 -->
      <el-col :span="12">
        <el-card shadow="hover" class="borrow-rank">
          <div slot="header">
            <span>借阅排行榜</span>
            <el-radio-group v-model="rankType" size="small" style="float: right">
              <el-radio-button label="week">周榜</el-radio-button>
              <el-radio-button label="month">月榜</el-radio-button>
            </el-radio-group>
          </div>
          <div class="rank-list">
            <div v-for="(book, index) in borrowRanks" :key="index" class="rank-item">
              <span class="rank-number" :class="{'top-three': index < 3}">{{ index + 1 }}</span>
              <span class="book-name">{{ book.name }}</span>
              <span class="borrow-count">{{ book.count }}次</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'BooksDashboard',
  data() {
    return {
      totalBooks: 2000,
      borrowUsers: 150,
      todayBorrow: 25,
      pendingReturn: 85,
      recentBorrows: [],
      recommendBook: {
        cover: 'https://example.com/book-cover.jpg', // 替换为实际的图片地址
        name: '人类简史',
        author: '尤瓦尔·赫拉利',
        description: '这是一部讲述人类如何从史前发展至今的精彩著作，融合了历史、科学、哲学等多个领域的知识。',
        rating: 4.5
      },
      rankType: 'week',
      borrowRanks: [
        { name: '深入理解计算机系统', count: 156 },
        { name: '算法导论', count: 142 },
        { name: '设计模式', count: 98 },
        { name: 'JavaScript高级程序设计', count: 87 },
        { name: '数据结构与算法分析', count: 76 }
      ],
      recommendBooks: [
        {
          id: 1,
          cover: require('@/assets/images/活着.png'),
          name: '活着',
          author: '余华',
          description: '《活着》是作家余华的代表作，讲述了农村人福贵悲惨的人生遭遇。福贵先是个阔少爷，后来一赌倾家荡产，沦为佃农。他经历了战争、土改、人民公社、"文革"等历史大事件，身边的亲人一个接一个地死去，最后只剩下他和一头老牛相依为命。',
          rating: 4.9
        },
        {
          id: 2,
          cover: require('@/assets/images/三体.png'),
          name: '三体（全集）',
          author: '刘慈欣',
          description: '三体是中国科幻文学的代表作，讲述了地球文明与三体文明的信息交流、生死搏杀及两个文明在宇宙中的兴衰历程。其对人性的深刻洞察和对宇宙文明的大胆想象，让人叹为观止。',
          rating: 4.8
        },
        {
          id: 3,
          cover: require('@/assets/images/人类简史.png'),
          name: '人类简史',
          author: '尤瓦尔·赫拉利',
          description: '这是一部讲述人类如何从史前发展至今的精彩著作，融合了历史、科学、哲学等多个领域的知识。作者用宏大的视角，重新解读人类发展史，让人类重新认识自己。',
          rating: 4.6
        }
      ]
    }
  },
  created() {
    this.getRecentBorrows()
  },
  methods: {
    getRecentBorrows() {
      const url = 'http://localhost:8696/librarymasts/BorrowRecordController/findRecordById'
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'keyWords': this.$store.state.user.name,
          'pageNum': 1,
          'pageSize': 10
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('获取数据失败')
          }
          return response.json()
        })
        .then(data => {
          if (data.data.pageInfo.pageData.length > 0) {
            this.recentBorrows.push(data.data.pageInfo.pageData[0])
            if (this.recentBorrows[0].status === 'returned') {
              this.recentBorrows[0].status = '已归还'
            } else {
              this.recentBorrows[0].status = '借阅中'
            }

            this.recentBorrows[0].ying_return_date = '0'
            // 计算应还日期
            const borrowDate = new Date(this.recentBorrows[0].borrow_date)
            const returnDate = new Date(borrowDate)
            returnDate.setDate(returnDate.getDate() + this.recentBorrows[0].day)
            // 格式化日期为 YYYY-MM-DD 格式
            const year = returnDate.getFullYear()
            const month = String(returnDate.getMonth() + 1).padStart(2, '0')
            const day = String(returnDate.getDate()).padStart(2, '0')
            this.recentBorrows[0].ying_return_date = `${year}-${month}-${day}`
            console.log(this.recentBorrows[0])
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .data-item {
    display: flex;
    align-items: center;

    .card-icon {
      font-size: 48px;
      padding: 10px;
      color: #409EFF;
    }

    .data-content {
      margin-left: 15px;

      .data-title {
        font-size: 14px;
        color: #909399;
      }

      .data-number {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
      }
    }
  }

  .operation-area {
    margin-top: 20px;

    .operation-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding-right: 15px;

      .el-button {
        width: 100%;
      }
    }
  }

  .book-stats {
    margin-top: 20px;

    .daily-recommend {
      .el-carousel {
        margin: -20px;

        .el-carousel__container {
          padding: 20px;
        }

        .book-recommend {
          height: 100%;
          display: flex;
          gap: 20px;
          padding: 0 20px;

          .book-cover {
            width: 140px;
            height: 200px;
            overflow: hidden;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
            border-radius: 4px;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .book-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;

            h3 {
              margin: 0 0 10px 0;
              font-size: 20px;
              color: #303133;
            }

            .author {
              color: #666;
              margin-bottom: 15px;
              font-size: 14px;
            }

            .description {
              font-size: 14px;
              color: #666;
              line-height: 1.6;
              display: -webkit-box;
              -webkit-line-clamp: 4;
              line-clamp: 4;
              -webkit-box-orient: vertical;
              overflow: hidden;
              margin-bottom: 15px;
            }
          }
        }
      }
    }

    .borrow-rank {
      .rank-list {
        .rank-item {
          display: flex;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }

          .rank-number {
            width: 24px;
            height: 24px;
            line-height: 24px;
            text-align: center;
            background: #f0f0f0;
            border-radius: 4px;
            margin-right: 12px;
            font-size: 14px;

            &.top-three {
              color: #fff;
              &:nth-child(1) { background: #f5222d; }
              &:nth-child(2) { background: #fa8c16; }
              &:nth-child(3) { background: #faad14; }
            }
          }

          .book-name {
            flex: 1;
            font-size: 14px;
          }

          .borrow-count {
            color: #999;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
