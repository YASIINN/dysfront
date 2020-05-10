<template>
<ACard v-if="ptypes.length > 0">
    <ATabs fill class="flex-column flex-xs-row" :value="ptypes[0].ptName">
            <br />
             <ATabPane
                v-for="(tabItem, i) in ptypes"
                :key="i"
                :title="tabItem.ptName"
              >
                <a-club :parent="tabItem.id"></a-club>
              </ATabPane>
          </ATabs>
</ACard>
</template>
<script>
import AClub from "@/views/clubschedule/partial/assignclub";
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters({ptypes: "ptypes"})
    },
    components: {
       AClub
    },
    async beforeMount(){
        await this.$store.dispatch("fetchPTypes");
        this.title = this.ptypes ? this.ptypes[0].ptName : this.title;
    },
    data(){
        return {
           title: "Ders Programı",
        }
    }
}
</script>
