const branches = resolve => {
  require.ensure(["@/views/branches/index"], () => {
    resolve(require("@/views/branches/index"));
  });
};

const branchesRouter = {
  routes: {
    branches: {
      path: "/branches",
      name: "branches",
      meta: {
        breadCrumbs: [
          {
            to: '/branches',            // hyperlink
            text: 'Kurum Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Şubeler' // crumb text
          }
        ]
      },
      components: {
        default: branches
      },
    },
  }
};

export default branchesRouter;
