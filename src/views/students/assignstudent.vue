<template>
  <div>
    <assign-search @searchStd="searchStd" :email="true"></assign-search>
    <ACard>
      <assignstudent-list :search="searhcModel" @assignStudent="assignStudent" ></assignstudent-list>
    </ACard>
    <ACard v-if="listType === 2">
      <activity-relation :parent="true" @toParent="getFromChild"></activity-relation>
    </ACard>
    <ACard v-if="listType === 3">
      <club-relation :parent="true" @toParent="getFromChild"></club-relation>
    </ACard>
    <ACard v-if="listType === 1">
      <school-relation :parent="true" @toParent="getFromChild"></school-relation>
    </ACard>
  </div>
</template>
<script>
import AssignSearch from "@/views/students/listpartial/assignsearch";
import AssignstudentList from "@/views/lists/assignstudentlist";
import ActivityRelation from "@/views/students/relation/activityrelation";
import ClubRelation from "@/views/students/relation/clubrelation";
import SchoolRelation from "@/views/students/relation/schoolrelation";
import appPlugin from "@/Providers/appPlugins";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({ errmessage: "errmessage", smessage: "successmessage" })
  },
  props: {
    listType: {
      type: Number,
      default: 1
    }
  },
  components: {
    AssignSearch,
    AssignstudentList,
    ActivityRelation,
    ClubRelation,
    SchoolRelation
  },
  data() {
    return {
      sstudents: [],
      searhcModel: {
        fullname: "",
        email: "",
        query: false,
        type: this.listType
      }
    };
  },
  methods: {
    assignStudent(payload) {
      this.sstudents = payload;
    },
    async getFromChild(type, payload) {
      if(this.sstudents.length > 0){
          let datas = [];
      if (type === 1) {
        this.sstudents.forEach(sid => {
          let data = {
            school_id: payload.school_id,
            class_id: payload.class_id,
            branch_id: payload.branch_id,
            student_id: sid
          };
          datas.push(data);
        });
        let dpayload = {
          type: 1,
          data: datas
        };
        await this.actionResult(dpayload);
      } else if (type === 2) {
        this.sstudents.forEach(sid => {
          let data = {
            activity_id: payload.activity_id,
            period_id: payload.period_id,
            grade_id: payload.grade_id,
            student_id: sid
          };
          datas.push(data);
        });
        let dpayload = {
          type: 2,
          data: datas
        };
         await this.actionResult(dpayload);
      } else if (type === 3) {
        this.sstudents.forEach(sid => {
          let data = {
            club_id: payload.club_id,
            team_id: payload.team_id,
            branch_id: payload.branch_id,
            student_id: sid
          };
          datas.push(data);
        });
        let dpayload = {
          type: 3,
          data: datas
        };
         await this.actionResult(dpayload);
      }
      } else {
         appPlugin.showalert("Uyarı", "En az bir öğrenci seçimi yapınız.", "warning", "Tamam");
      }

    },
    async actionResult(payload) {
      let result = await this.$store.dispatch("createAssignStudent", payload);
      if (result) {
        // if(this.listType === 3){
          this.$emit("onReset", true)
        // }
        appPlugin.showalert(this.smessage, "", "success", "Tamam");
      } else {
        appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
      }
    },
    searchStd(searhcModel) {
      console.log(searhcModel);
      this.searhcModel = {
        ...searhcModel,
        query: !this.searhcModel.query,
        type: this.listType
      };
    }
  }
};
</script>

<style scoped></style>
