const activityschedule = resolve => {
  require.ensure(['@/views/activityschedule/list'], () => {
    resolve(require('@/views/activityschedule/list'))
  })
}
const ascheduledetail = resolve => {
  require.ensure(['@/views/activityschedule/detail'], () => {
    resolve(require('@/views/activityschedule/detail'))
  })
}
const activityScheduleRouter = {
  routes: {
    activityschedule: {
      path: '/activityschedule',
      name: 'activityschedule',
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          },
          {
            to: '/activityschedule',            // hyperlink
            text: 'Faaliyet Program' // crumb text
          }
        ]
      },
      components: {
        default: activityschedule
      },
    },

    ascheduledetail:{
      path: '/activityschedule/:id',
      name: 'ascheduledetail',
      meta: {
        breadCrumbs: [
          {
            to: '/activityschedule',            // hyperlink
            text: 'Faaliyet Programı' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Faaliyet program detay' // crumb text
          }
        ]
      },
      components: {
        default: ascheduledetail
      },
    },

  }
}

export default activityScheduleRouter
