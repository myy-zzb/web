import Layout from '@/layout'

const BookBorrowRouter = {
  path: '/bookBorrow',
  component: Layout,
  redirect: '/bookBorrow/list',
  name: 'bookBorrow',
  meta: {
    title: '图书借阅',
    icon: 'book'
  },
  children: [
    {
      path: 'add',
      component: () => import('@/views/books/bookBorrow/add'),
      name: 'addBook',
      meta: { title: '新增图书', roles: ['admin'] }
    },
    {
      path: 'borrow',
      component: () => import('@/views/books/bookBorrow/borrow'),
      name: 'borrowBook',
      meta: { title: '借阅图书' }
    },
    {
      path: 'edit',
      component: () => import('@/views/books/bookBorrow/edit'),
      name: 'editBook',
      meta: { title: '编辑图书', roles: ['admin'] }
    },
    {
      path: 'search',
      component: () => import('@/views/books/bookBorrow/search'),
      name: 'searchBook',
      meta: { title: '查询图书' }
    }
  ]
}

export default BookBorrowRouter
