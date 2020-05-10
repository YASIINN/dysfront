<template>
    <div>
         <rel-detail v-if="tabId === 'detail'" ></rel-detail>
         <rel-club v-if="tabId === 'club'" ></rel-club>
          <rel-act v-if="tabId === 'activity'" ></rel-act>
          <rel-school v-if="tabId === 'school'" ></rel-school>
        <rel-user v-if="tabId === 'user'" ></rel-user>
         <rel-lesson v-if="tabId === 'lesson'"></rel-lesson>
         <rel-opt-lesson v-if="tabId === 'optlesson'"></rel-opt-lesson>
    </div>
</template>
<script>
import RelAct from "../relation/activityrelation";
import RelSchool from "../relation/schoolrelation";
import RelClub from "../relation/clubrelation";
import RelDetail from "../relation/detailrelation";
import RelUser from "../relation/userrelation";
import RelLesson from "../relation/lessonrelation";
import RelOptLesson from "../relation/optinallessonrelation";
export default {
    components: {
        RelAct, RelSchool, RelDetail, RelUser, RelLesson, RelOptLesson, RelClub
    },
    props: {
        tabId: {
            type: String,
            default: "school"
        }
    },

    methods: {
    }
}
</script>
