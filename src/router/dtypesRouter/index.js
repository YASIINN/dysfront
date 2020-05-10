const dtypes = resolve => {
  require.ensure(['@/views/dtypes/index'], () => {
    resolve(require('@/views/dtypes/index'))
  })
}

const dtypesRouter = {
  routes: {
    dtypes: {
      path: '/Dtype',
      name: 'dTypes',
      meta: {
        breadCrumbs: [
          {
            to: '',            // hyperlink
            text: 'Devamsızlık Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Devamsızlık Türleri' // crumb text
          }
        ]
      },
      components: {
        default: dtypes
      }
    },
  }
}

export default dtypesRouter
