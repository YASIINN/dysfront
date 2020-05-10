const lessons = resolve => {
  require.ensure(['@/views/lessons/index'], () => {
    resolve(require('@/views/lessons/index'))
  })
}

const lessonRouter = {
  routes: {
    lessons: {
      path: '/lessons',
      name: 'lessons',
      meta: {
        breadCrumbs: [
          {
            to: '/lessons',            // hyperlink
            text: 'Kurum Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Dersler' // crumb text
          }
        ]
      },
      components: {
        default: lessons
      },
    },
  }
}

export default lessonRouter
