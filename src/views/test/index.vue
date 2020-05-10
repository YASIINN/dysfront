<template>
<div>
         <search @searchStd="searchStd" :email="true"></search>
        <ACard>
               <student-list :search="searhcModel">
                   <template>
                       selam
                   </template>
               </student-list>
        </ACard>
   
</div>
</template>
<script>
  import Search from "@/views/students/listpartial/search";
   import StudentList from "@/views/lists/studentlist";
  export default {
   components: {
     Search, StudentList
   },
   data(){
       return {
         searhcModel: {
           fullname: "",
           email: "",
           query: false,
         },
       }
   },
   methods: {
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