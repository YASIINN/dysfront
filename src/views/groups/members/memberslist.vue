<template>
  <div class="card-body">
    <ACard>
      Grup Adı: {{$route.params.data.name}}
      <br><br>
      <ATabs :value="'Öğrenci Üyeleri'">
        <br />
        <ATabPane @getId="getId" :id="1" :title="'Öğrenci Üyeleri'">
            <MemberStudent v-if="currentTab === 1" :groupId="group_id"></MemberStudent>
        </ATabPane>
        <ATabPane @getId="getId" :id="2" :title="'Veli Üyeleri'">
            <MemberParent v-if="currentTab === 2" :groupId="group_id"></MemberParent>
        </ATabPane>
        <ATabPane @getId="getId" :id="3" :title="'Personel Üyeleri'">
          <MemberUser v-if="currentTab === 3" :groupId="group_id"></MemberUser>
        </ATabPane>
      </ATabs>
    </ACard>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import MemberStudent from './partial/MemberStudent'
  import MemberParent from './partial/MemberParent'
  import MemberUser from './partial/MemberUser'
  export default {
    computed: {
      ...mapGetters({})
    },
    components: {
      MemberUser,
      MemberParent,
      MemberStudent
    },
    async created(){
      const g_id = this.$route.params.id;
      if (g_id && g_id > 0) {
        this.group_id  = g_id;
      } else {
        this.$router.go(-1);
      }
    },
    data() {
      return {
        value: "Okul Grupları",
        currentTab: 1,
        group_id: 0,
      };
    },
    methods: {
      getId(v){
        this.currentTab = v;
      }
    },
  }
</script>
