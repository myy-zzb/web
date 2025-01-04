import Layout from '@/layout'

const UserInfoRouter = {
  path: '/user/info',
  component: Layout,
  redirect: '/user/info',
  name: 'userInfo',
  hidden: true,
  meta: {
    title: '个人信息',
    icon: 'user'
  },
  children: [
    {
      path: '/user/info',
      component: () => import('@/views/books/user/info'),
      name: 'userInfo',
      meta: { title: '个人信息' }
    }
  ]
}

export default UserInfoRouter
