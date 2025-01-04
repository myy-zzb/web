import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import NewbookRouter from './modules/newbook'
import BookBorrowRouter from './modules/bookBorrow'
import BorrowRecordRouter from './modules/borrowRecord'
import NowBorrowRouter from './modules/nowBorrow'
import BookReadRouter from './modules/bookRead'
import UserRouter from './modules/user'
import UserInfoRouter from './modules/userinfo'
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
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/books/home'),
        name: 'HomePage',
        meta: {
          title: '首页',
          icon: 'tree-table',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/register',
    hidden: true,
    component: () => import('@/views/login/register')
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
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
  NewbookRouter,
  BookBorrowRouter,
  BorrowRecordRouter,
  NowBorrowRouter,
  BookReadRouter,
  UserRouter,
  UserInfoRouter,
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
