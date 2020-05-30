let days = [
  {
    dayName: 'Pazartesi'
  },
  {
    dayName: 'Salı'
  },
  {
    dayName: 'Çarşamba'
  },
  {
    dayName: 'Perşembe'
  },
  {
    dayName: 'Cuma'
  },
  {
    dayName: 'Cumartesi'
  },
  {
    dayName: 'Pazar'
  }
]
const Colors = [
  ['#F64272', '#8b5aff', '#51e5db', '#ffa51a', '#FFCCD5'],
  ['#0320fc', '#fc0314', '#fc036b', '#fc03db', '#c203fc'],
  ['#03fcf4', '#03fc88', '#03fc07', '#94fc03', '#d7fc03'],
  ['#fc8c03', '#fc4503', '#fc1403', '#000000', '#a19494']
]
let socialRouteData = [
  {
    class: 'text-info',
    icon: 'fa fa-home',
    label: 'AnaSayfa',
    route: '/social',
    subRoute: [],
    hashfragment: ''
  },
  {
    class: 'text-primary',
    icon: 'fa fa-calendar-alt',
    label: 'Ajanda',
    route: '/agenda',
    subRoute: [],
    hashfragment: ''
  },
  {
    class: 'text-danger',
    icon: 'fa fa-home',
    label: 'Ders Programı',
    route: '/teacher-timetable',
    subRoute: [],
    hashfragment: ''
  },
  {
    class: 'text-warning',
    icon: 'fa fa-share',
    label: 'Gönderilerim',
    route: '/myposts',
    subRoute: [],
    hashfragment: ''
  },
  {
    class: 'text-info',
    icon: 'fa fa-home',
    label: 'Ödevler ',
    route: '/uc',
    subRoute: [],
    hashfragment: ''
  },
  {
    class: 'text-info',
    icon: 'fa fa-home',
    label: 'Ders Programı 2 Öğrenci ',
    route: '/student-shool-program',
    subRoute: [],
    hashfragment: ''
  },
  {
    class: 'text-primary',
    icon: 'fa fa-eye',
    label: 'Yoklama Al ',
    route: '/teacher-discontinuity',
    subRoute: [],
    hashfragment: ''
  },
  {
    class: 'text-primary',
    icon: 'fa fa-home',
    label: 'Devamsızlıklar ',
    route: '/student-discontinuity',
    subRoute: [],
    hashfragment: ''
  },
]
let routeData = [
  {
    class: 'text-primary',
    icon: 'fa fa-home',
    label: 'Kurum Yönetimi',
    route: '',
    subRoute: [
      {
        label: 'Şirketler',
        route: '/company',
        class: ''
      },
      {
        label: 'Ünvanlar',
        route: '/titles',
        class: ''
      },
      {
        label: 'Branşlar',
        route: '/province',
        class: ''
      },
      {
        label: 'Sınıflar',
        route: '/clases',
        class: ''
      },
      {
        label: 'Şubeler',
        route: '/branches',
        class: ''
      },
      {
        label: 'Birimler',
        route: '/units',
        class: ''
      },
      {
        label: 'Dersler',
        route: '/lessons',
        class: ''
      }
    ],
    hashfragment: 'corparate'
  },

  {
    class: "text-indigo",
    icon: "fa fa-home",
    label: "Grup Yönetimi",
    route: "",
    subRoute: [
      {
        label: "Okul Grupları",
        route: "/schoolgroup",
        class: ""
      },
      {
        label: "Spor Kulübü Grupları",
        route: "/clubgroup",
        class: ""
      },
      {
        label: "Faaliyet Grupları",
        route: "/activitygroup",
        class: ""
      },
      {
        label: "Özel Gruplar",
        route: "/customgroup",
        class: ""
      }
    ],
    hashfragment: "schoolgroup"
  },
  {
    class: 'text-info',
    icon: 'fa fa-home',
    label: 'Okul Yönetimi',
    route: '',
    subRoute: [
      {
        label: 'Okullar',
        route: '/schools',
        class: ''
      },
      {
        label: 'Ders Programı',
        route: '/schools/programs',
        class: ''
      }
    ],
    hashfragment: 'schools'
  },
  {
    class: 'text-info',
    icon: 'fa fa-home',
    label: 'Devamsızlık Yönetimi',
    route: '',
    subRoute: [
      {
        label: 'Devamsızlıklar',
        route: '/Discontinuity',
        class: ''
      },
      {
        label: 'Devamsızlık Ekle',
        route: '/Creatediscontinuity',
        class: ''
      },
      {
        label: 'Devamsızlık Türleri',
        route: '/Dtype',
        class: ''
      },
    ],
    hashfragment: 'discontinuity'
  },
  {
    class: 'text-success',
    icon: 'fa fa-home',
    label: 'Faaliyet Yönetimi',
    route: '',
    subRoute: [
      {
        label: 'Faaliyet Hafta Yönetimi',
        route: '/activityperiodlist',
        class: ''
      },
      {
        label: 'Faaliyetler',
        route: '/activities',
        class: ''
      },
      {
        label: 'Haftalar',
        route: '/periods',
        class: ''
      },
      {
        label: 'Gruplar',
        route: '/grades',
        class: ''
      },
      {
        label: 'Faaliyet Programı',
        route: '/activityschedule',
        class: ''
      }
    ],
    hashfragment: 'activity'
  },

  {
    class: 'text-danger',
    icon: 'fa fa-futbol',
    label: 'Spor Kulübü Yönetimi',
    route: '',
    subRoute: [
      {
        label: 'Spor Kulübü',
        route: '/sporclub',
        class: ''
      },
      {
        label: 'Spor Kulübü Takımları',
        route: '/teams',
        class: ''
      },
      {
        label: 'Spor Kulübü Şubeleri',
        route: '/scbranches',
        class: ''
      },
      {
        label: 'Spor Kulubü Programı',
        route: '/clubschedule',
        class: ''
      },
    ],
    hashfragment: 'club'
  },
  {
    class: 'text-success',
    icon: 'fa fa-user',
    label: 'Personel Yönetimi',
    route: '',
    subRoute: [
      {
        label: 'Personeller',
        route: '/persons',
        class: ''
      },
      {
        label: 'Personel Ekle',
        route: '/createpersons',
        class: ''
      }
    ],
    hashfragment: 'persons'
  },
  {
    class: 'text-primary',
    icon: 'fa fa-user',
    label: 'Öğrenci Yönetimi',
    route: '',
    subRoute: [
      {
        label: 'Öğrenciler',
        route: '/students',
        class: ''
      },
      {
        label: 'Öğrenci Ekle',
        route: '/createstudent',
        class: ''
      }
    ],
    hashfragment: 'students'
  },
  {
    class: 'text-dark',
    icon: 'fa fa-user',
    label: 'Veli Yönetimi',
    route: '',
    subRoute: [
      {
        label: 'Veliler',
        route: '/parents',
        class: ''
      }
    ],
    hashfragment: 'parents'
  }
]
export { routeData, days, socialRouteData,Colors }
