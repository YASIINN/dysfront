import axios from "axios";
import store from "@/store";
export default {
  state: {
    activityGroupHeader: [
      {
        name: "__sequence",
        title: "#",
        titleClass: "center aligned",
        dataClass: "right aligned"
      },
      {
        name: "name",
        title: '<i class="fas fa-lightbulb"></i>Grup Adı'
      },
      {
        name: "code",
        title: '<i class="fas fa-lightbulb"></i>Grup Kodu'
      },
      {
        name: "__slot:actions",
        title: '<i class="fas fa-pen-fancy"></i>İşlemler'
      }
    ],
  },
  mutations: {
  },
  actions: {
    async fetchActivityGroup({commit}, payload){
      let response = await axios.post("/activitygroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
    async fetchActivityPeriodGroup({commit}, payload){
      let response = await axios.post("/activityperiodgroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
    async fetchActivityGradeGroup({commit}, payload){
      let response = await axios.post("/activitygradegroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
  },
  getters: {
    activitygroupheader: (state)=>state.activityGroupHeader,
  }
}
