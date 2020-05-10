const scBranches = resolve => {
  require.ensure(['@/views/sporclubbranches/index'], () => {
    resolve(require('@/views/sporclubbranches/index'))
  })
}

const scBranchesRouter = {
  routes: {
    scBranches: {
      path: '/scBranches',
      name: 'scbranches',
      meta: {
        breadCrumbs: [
          {
            to: '/sporclub',            // hyperlink
            text: 'Spor Kulübü Yönetimi' // crumb text
          },
          {
            to: '/scbranches',            // hyperlink
            text: 'Şubeler' // crumb text
          },
        ]
      },
      components: {
        default: scBranches
      }
    },
  }
}

export default scBranchesRouter
