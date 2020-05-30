import axios from "axios";
import store from "@/store";
export default {
  state: {
    schoolGroupHeader: [
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
    async fetchSchoolGroup({commit}, payload){
      let response = await axios.post("/schoolgroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
    async fetchClassGroup({commit}, payload){
      let response = await axios.post("/classgroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
    async fetchBranchGroup({commit}, payload){
      let response = await axios.post("/branchgroup", payload, payload.httpOpt);
      console.log(response);
      return response;
    },
  },
  getters: {
    schoolgroupheader: (state)=>state.schoolGroupHeader,
  }
}
