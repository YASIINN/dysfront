const discountityList = resolve => {
  require.ensure(['@/views/discountitiy/index'], () => {
    resolve(require('@/views/discountitiy/index'))
  })
}
const createDiscountity = resolve => {
  require.ensure(['@/views/discountitiy/create'], () => {
    resolve(require('@/views/discountitiy/create'))
  })
}

const discountitiyRouter = {
  routes: {
    discountityList: {
      path: '/Discontinuity',
      name: 'discountity',
      meta: {
        breadCrumbs: [
          {
            to: '',            // hyperlink
            text: 'Devamsızlık Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Devamsızlıklar' // crumb text
          }
        ]
      },
      components: {
        default: discountityList
      }
    },
    discountityCreate: {
      path: '/Creatediscontinuity',
      name: 'creatediscountity',
      meta: {
        breadCrumbs: [
          {
            to: '',            // hyperlink
            text: 'Devamsızlık Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Devamsızlık Oluştur' // crumb text
          }
        ]
      },
      components: {
        default: createDiscountity
      }
    }
  }
}

export default discountitiyRouter
