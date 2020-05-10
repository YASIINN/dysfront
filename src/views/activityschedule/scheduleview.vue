<template>
  <ATabs ref="tabs" id="tabs" fill class="flex-column flex-xs-row" :value="value">
    <br />
    <ATabPane @getId="getId" :id="1" :title="'Sınıfa Göre'">
       <grade-list v-if="currentTab === 1"></grade-list>
    </ATabPane>
    <ATabPane @getId="getId" :id="2" :title="'Öğretmene Göre'">
         <teacher-list v-if="currentTab === 2"></teacher-list>
    </ATabPane>
  </ATabs>
</template>
<script>
import TeacherList from "./viewpartial/teacherlist";
import GradeList from "./viewpartial/gradelist";
export default {
    components: {
        TeacherList, GradeList
    },
  data() {
    return {
      value: "Sınıfa Göre",
      currentTab: 1,
    };
  },
  methods: {
      getId(v){
          this.currentTab = v;
      }
  },

};
</script>
