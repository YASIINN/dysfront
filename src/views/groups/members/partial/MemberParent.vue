<template>
  <div>
    <ATabs :value="'Üye Listesi'">
      <br />
      <ATabPane @getId="getId" :id="1" :title="'Üye Listesi'">
        <MemberList :groupId="groupId" @removemember="removeMember" :state="state" :type="'parents'"></MemberList>
      </ATabPane>
      <ATabPane @getId="getId" :id="2" :title="'Yeni Üye'">
        <AssignMember :groupId="groupId" @assignmember="assignMember" :state="state" :type="'parents'"></AssignMember>
      </ATabPane>
    </ATabs>
  </div>
</template>
<script>
  import AssignMember from './AssignMember'
  import MemberList from './MemberList'
  export default {
    name: 'MemberStudent',
    props:["groupId"],
    components: {
      MemberList,
      AssignMember
    },
    data() {
      return {
        value: "Üye Listesi",
        currentTab: 1,
        state: false,
      };
    },
    methods: {
      getId(v){
        this.currentTab = v;
      },
      async assignMember(st){
        let payload = {
          type: "parents",
          group_id: this.groupId,
          members: [st.id]
        }
        let result = await this.$store.dispatch("assignMemberToGroup", payload);
        if(result){
          this.state = !this.state;
        }
        console.log(result);
      },
      async removeMember(st){
        let payload = {
          type: "parents",
          group_id: this.groupId,
          members: [st.id]
        }
        let result = await this.$store.dispatch("removeMemberFromGroup", payload);
        console.log(result);
        if(result){
          this.state = !this.state;
        }
      }
    },
  }
</script>

<style scoped>

</style>
