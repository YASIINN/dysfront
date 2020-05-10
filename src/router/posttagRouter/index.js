

const posttags = resolve => {
  require.ensure(["@/views/posttag/index"], () => {
    resolve(require("@/views/posttag/index"));
  });
};

const posttagRouter = {
  routes: {
    posttag:{
      path:"/posttags",
      name:"posttags",
      components: {
        default:posttags
      }
    }
  }
};

export default posttagRouter;
