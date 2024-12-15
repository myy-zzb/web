import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/', // 根路径
    component: Layout, // 使用 Layout 保持统一的布局
    redirect: '/map', // 默认重定向到 /map
    children: [
      {
        path: 'map', // 子路径 /map
        component: () => import('@/views/birds/map'), // 根路径页面
        name: 'BirdMap',
        meta: {
          title: '鸟类地图',
          icon: 'tree-table',
          noCache: true
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/bird-query',
    component: Layout,
    children: [
      {
        path: '', // 子路径为空
        component: () => import('@/views/birds/query'),
        name: 'BirdQuery',
        meta: {
          title: '鸟类识别',
          icon: 'eye-open'
        }
      }
    ]
  },
  {
    path: '/bird-list',
    component: Layout,
    children: [
      {
        path: '', // 子路径为空
        component: () => import('@/views/birds/list'),
        name: 'BirdList',
        meta: {
          title: '鸟类百科',
          icon: 'search'
        }
      }
    ]
  },
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: '错误页面',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: '错误日志', icon: 'bug' }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
