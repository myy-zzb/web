<template>
  <div id="app" class="map-container">
    <div ref="mapContainer" class="map" />

    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <span slot="title">{{ selectedBird.name }}</span>
      <div class="bird-details-dialog">
        <img :src="selectedBird.image" alt="bird" class="bird-image">
        <p><strong>栖息地:</strong> {{ selectedBird.habitat }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <div v-if="birdData.length" class="bird-info">
      <h2>鸟类栖息地</h2>
      <div v-for="(bird, index) in birdData" :key="index" class="bird-card">
        <img
          :src="bird.image"
          alt="bird"
          class="bird-image"
          @click="showBirdInfo(bird)"
        >
        <div class="bird-details">
          <h3>{{ bird.name }}</h3>
          <p><strong>栖息地:</strong> {{ bird.habitat }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import chinaMap from 'echarts/map/json/china.json'

export default {
  data() {
    return {
      birdData: [
        {
          name: '白鹭',
          habitat: '湿地、湖泊',
          coordinates: [116.40, 39.90], // 经度和纬度
          image: require('/images/白鹭.png') // 鸟类图片路径
        },
        {
          name: '丹顶鹤',
          habitat: '湿地',
          coordinates: [120.52, 31.45],
          image: require('/images/丹顶鹤.png')
        }
      ],
      dialogVisible: false, // 控制弹窗显示与否
      selectedBird: {} // 当前选中的鸟类信息
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
    // 注册中国地图
      echarts.registerMap('china', chinaMap)
      const myChart = echarts.init(this.$refs.mapContainer)

      const option = {
        geo: {
          map: 'china',
          roam: true,
          label: {
            emphasis: {
              show: false
            }
          }
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: this.birdData.map(bird => ({
              name: bird.name,
              value: [...bird.coordinates, 1], // 经纬度和权重值
              symbol: `image://${bird.image}`, // 使用图片作为标记
              symbolSize: 40,
              label: {
                formatter: bird.name,
                position: 'top',
                show: true
              }
            })),
            tooltip: {
              trigger: 'item',
              formatter: (params) => {
                const bird = this.birdData.find(b => b.name === params.name)
                return `${params.name}<br>栖息地: ${bird.habitat}`
              }
            }
          }
        ]
      }

      myChart.setOption(option)

      // 添加点击事件监听器
      myChart.on('click', (params) => {
        if (params.componentType === 'series') {
          const bird = this.birdData.find(b => b.name === params.name)
          if (bird) {
            this.showBirdInfo(bird)
          }
        }
      })
    },

    // 点击鸟类图片时显示信息
    showBirdInfo(bird) {
      this.selectedBird = bird
      this.dialogVisible = true // 显示弹窗
    },

    handleClose(done) {
      this.dialogVisible = false // 关闭弹窗
    }
  }

}
</script>

<style scoped>
/* 整体容器 */
.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f9;
  padding: 20px;
}

/* 地图容器 */
.map {
  width: 80%;
  height: 800px;
  border: 2px solid #ccc;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

/* 鸟类信息部分 */
.bird-info {
  width: 80%;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.bird-info h2 {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

/* 鸟类卡片 */
.bird-card {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fafafa;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.bird-card img.bird-image {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.bird-card .bird-details {
  flex: 1;
}

.bird-card .bird-details h3 {
  font-size: 20px;
  margin: 0;
  color: #444;
}

.bird-card .bird-details p {
  color: #666;
  font-size: 16px;
  margin: 5px 0;
}

/* 弹窗样式 */
.bird-details-dialog {
  display: flex;
  align-items: center;
}

.bird-details-dialog img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
}

.dialog-footer {
  text-align: center;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .map {
    width: 100%;
  }

  .bird-info {
    width: 100%;
  }
}
</style>
