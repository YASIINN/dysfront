<template>
<div>

   <ACard>
        <ATabs fill class="flex-column flex-xs-row" :value="'Veli Listesi'">
            <br />
             <ATabPane v-if="!assign" title="Veli Listesi">
                <div >
           <search @searchStd="searchStd" :email="true" :disabled = "true"></search>
        <ACard>
              <parent-list :search="searhcModel" :assign="assign">
               </parent-list>
        </ACard>
        </div>
              </ATabPane>
          </ATabs>
   </ACard>
        </div>
</div>
</template>
<script>
  import Search from "@/views/students/listpartial/search";
 import ParentList from "@/views/lists/parentlist";
   import AssignStudent from "@/views/students/assignstudent";
   import {mapGetters} from "vuex";
  export default {
   computed: {
      ...mapGetters({filtermodel:"filtermodel"})
    },
   components: {
     Search, ParentList, AssignStudent
   },
    created () {
      if(this.filtermodel.activity_id === 0 && this.filtermodel.period_id ===0){
        this.$router.go(-1);
      }
    },
   data(){
       return {
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
