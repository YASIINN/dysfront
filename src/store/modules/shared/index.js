import {assignOpt} from "@/store/model/filterModel";
export default {
    state: {
        errmessage: "",
        successmessage: "",
        filtermodel: assignOpt
    },
    mutations: {
        setErrMessage(state, data){
            state.errmessage = data;
        },
        async setAssignOptModel(state, data){
            state.filtermodel = await data;
        },
        setSucMessage(state, data){
            state.successmessage = data;
        }
    },
    actions: {},
    getters: {
        errmessage: (state)=>state.errmessage,
        successmessage: (state)=>state.successmessage,
        filtermodel: (state)=>state.filtermodel,
    }
}
