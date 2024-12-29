import Layout from '@/layout'

const BookReadRouter = {
  path: '/bookRead',
  component: Layout,
  redirect: '/bookRead/list',
  name: 'bookRead',
  meta: {
    title: '电子书阅读',
    icon: 'book'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/books/bookRead/list'),
      name: 'readBookList',
      meta: { title: '电子书列表' }
    },
    {
      path: '/bookRead/read:id',
      component: () => import('@/views/books/bookRead/read'),
      name: 'BookRead',
      meta: { title: '阅读电子书' }
    }
  ]
}

export default BookReadRouter
