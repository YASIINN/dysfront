<template>
<div>

   <ACard>
        <ATabs fill class="flex-column flex-xs-row" :value="'Öğrenci Listesi'">
            <br />
             <ATabPane v-if="!assign" title="Öğrenci Listesi">
                <div >
           <search @searchStd="searchStd" :email="true" :disabled = "true"></search>
        <ACard>
               <student-list :search="searhcModel">
               </student-list>
        </ACard>
        </div>

              </ATabPane>
              <ATabPane title="Öğrenci Atama">
                  <assign-student :listType="2" @onReset="onReset"></assign-student>
              </ATabPane>
          </ATabs>
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
    created () {
      if(this.filtermodel.activity_id === 0 && this.filtermodel.period_id ===0){
        this.$router.go(-1);
      }
    },
   methods: {
     onReset(){
            this.searhcModel = {
         ...this.searhcModel,
         query: !this.searhcModel.query,
       };
     },
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
