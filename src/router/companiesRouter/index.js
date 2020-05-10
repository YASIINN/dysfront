const company = resolve => {
  require.ensure(['@/views/company/index'], () => {
    resolve(require('@/views/company/index'))
  })
}

const companyRouter = {
  routes: {
    company: {
      meta: {
        breadCrumbs: [
          {
            to: '/company',            // hyperlink
            text: 'Kurum Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Şirketler' // crumb text
          }
        ]
      },
      path: '/company',
      name: 'company',
      components: {
        default: company
      },
    },
  }
}

export default companyRouter
