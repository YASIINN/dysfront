const students = resolve => {
  require.ensure(['@/views/students/index'], () => {
    resolve(require('@/views/students/index'))
  })
}
const createStudent = resolve => {
  require.ensure(['@/views/students/studentcreate'], () => {
    resolve(require('@/views/students/studentcreate'))
  })
}
const detailStudent = resolve => {
  require.ensure(['@/views/students/studentdetail'], () => {
    resolve(require('@/views/students/studentdetail'))
  })
}
const studentdiscontity = resolve => {
  require.ensure(['@/views/social/studentdiscont'], () => {
    resolve(require('@/views/social/studentdiscont'))
  })
}
const studentschoolprogram = resolve => {
  require.ensure(['@/views/social/studentschoolprogram'], () => {
    resolve(require('@/views/social/studentschoolprogram'))
  })
}
const schoolsRouter = {
  routes: {
    students: {
      path: '/students',
      name: 'students',
      meta: {
        breadCrumbs: [
          {
            to: '/students',            // hyperlink
            text: 'Öğrenci Yönetimi' // crumb text
          },
          {
            to: '/students',            // hyperlink
            text: 'Öğrenciler' // crumb text
          }
        ]
      },
      components: {
        default: students
      },
    },
    studentdiscont:{
      path:"/student-discontinuity",
      name:"studentdiscontinuity",
      meta: { layout: 'post' },
      components: {
        default: studentdiscontity
      }
    },
    studentschoolprogram:{
      path:"/student-shool-program",
      name:"studentschoolprogram",
      meta: { layout: 'post' },
      components: {
        default: studentschoolprogram
      }
    },
    createstudent:{
      path: '/createstudent',
      name: 'createstudent',
      meta: {
        breadCrumbs: [
          {
            to: '/students',            // hyperlink
            text: 'Öğrenci Yönetimi' // crumb text
          },
          {
            to: '/students',            // hyperlink
            text: 'Öğrenciler' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Öğrenci Ekle' // crumb text
          }
        ]
      },
      components: {
        default: createStudent
      },
    },
    detailstudent:{
      path: '/students/:id',
      name: 'detailstudent',
      meta: {
        breadCrumbs: [
          {
            to: '/students',            // hyperlink
            text: 'Öğrenci Yönetimi' // crumb text
          },
          {
            to: '/students',            // hyperlink
            text: 'Öğrenciler' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Öğrenci Detayı' // crumb text
          }
        ]
      },
      components: {
        default: detailStudent
      },
    },
  }
}

export default schoolsRouter
