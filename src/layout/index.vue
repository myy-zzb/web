<template>

  <div :class="classObj" class="app-wrapper">
    <div class="page-title">
      <span>鸟类查询系统</span>
    </div>

    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{ hasTagsView: needTagsView }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.page-title {
  padding: 20px 0;
  /* 内边距 */
  background-color: #f0f9ff;
  /* 浅蓝色背景，营造轻松的氛围 */
  font-size: 28px;
  /* 字体大小更显著 */
  font-weight: bold;
  /* 加粗 */
  color: #005f99;
  /* 深蓝字体，凸显自然与科技感 */
  border-bottom: 3px solid #cce7ff;
  /* 浅蓝底部边框 */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  /* 添加阴影，增强视觉层次感 */
  position: sticky;
  /* 固定在页面顶部 */
  top: 0;
  /* 距顶部距离 */
  z-index: 10;
  /* 层级确保在最前 */
}

.page-title span {
  padding-left: 30px;
  font-family: 'Georgia', serif;
  /* 使用优雅的字体 */
  letter-spacing: 2px;
  /* 字母间距 */
  margin: 0;
  /* 清除默认外边距 */
  background: linear-gradient(to right, #6ec1e4, #005f99);
  /* 渐变文字颜色 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  /* 渐变文字透明填充 */
}

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>
