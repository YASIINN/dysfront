const schoolgrouplist = resolve => {
  require.ensure(['@/views/groups/school/list'], () => {
    resolve(require('@/views/groups/school/list'))
  })
}

const clubgrouplist = resolve => {
  require.ensure(['@/views/groups/club/list'], () => {
    resolve(require('@/views/groups/club/list'))
  })
}

const activitygrouplist = resolve => {
  require.ensure(['@/views/groups/activity/list'], () => {
    resolve(require('@/views/groups/activity/list'))
  })
}

const customgrouplist = resolve => {
  require.ensure(['@/views/groups/custom/list'], () => {
    resolve(require('@/views/groups/custom/list'))
  })
}
const groupmemberlist = resolve => {
  require.ensure(['@/views/groups/members/memberslist'], () => {
    resolve(require('@/views/groups/members/memberslist'))
  })
}

const groupRouter = {
  routes: {
    schoolgrouplist: {
      path: '/schoolgroup',
      name: 'schoolgroup',
      components: {
        default: schoolgrouplist,
      },
    },
    clubgrouplist: {
      path: '/clubgroup',
      name: 'clubgroup',
      components: {
        default: clubgrouplist,
      },
    },
    activitygrouplist: {
      path: '/activitygroup',
      name: 'activitygroup',
      components: {
        default: activitygrouplist,
      },
    },
    customgrouplist: {
      path: '/customgroup',
      name: 'customgroup',
      components: {
        default: customgrouplist,
      },
    },
    groupmemberlist: {
      path: '/groupmembers/:id',
      name: 'groupmembers',
      components: {
        default: groupmemberlist,
      },
    },
  }
}

export default groupRouter
