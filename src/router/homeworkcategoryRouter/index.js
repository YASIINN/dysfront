const homeworkcategory = resolve => {
  require.ensure(['@/views/homeworkcategory/index'], () => {
    resolve(require('@/views/homeworkcategory/index'))
  })
}

const homeworkcategoryRouter = {
  routes: {
    homeworkcat: {
      path: '/homeworkcategory',
      name: 'hcat',
      components: {
        default: homeworkcategory
      }
    },
  }
}

export default homeworkcategoryRouter
