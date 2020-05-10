const sporClub = resolve => {
  require.ensure(['@/views/sporclub/index'], () => {
    resolve(require('@/views/sporclub/index'))
  })
}
const sporClubDetail = resolve => {
  require.ensure(['@/views/sporclub/detail'], () => {
    resolve(require('@/views/sporclub/detail'))
  })
}

const sporclubRouter = {
  routes: {
    sporClub: {
      path: '/sporclub',
      name: 'sporclub',
      meta: {
        breadCrumbs: [
          {
            to: '/sporclub',            // hyperlink
            text: 'Spor Kulübü Yönetimi' // crumb text
          },
          {
            to: '/persons',            // hyperlink
            text: 'Spor Kulübü' // crumb text
          },
        ]
      },
      components: {
        default: sporClub
      }
    },
    sporClubDetail: {
      meta: {
        breadCrumbs: [
          {
            to: '/sporclub',            // hyperlink
            text: 'Spor Kulübü Yönetimi' // crumb text
          },
          {
            to: '/persons',            // hyperlink
            text: 'Spor Kulübü' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Spor Kulübü Detayı' // crumb text
          }
        ]
      },
      path: '/sporclub/:id',
      name: 'sporclub',
      components: {
        default: sporClubDetail
      }
    }
  }
}

export default sporclubRouter
