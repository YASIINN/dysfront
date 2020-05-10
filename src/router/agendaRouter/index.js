const agenda = resolve => {
  require.ensure(['@/views/agenda/index'], () => {
    resolve(require('@/views/agenda/index'))
  })
}

const agendaRouter = {
  routes: {
    agenda: {
      path: '/agenda',
      name: 'useragenda',
      meta: { layout: 'post' },
      components: {
        default: agenda
      }
    }
  }
}

export default agendaRouter
