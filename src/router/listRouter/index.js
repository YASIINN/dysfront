const parents = resolve => {
  require.ensure(['@/views/parents/list'], () => {
    resolve(require('@/views/parents/list'))
  })
}


const listRouter = {
  routes: {
    parents: {
      path: '/parents',
      name: 'parents',
      components: {
        default: parents
      },
    },
  }
}

export default listRouter