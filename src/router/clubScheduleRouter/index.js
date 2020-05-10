const clubschedule = resolve => {
  require.ensure(['@/views/clubschedule/list'], () => {
    resolve(require('@/views/clubschedule/list'))
  })
}
const clubscheduledetail = resolve => {
  require.ensure(['@/views/clubschedule/detail'], () => {
    resolve(require('@/views/clubschedule/detail'))
  })
}
const clubScheduleRouter = {
  routes: {
    clubschedule: {
      path: '/clubschedule',
      name: 'clubschedule',
      meta: {
        breadCrumbs: [
          {
            to: '/sporclub',            // hyperlink
            text: 'Spor Kulubü' // crumb text
          },
          {
            to: '/clubschedule',            // hyperlink
            text: 'Spor Kulubü Programı' // crumb text
          }
        ]
      },
      components: {
        default: clubschedule
      },
    },

    cscheduledetail:{
      path: '/clubschedule/:id',
      name: 'cscheduledetail',
      meta: {
        breadCrumbs: [
          {
            to: '/sporclub',            // hyperlink
            text: 'Spor Kulubü' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Spor Kulubü program detay' // crumb text
          }
        ]
      },
      components: {
        default: clubscheduledetail
      },
    },

  }
}

export default clubScheduleRouter
