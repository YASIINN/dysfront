const teamList = resolve => {
  require.ensure(['@/views/team/index'], () => {
    resolve(require('@/views/team/index'))
  })
}

const teamRouter = {
  routes: {
    teamList: {
      path: '/teams',
      name: 'team',
      meta: {
        breadCrumbs: [
          {
            to: '/sporclub',            // hyperlink
            text: 'Spor Kulübü Yönetimi' // crumb text
          },
          {
            to: '/teams',            // hyperlink
            text: 'Takımlar' // crumb text
          },
        ]
      },
      components: {
        default: teamList
      }
    },
  }
}

export default teamRouter
