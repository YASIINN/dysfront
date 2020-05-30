<template>
  <div class="card-body">
  <ACard>
    <ATabs :value="'Spor Kulubü Grupları'">
      <br />
      <ATabPane @getId="getId" :id="1" :title="'Spor Kulubü Grupları'">
         <SchoolGroup v-if="currentTab === 1"></SchoolGroup>
      </ATabPane>
      <ATabPane @getId="getId" :id="2" :title="'Kulüp Takım Grupları'">
         <ClassGroup v-if="currentTab === 2"></ClassGroup>
      </ATabPane>
      <ATabPane @getId="getId" :id="3" :title="'Takım Şube Grupları'">
          <BranchGroup v-if="currentTab === 3"></BranchGroup>
      </ATabPane>
    </ATabs>
  </ACard>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { some, isEmpty } from 'lodash'
  import SchoolGroup from "./schoolgroup";
  import ClassGroup from "./classgroup";
  import BranchGroup from "./branchgroup";
  export default {
    computed: {
      ...mapGetters({})
    },
    components: {
      SchoolGroup, ClassGroup, BranchGroup
    },
    async created(){
    },
    data() {
      return {
        value: "Spor Kulubü Grupları",
        currentTab: 1,
      };
    },
    methods: {
      getId(v){
        this.currentTab = v;
      }
    },
  }
</script>
