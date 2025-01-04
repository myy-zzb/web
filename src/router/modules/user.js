import Layout from '@/layout'

const UserRouter = {
  path: '/user',
  component: Layout,
  redirect: '/user/list',
  name: 'user',
  meta: {
    title: '用户管理',
    icon: 'user',
    roles: ['admin']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/books/user/list'),
      name: 'userList',
      meta: { title: '用户列表', roles: ['admin'] }
    }
  ]
}

export default UserRouter
