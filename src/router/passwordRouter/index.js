const forgotpassword = resolve => {
  require.ensure(['@/views/resetpassword/index'], () => {
    resolve(require('@/views/resetpassword/index'))
  })
}

const passwordRouter = {
  routes: {
    forgot: {
      path: '/forgot-password',
      name: 'forgot',
      meta: { layout: "login" },
      components: {
        default: forgotpassword
      },
    },
  }
}

export default passwordRouter
