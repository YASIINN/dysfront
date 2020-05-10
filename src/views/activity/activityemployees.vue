<template>
<div>

   <ACard>
        <ATabs fill class="flex-column flex-xs-row" :value="'Personel Listesi'">
            <br />
             <ATabPane v-if="!assign" title="Personel Listesi">
                <div >
           <search @searchStd="searchStd" :email="true" :disabled = "true"></search>
        <ACard>
              <employee-list :search="searhcModel" :assign="assign">
               </employee-list>
        </ACard>
        </div>

              </ATabPane>
              <!-- <ATabPane title="Personel Atama">
                  <assign-student :listType="2"></assign-student>
              </ATabPane> -->
          </ATabs>
   </ACard>
        </div>
</div>
</template>
<script>
  import Search from "@/views/students/listpartial/search";
 import EmployeeList from "@/views/lists/employeelist";
   import AssignStudent from "@/views/students/assignstudent";
   import {mapGetters} from "vuex";
  export default {
   computed: {
      ...mapGetters({filtermodel:"filtermodel"})
    },
   components: {
     Search, EmployeeList, AssignStudent
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
