const test = resolve => {
    require.ensure(['@/views/test/index'], () => {
      resolve(require('@/views/test/index'))
    })
  }
  
  
  const testRouter = {
    routes: {
      test: {
        path: '/test',
        name: 'test',
        components: {
          default: test
        },
      },
    }
  }
  
  export default testRouter
  