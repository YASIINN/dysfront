<template>
<div>
         <search @searchStd="searchStd" :email="true" :default="true"></search>
        <ACard>
               <employee-list :search="searhcModel" :assign="assign">
               </employee-list>
        </ACard>
</div>
</template>
<script>
  import Search from "@/views/students/listpartial/search";
   import EmployeeList from "@/views/lists/employeelist";
  export default {
    props: {
       assign: {
         type: Boolean,
         default: false
       }
    },
   components: {
     Search, EmployeeList
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
