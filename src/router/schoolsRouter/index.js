import schoollist from '../../views/schools/schoollist'

const schoolslist = resolve => {
  require.ensure(['@/views/schools/schoollist'], () => {
    resolve(require('@/views/schools/schoollist'))
  })
}
const schools = resolve => {
  require.ensure(['@/views/schools/index'], () => {
    resolve(require('@/views/schools/index'))
  })
}
const clases = resolve => {
  require.ensure(['@/views/schools/clases'], () => {
    resolve(require('@/views/schools/clases'))
  })
}

const schoolsLesson = resolve => {
  require.ensure(['@/views/schools/lesson'], () => {
    resolve(require('@/views/schools/lesson'))
  })
}
const schollsPersons = resolve => {
  require.ensure(['@/views/schools/persons'], () => {
    resolve(require('@/views/schools/persons'))
  })
}
const schoolStudents = resolve => {
  require.ensure(['@/views/schools/students'], () => {
    resolve(require('@/views/schools/students'))
  })
}
const schoolProgram = resolve => {
  require.ensure(['@/views/schools/programs'], () => {
    resolve(require('@/views/schools/programs'))
  })
}
const schoolProgramDetail = resolve => {
  require.ensure(['@/views/schools/programdetail'], () => {
    resolve(require('@/views/schools/programdetail'))
  })
}

const schoolsRouter = {
  routes: {
    Schools: {
      path: '/Schools',
      name: 'schools',
      meta: {

        breadCrumbs: [
          {
            to: '/schools',            // hyperlink
            text: 'Okul  Yönetimi' // crumb text
          },
          {
            to: '/schools',            // hyperlink
            text: 'Okullar' // crumb text
          }],
      },
      components: {
        default: schools
      },
      children: [
        {
          path: '',
          component: schoollist,
          meta: {
            breadCrumbs: [{
              to: '/schools',            // hyperlink
              text: 'Okul Yönetimi' // crumb text
            },
              {
                to: '/schools',            // hyperlink
                text: 'Okullar' // crumb text
              }],
          },
        },
        {
          meta: {
            breadCrumbs: [
              {
                to: '/schools',            // hyperlink
                text: 'Okul Yönetimi' // crumb text
              },
              {
                to: '/schools',            // hyperlink
                text: 'Okullar' // crumb text
              },
              {
                to: '',            // hyperlink
                text: 'Ders Programı' // crumb text
              }
            ],
          },
          path: 'programs',
          component: schoolProgram
        },
        {
          meta: {
            breadCrumbs: [
              {
                to: '/schools',            // hyperlink
                text: 'Okul Yönetimi' // crumb text
              },
              {
                to: '/schools',            // hyperlink
                text: 'Okullar' // crumb text
              },
              {
                to: '/schools/programs',            // hyperlink
                text: 'Ders Programı' // crumb text
              },
              {
                to: '',            // hyperlink
                text: 'Ders Programı Detayları' // crumb text
              }
            ],
          },
          path: 'programs/:id/detail',
          component: schoolProgramDetail
        },
        {
          path: ':schoolid/clases',
          component: clases,
          meta: {
            breadCrumbs: [
              {
                to: '/schools',            // hyperlink
                text: 'Okullar' // crumb text
              },
              {
                to: '',            // hyperlink
                text: 'Sınıflar' // crumb text
              }
            ],
          },
        },
        {
          path: ':schoolid/lessons',
          meta: {
            breadCrumbs: [
              {
                to: '/schools',            // hyperlink
                text: 'Okullar' // crumb text
              },
              {
                to: '',            // hyperlink
                text: 'Dersler' // crumb text
              }
            ],
          },
          component: schoolsLesson
        },
        {

          path: ':schoolid/persons',
          meta: {
            breadCrumbs: [
              {
                to: '/schools',            // hyperlink
                text: 'Okullar' // crumb text
              },
              {
                to: '',            // hyperlink
                text: 'Personeller' // crumb text
              }
            ],
          },
          component: schollsPersons
        },
        {
          meta: {
            breadCrumbs: [
              {
                to: '/schools',            // hyperlink
                text: 'Okullar' // crumb text
              },
              {
                to: '',            // hyperlink
                text: 'Öğrenciler' // crumb text
              }
            ],
          },
          path: ':schoolid/students',
          component: schoolStudents
        },

      ]
    },
  }
}

export default schoolsRouter
