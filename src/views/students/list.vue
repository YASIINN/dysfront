<template>
<div>
  <div >
    <search @searchStd="searchStd" :email="true" :default="true"></search>
    <ACard>
      <student-list :search="searhcModel" :main="'main'" @deleteStudent="deleteStudent">
      </student-list>
    </ACard>
  </div>
</div>
</template>
<script>
  import Search from "@/views/students/listpartial/search";
   import StudentList from "@/views/lists/studentlist";
   import AssignStudent from "@/views/students/assignstudent";
   import {mapGetters} from "vuex";
  export default {
   computed: {
      ...mapGetters({filtermodel:"filtermodel"})
    },
   components: {
     Search, StudentList, AssignStudent
   },
   async created(){
        console.log(process.env);
        console.log(this.filtermodel);
   },

   data(){
       return {
         url: process.env.VUE_APP_API,
         assign: false,
         searhcModel: {
           fullname: "",
           email: "",
           query: false,
         },
       }
   },
   methods: {
     assignStudent(){

     },
     async deleteStudent(student){
        await this.$store.dispatch("deleteStudent", {id: student.id});
        this.searchStd(this.searhcModel);
     },

     searchStd(searhcModel){
       console.log(searhcModel);
       this.searhcModel = {
         ...searhcModel,
         query: !this.searhcModel.query,
       };
     }
   }
  }
</script>

<style scoped></style>
