const province = resolve => {
  require.ensure(["@/views/province/index"], () => {
    resolve(require("@/views/province/index"));
  });
};
const title = resolve => {
  require.ensure(["@/views/title/index"], () => {
    resolve(require("@/views/title/index"));
  });
};
const activity = resolve => {
  require.ensure(["@/views/activity/index"], () => {
    resolve(require("@/views/activity/index"));
  });
};
const period = resolve => {
  require.ensure(["@/views/period/index"], () => {
    resolve(require("@/views/period/index"));
  });
};
const grade = resolve => {
  require.ensure(["@/views/grade/index"], () => {
    resolve(require("@/views/grade/index"));
  });
};
const agrades = resolve => {
  require.ensure(["@/views/activity/grade/index"], () => {
    resolve(require("@/views/activity/grade/index"));
  });
};
const aplessons = resolve => {
  require.ensure(["@/views/lessons/relation/activityperiod"], () => {
    resolve(require("@/views/lessons/relation/activityperiod"));
  });
};

const corporateRouter = {
  routes: {
    provinces: {
      path: "/Province",
      name: "Cprovince",
      meta: {
        breadCrumbs: [
          {
            to: '/province',            // hyperlink
            text: 'Kurum Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Branşlar' // crumb text
          }
        ]
      },
      components: {
        default: province
      }
    },
    titles: {
      path: "/Titles",
      name: "Ctitle",
      meta: {
        breadCrumbs: [
          {
            to: '/titles',            // hyperlink
            text: 'Kurum Yönetimi' // crumb text
          },
          {
            to: '',            // hyperlink
            text: 'Ünvanlar' // crumb text
          }
        ]
      },
      components: {
        default: title
      }
    },
    activities: {
      path: "/Activities",
      name: "activity",
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          },
          {
            to: '/activities',            // hyperlink
            text: 'Faaliyetler' // crumb text
          }
        ]
      },
      components: {
        default: activity
      }
    },
    periods: {
      path: "/periods",
      name: "period",
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          },
          {
            to: '/periods',            // hyperlink
            text: 'Faaliyet Haftaları' // crumb text
          }
        ]
      },
      components: {
        default: period
      }
    },
    grades: {
      path: "/grades",
      name: "grade",
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          },
          {
            to: '/grades',            // hyperlink
            text: 'Faaliyet Sınıfları' // crumb text
          }
        ]
      },
      components: {
        default: grade
      }
    },
    agrades: {
      path: "/activity/period/grades",
      name: "agrades",
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          },
          {
            to: '/activity/period/grades',            // hyperlink
            text: 'Faaliyet Sınıfları' // crumb text
          }
        ]
      },
      components: {
        default: agrades
      }
    },
    aplessons: {
      path: "/activity/period/lessons",
      name: "aplessons",
      meta: {
        breadCrumbs: [
          {
            to: '/activityperiodlist',            // hyperlink
            text: 'Faaliyet Yönetimi' // crumb text
          },
          {
            to: '/activity/period/lessons',            // hyperlink
            text: 'Faaliyet Dersleri' // crumb text
          }
        ]
      },
      components: {
        default: aplessons
      }
    }
  }
};

export default corporateRouter;
