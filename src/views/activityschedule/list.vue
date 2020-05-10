<template>
<ACard v-if="ptypes.length > 0">
    <ATabs fill class="flex-column flex-xs-row" :value="ptypes[0].ptName">
            <br />
             <ATabPane
                v-for="(tabItem, i) in ptypes"
                :key="i"
                :title="tabItem.ptName"
              >
                <a-actper :parent="tabItem.id"></a-actper>
              </ATabPane>
          </ATabs>
</ACard>
</template>
<script>
import AActper from "@/views/activityschedule/partial/assignactper";
import { mapGetters } from 'vuex';
export default {
    computed: {
        ...mapGetters({ptypes: "ptypes"})
    },
    components: {
       AActper
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
