const social = resolve => {
  require.ensure(['@/views/post/index'], () => {
    resolve(require('@/views/post/index'))
  })
}

const mypost = resolve => {
  require.ensure(['@/views/post/userpost'], () => {
    resolve(require('@/views/post/userpost'))
  })
}

const postlikes = resolve => {
  require.ensure(['@/views/post/postlikes'], () => {
    resolve(require('@/views/post/postlikes'))
  })
}
const postviews = resolve => {
  require.ensure(['@/views/post/postviews'], () => {
    resolve(require('@/views/post/postviews'))
  })
}
const postdetails = resolve => {
  require.ensure(['@/views/post/postdetail'], () => {
    resolve(require('@/views/post/postdetail'))
  })
}
const allnotification = resolve => {
  require.ensure(['@/views/post/notificationlist'], () => {
    resolve(require('@/views/post/notificationlist'))
  })
}
const specialnotes = resolve => {
  require.ensure(['@/views/social/specialnotes'], () => {
    resolve(require('@/views/social/specialnotes'))
  })
}

const postRouter = {
  routes: {
    test: {
      path: '/social',
      name: 'social',
      meta: { layout: 'post' },
      components: {
        default: social
      }
    },
    specialnotes: {
      path: '/special-notes',
      name: 'specialnotes',
      meta: { layout: 'post' },
      components: {
        default: specialnotes
      }
    },
    userpost: {
      path: '/myposts',
      name: 'mposts',
      meta: { layout: 'post' },
      components: {
        default: mypost
      }
    },
    postlikes: {
      path: '/postlikes/:id',
      name: 'plikes',
      meta: { layout: 'post' },
      components: {
        default: postlikes
      }
    },
    postViews: {
      path: '/postviews/:id',
      name: 'pview',
      meta: { layout: 'post' },
      components: {
        default: postviews
      }
    },
    postallnotification:{
      path: '/allnotification',
      name: 'allntf',
      meta: { layout: 'post' },
      components: {
        default: allnotification
      }
    },
    postDetail: {
      path: '/postdetail/:id',
      name: 'pdetail',
      meta: { layout: 'post' },
      components: {
        default: postdetails
      }
    }
  }
}

export default postRouter
