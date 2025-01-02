import Layout from '@/layout'

const BookReadRouter = {
  path: '/bookRead',
  component: Layout,
  redirect: '/bookRead/list',
  name: 'bookRead',
  meta: {
    title: '电子书阅读',
    icon: 'form'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/books/bookRead/list'),
      name: 'readBookList',
      meta: { title: '电子书列表', roles: ['editor'] }
    },
    {
      path: '/bookRead/read:id',
      component: () => import('@/views/books/bookRead/read'),
      name: 'BookRead',
      meta: { title: '阅读电子书', roles: ['editor'] }
    }
  ]
}

export default BookReadRouter
