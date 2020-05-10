import axios from "axios";
import store from "@/store";
import Vue from "vue";
export default {
  state: {
    clubpcontents: [],
    schoolpcontents: [],
    cpteachercontents: [],
    cpscheduleteachers: [],

  },
  mutations: {
    setClubPContents(state, data) {
      state.clubpcontents = data;
    },
    setSchdsoolPContents(state, data) {
      state.schoolpcontents = data;
    },
    setClubPTeacherContents(state, data) {
      state.cpteachercontents = data;
    },
    setClubScheduleTeachers(state, data) {
      state.cpscheduleteachers = data;
    },
    addClubPContents(state, data) {
      // Vue.set(state.clubpcontents, state.clubpcontents.length - 1, data);
      state.clubpcontents = [...state.clubpcontents, data];
    },
    async updateClubPContents(state, data) {
      var index = state.clubpcontents.findIndex(ac=>ac.id === data.id);
      if (index > -1) {
        state.clubpcontents.splice(index, 1);
      }
    },
  },
  actions: {
    async fetchClubPContents({ commit }, payload) {
      let result = 0;
      let response = await axios.post("/getclubpcontents", payload);
      console.log(response);
      if (response.status == 200) {
        result = 1;
        commit("setClubPContents", response.data);
      } else {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
    async fetchSchdsdoolPContents({ commit }, payload) {
      let result = 0;
      let response = await axios.post("/getschoolpcontents", payload);
      console.log(response);
      if (response.status == 200) {
        result = 1;
        commit("setSchoolPContents", response.data);
      } else {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },

    //faaliyetin ders programında görevli hocaların listesi
    async fetchClubScheduleTeachers({commit}, payload){
      let response = await axios.post("/getcpscheduleteachers", payload);
      console.log(response);
      if (response.status === 200) {
        commit("setClubScheduleTeachers", response.data)
      } else {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
     },
    async fetchClubPTeacherContents({ commit }, payload) {
      let result = 0;
      let response = await axios.post("/getcpteachercontents", payload);
      console.log(response);
      if (response.status == 200) {
        result = 1;
        commit("setClubPTeacherContents", response.data);
      } else {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
    async createClubPContents({ commit, state }, payload) {
      console.log(payload);
      let result = 0;
      try {
        let response = await axios.post("/createclubpcontents", payload);
        console.log(response);
        //tytpe kontrole et
        if (response.status === 201) {
          let data = {
            id: response.data.club_content_id,
            club_program_id: response.data.club_program_id,
            club_hour_id: payload.club_hour_id,
            club_day_id: payload.club_day_id,
            lesson_id: payload.lesson_id,
            description: payload.description,
            steachers: payload.steachers,
          }
          if(payload.type === 1){
            commit("updateClubPContents", data)
          }
           commit("addClubPContents", data);
          store.commit("setSucMessage", response.data.message);
          result = 1;
        } else if (response.status === 200) {
          store.commit("setErrMessage", response.data.message);
        } else if(response.status === 202){
          result = 2;
          store.commit("setErrMessage", response.data.message);
        }
      } catch (e) {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
    async updateClubPContents({ commit, state }, payload) {
      console.log(payload);
      let result = 0;
      try {
        let response = await axios.post("/createclubpcontents", payload);
        if (response.status === 201) {
          await commit("updateclubPContents", payload)
          let data = {
            id: response.data.ap_content_id,
            club_program_id: response.data.club_program_id,
            club_hour_id: payload.club_hour_id,
            club_day_id: payload.club_day_id,
            lesson_id: payload.lesson_id,
            slesson: payload.slesson,
            steachers: payload.steachers,
          }
           commit("addclubPContents", data);
          store.commit("setSucMessage", response.data.message);
          result = 1;
        } else if (response.status === 200) {
          store.commit("setErrMessage", response.data.message);
        }
      } catch (e) {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
    async deleteClubPContents({ commit, state }, payload) {
      let result = 0;
      try {
        let response = await axios.delete("/deleteclubpcontent/" + payload.id);
        console.log(response);
        if (response.status === 200) {
          commit("updateClubPContents", payload)
          result = 1;
        } else {
          store.commit("setErrMessage", response.data.message);
        }
      } catch (e) {
        store.commit("setErrMessage", "Beklenmeyen bir hata meydana geldi.Lütfen sonra tekrar deneyiniz.")
      }
      return result;
    },
  },
  getters: {
    clubpcontents: (state) => state.clubpcontents,
    cpscheduleteachers: (state) => state.cpscheduleteachers,
    cpteachercontents: (state)=>state.cpteachercontents
  }
}
