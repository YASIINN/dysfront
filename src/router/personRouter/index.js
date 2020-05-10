const persons = resolve => {
  require.ensure(['@/views/persons/index'], () => {
    resolve(require('@/views/persons/index'))
  })
}
const createPerson = resolve => {
  require.ensure(['@/views/persons/create'], () => {
    resolve(require('@/views/persons/create'))
  })
}
const detailPerson = resolve => {
  require.ensure(['@/views/persons/persondetail'], () => {
    resolve(require('@/views/persons/persondetail'))
  })
}
const editPerson = resolve => {
  require.ensure(['@/views/persons/edit'], () => {
    resolve(require('@/views/persons/edit'))
  })
}
const teacherTimeTable = resolve => {
  require.ensure(['@/views/social/teachertimetable'], () => {
    resolve(require('@/views/social/teachertimetable'))
  })
}
const teacherDiscontinuity = resolve => {
  require.ensure(['@/views/social/teacherdiscontinuity'], () => {
    resolve(require('@/views/social/teacherdiscontinuity'))
  })
}

const personsRouter = {
  routes: {
    detailperson: {
      path: '/userdetail/:id',
      name: 'detailperson',
      meta: {
        breadCrumbs: [
          {
            to: '/persons',            // hyperlink
            text: 'Personel Yönetimi' // crumb text
          },
          {
            to: '/persons',            // hyperlink
            text: 'Personeller' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Personel Detayı' // crumb text
          }
        ]
      },
      components: {
        default: detailPerson
      },
    },
    editperson: {
      path: '/editperson/:id',
      name: 'editperson',
      components: {
        default: editPerson
      },
      meta: {
        breadCrumbs: [
          {
            to: '/persons',            // hyperlink
            text: 'Personel Yönetimi' // crumb text
          },
          {
            to: '/persons',            // hyperlink
            text: 'Personeller' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Personel Düzenle' // crumb text
          }
        ]
      },
    },
    personslist: {
      path: '/persons',
      name: 'persons',
      meta: {
        breadCrumbs: [
          {
            to: '/persons',            // hyperlink
            text: 'Personel Yönetimi'
          },
          {
            to: '/persons',            // hyperlink
            text: 'Personeller' // crumb text
          }]
      },
      components: {
        default: persons
      },
    },
    teachertimetable:{
      path:"/teacher-timetable",
      name:"teachertimetable",
      meta: { layout: 'post' },
      components: {
        default: teacherTimeTable
      }
    },
    teacherdiscontinuity:{
      path:"/teacher-discontinuity",
      name:"teacherdiscontiny",
      meta: { layout: 'post' },
      components: {
        default: teacherDiscontinuity
      }
    },
    createpersons: {
      path: '/createpersons',
      name: 'createpersons',
      meta: {
        breadCrumbs: [

          {
            to: '/persons',            // hyperlink
            text: 'Personel Yönetimi' // crumb text
          },
          {
          to: '/createpersons',            // hyperlink
          text: 'Personel Oluştur' // crumb text
        }]
      },
      components: {
        default: createPerson
      },
    },
  }
}

export default personsRouter
