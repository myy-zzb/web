import Layout from '@/layout'

const BorrowRecordRouter = {
  path: '/borrowRecord',
  component: Layout,
  redirect: '/borrowRecord/list',
  name: 'borrowRecord',
  meta: {
    title: '借阅记录',
    icon: 'book'
  },
  children: [
    // {
    //   path: 'add',
    //   component: () => import('@/views/books/borrowRecord/add'),
    //   name: 'addRecord',
    //   meta: { title: '新增借阅记录' }
    // },
    {
      path: 'search',
      component: () => import('@/views/books/borrowRecord/search'),
      name: 'searchRecord',
      meta: { title: '查询借阅记录' }
    }
  ]
}

export default BorrowRecordRouter
