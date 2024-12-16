<template>
  <div class="bird-encyclopedia">
    <h1>鸟类百科</h1>

    <!-- 表格展示鸟类信息 -->
    <el-table
      :data="birdData"
      style="width: 100%"
      border
    >
      <el-table-column
        label="鸟类名称"
        prop="name"
        width="180"
      />
      <el-table-column
        label="图片"
        prop="image"
        width="180"
      >
        <template slot-scope="scope">
          <img :src="scope.row.image" alt="bird-image" class="bird-image">
        </template>
      </el-table-column>
      <el-table-column
        label="栖息地"
        prop="habitat"
      />
      <el-table-column
        label="特点"
        prop="features"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      birdData: [
        {
          name: '白鹭',
          image: require('/images/白鹭.png'),
          habitat: '湿地、湖泊',
          features: '白色羽毛，长腿，长嘴'
        },
        {
          name: '蓝鹳',
          image: require('/images/蓝鹳.png'),
          habitat: '河流、沼泽',
          features: '蓝色羽毛，修长脖子'
        },
        {
          name: '朱鹮',
          image: require('/images/朱鹮.png'),
          habitat: '沼泽、湿地',
          features: '红色面部，长弯嘴'
        }
        // 添加更多鸟类数据...
      ]
    }
  }
}
</script>

<style scoped>
.bird-encyclopedia {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
}

.bird-image {
  width: 100px;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
}
</style>
