<template>
<div>
         <search @searchStd="searchStd" :email="true" :default="true"></search>
        <ACard>
               <parent-list :search="searhcModel" :assign="assign">
               </parent-list>
        </ACard>
</div>
</template>
<script>
  import Search from "@/views/students/listpartial/search";
   import ParentList from "@/views/lists/parentlist";
  export default {
    props: {
       assign: {
         type: Boolean,
         default: false
       }
    },
   components: {
     Search, ParentList
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