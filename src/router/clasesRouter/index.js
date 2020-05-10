const clases = resolve => {
  require.ensure(['@/views/clases/index'], () => {
    resolve(require('@/views/clases/index'))
  })
}

const clasesRouter = {
  routes: {
    clases: {
      path: '/clases',
      name: 'clases',
      meta: {
        breadCrumbs: [
          {
            to: '/clases',            // hyperlink
            text: 'Kurum Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Sınıflar' // crumb text
          }
        ]
      },
      components: {
        default: clases
      },
    },
  }
}

export default clasesRouter
