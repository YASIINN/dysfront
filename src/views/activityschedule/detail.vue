<template>
<ACard>
    <ATabs fill class="flex-column flex-xs-row" :value="'Günler'">
            <br />
             <ATabPane :title="'Günler'">
                  <apt-days></apt-days>
              </ATabPane>
                 <ATabPane :title="'Saatler'">
                 <apt-hours></apt-hours>
              </ATabPane>
                 <ATabPane :title="'Oluştur'">
                  <schedule-create></schedule-create>
              </ATabPane>
              <ATabPane :title="'Görüntüle'">
                 <schedule-view></schedule-view>
              </ATabPane>
          </ATabs>
</ACard>
</template>
<script>
import AActper from "@/views/activityschedule/partial/assignactper";
import { mapGetters } from 'vuex';
import AptHours from "./partial/hours";
import AptDays from "./partial/days";
import ScheduleCreate from "./partial/schedulecreate";
import ScheduleView from "./scheduleview";
import { some, isEmpty } from 'lodash'
export default {
    computed: {
        ...mapGetters({activityptype: "activityptype"})
    },
    components: {
       AActper, AptHours, AptDays, ScheduleCreate, ScheduleView
    },
    async created(){
        if(!some(this.activityptype, isEmpty)){
          this.$router.go(-1);
        }
    },
    data(){
        return {
            
        }
    }
}
</script>
