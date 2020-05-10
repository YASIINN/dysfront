const activitystudents = resolve => {
  require.ensure(['@/views/activity/activitystudents'], () => {
    resolve(require('@/views/activity/activitystudents'))
  })
}
const activityemployees = resolve => {
  require.ensure(['@/views/activity/activityemployees'], () => {
    resolve(require('@/views/activity/activityemployees'))
  })
}
const activityparents = resolve => {
  require.ensure(['@/views/activity/activityparents'], () => {
    resolve(require('@/views/activity/activityparents'))
  })
}
const activityperiodlist = resolve => {
  require.ensure(['@/views/activity/activityperiodlist'], () => {
    resolve(require('@/views/activity/activityperiodlist'))
  })
}
const activityRouter = {
  routes: {
    activityperiodlist: {
      path: '/activityperiodlist',
      name: 'activityperiodlist',
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          }
        ]
      },
      components: {
        default: activityperiodlist
      },
    },
    activitystudents: {
      path: '/activity/students',
      name: 'activitystudents',
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          },
          {
            to: '/activity/students',            // hyperlink
            text: 'Faaliyet Öğrencileri' // crumb text
          }
        ]
      },
      components: {
        default: activitystudents
      },
    },
    activityemployees: {
      path: '/activity/employees',
      name: 'activityemployees',
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          },
          {
            to: '/activity/employees',            // hyperlink
            text: 'Faaliyet Personelleri' // crumb text
          }
        ]
      },
      components: {
        default: activityemployees
      },
    },
    activityparents: {
      path: '/activity/parents',
      name: 'activityparents',
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          },
          {
            to: '/activity/parents',            // hyperlink
            text: 'Faaliyet Velileri' // crumb text
          }
        ]
      },
      components: {
        default: activityparents
      },
    },

  }
}

export default activityRouter
