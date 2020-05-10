<template>
  <div>
    <Loading v-if="loading"></Loading>
    <s-add :status="'edit'"></s-add>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SAdd from "./partial/add";
import {
  Loading
} from '@/Providers/defaultImports'
export default {
  components: {
    SAdd, Loading
  },
  computed: {
    ...mapGetters({
      studentmodel: "studentmodel",
      student: "student",
      studentactivities: "studentactivities"
    })
  },
  data(){
    return {
      loading: true,
    }
  },
  async created() {
    const s_id = this.$route.params.id;
    if (s_id && s_id > 0) {
      let result = await this.$store.dispatch("fetchStudent", { id: s_id });
      if (result) {
        await this.assignModel(this.student);
        if (this.student.sdetail) {
          let sdetail = await {
            ...this.student.sdetail,
            photo_perm: this.student.sdetail.photo_perm ? true:false,
            health_report: this.student.sdetail.health_report ? true:false,
          }
          await this.$store.commit(
            "setStudentDetailModel",
            sdetail
          );
        }
        // await this.$store.dispatch("fetchStdActivities", {
        //   where: "student_id",
        //   id: this.studentmodel.id
        // });
        // if (this.studentactivities.length > 0) {
        //   //      let a = this.studentactivities.find(sa=>sa.isActive === true);
        //   this.studentmodel.activity_id = this.studentactivities[0].activity_id;
        //   this.studentmodel.period_id = this.studentactivities[0].period_id;
        // }
        console.log(this.studentmodel);
        // this.$store.dispatch("fetchStdSchool", {
        //   where: "student_id",
        //   id: this.studentmodel.id
        // });
        // this.$store.dispatch("fetchStdClub", {
        //   where: "student_id",
        //   id: this.studentmodel.id
        // });
        await this.$store.dispatch("fetchAssignLessons", {
          where: "student_id",
          id: this.studentmodel.id
        });
        await this.$store.dispatch("getStudentsOrUsers", {
          type: "users",
          id: this.studentmodel.id
        });
        this.loading = !this.loading;
      } else {
        this.$router.go(-1);
      }
    } else {
      this.$router.go(-1);
    }
  },
  methods: {
    async assignModel(data) {
      console.log(data);
      let model = {
        id: data.id,
        name: data.s_name,
        email: data.s_email,
        surname: data.s_surname,
        fullname: data.s_fullname,
        birthday: data.s_birthday,
        schoolNo: data.school_no,
        h_phone: data.s_phone,
        gsm: data.s_gsm,
        tc: data.s_tc,
        address: data.s_address,
        isActive: data.is_active ? true : false,
        file: data.file ? data.file: "",
        file_id: data.file ? data.file.id:1,
        file_path: data.file ? data.file.path : "",
        s_status: data.s_status,
        gender: data.s_gender,
        family: data.s_family,
        school_id: 0,
        class_id: 0,
        lesson_id: 0,
        branch_id: 0,
        activity_id: 0,
        period_id: 0,
        grade_id: 0,
        club_id: 0,
        team_id: 0,
        actiontype: 0
      };
      return await this.$store.commit("setStudentModel", model);
    }
  }
};
</script>
