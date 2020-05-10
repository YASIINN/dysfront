const units = resolve => {
  require.ensure(['@/views/units/index'], () => {
    resolve(require('@/views/units/index'))
  })
}

const unitsRouter = {
  routes: {
    units: {
      meta: {
        breadCrumbs: [
          {
            to: '/units',            // hyperlink
            text: 'Kurum Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Birimler' // crumb text
          }
        ]
      },
      path: '/units',
      name: 'units',
      components: {
        default: units
      },
    },
  }
}

export default unitsRouter
