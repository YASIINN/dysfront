const userLogin = resolve => {
  require.ensure(["@/views/login/index"], () => {
    resolve(require("@/views/login/index"));
  });
};

const userRouter = {
  routes: {
    Login: {
      path: "/Login",
      name: "userlogin",
      meta: { layout: "login" },
      components: {
        default: userLogin
      }
    }
  }
};

export default userRouter;
