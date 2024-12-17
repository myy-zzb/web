import Layout from '@/layout'

const NowBorrowRouter = {
  path: '/nowBorrow',
  component: Layout,
  redirect: '/nowBorrow/list',
  name: 'nowBorrow',
  meta: {
    title: '借阅记录',
    icon: 'book'
  },
  children: [
    {
      path: 'returnBook',
      component: () => import('@/views/books/nowBorrow/returnBook'),
      name: 'returnBook',
      meta: { title: '归还图书' }
    },
    {
      path: 'search',
      component: () => import('@/views/books/nowBorrow/search'),
      name: 'searchBook',
      meta: { title: '查询图书' }
    },
    {
      path: 'check',
      component: () => import('@/views/books/nowBorrow/check'),
      name: 'checkReturn',
      meta: { title: '确认归还', roles: ['admin'] }
    }

  ]
}

export default NowBorrowRouter
