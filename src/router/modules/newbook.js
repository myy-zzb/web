import Layout from '@/layout'

const NewbookRouter = {
  path: '/newbook',
  component: Layout,
  redirect: '/newbook/list',
  name: 'Newbook',
  meta: {
    title: '新书上架',
    icon: 'list'
  },
  children: [
    // {
    //   path: 'search',
    //   component: () => import('@/views/books/newBook/search'),
    //   name: 'searchBook',
    //   meta: { title: '查询图书' }
    // },
    {
      path: 'borrow',
      component: () => import('@/views/books/newBook/borrow'),
      name: 'borrowBook',
      meta: { title: '借阅书籍' }
    }
  ]
}

export default NewbookRouter
