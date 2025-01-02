import Layout from '@/layout'

const BookBorrowRouter = {
  path: '/bookBorrow',
  component: Layout,
  redirect: '/bookBorrow/list',
  name: 'bookBorrow',
  meta: {
    title: '图书借阅',
    icon: 'education',
    roles: ['admin']
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
      meta: { title: '编辑图书', roles: ['admin'] }
    },
    {
      path: 'edit:title',
      component: () => import('@/views/books/bookBorrow/edit'),
      name: 'editBook',
      hidden: true,
      meta: { title: '编辑图书', roles: ['admin'] }
    }
  ]
}

export default BookBorrowRouter
