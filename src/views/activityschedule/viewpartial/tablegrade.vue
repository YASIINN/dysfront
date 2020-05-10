<template>
  <div class="example table-responsive" style="margin: 0">
    {{getTitle}}
    <table class="table table-bordered" style="margin: 0">
      <thead>
        <tr class="active">
          <th class="min-width"></th>
          <th v-for="(day,index) in activitypdays" :key="index">
              {{day.adname}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(hour,index) in activityphours">
          <td class="active">
              {{hour.ahname}}<br>
              {{hour.begin + '-' + hour.end}}
          </td>
          <td v-for="(day,index) in activitypdays">
              {{ getLesson(day, hour)}}
              <br>
            <div v-for="(teacher, i) in getTeachers(day, hour)" :key="i">
                   {{ teacher.name}}
            </div>
            <br>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import appPlugin from "@/Providers/appPlugins";
export default {
  data() {
    return {
        data: {},
    };
  },
  computed: {
    ...mapGetters({
      activitypdays: "activitypdays",
      activityphours: "activityphours",
      activitypcontents: "activitypcontents",
    }),
    getTitle(){
      return this.activitypdays.length > 0 ? this.activitypdays[0].title + ' Programı' : '';
    }
  },
  methods: {
  getLesson(day, hour) {
      const data = this.activitypcontents.find(apc=>apc.activity_day_id === day.id && apc.activity_hour_id === hour.id);
      return data && data.slesson ? data.slesson.name: "";
    },
    getTeachers(day, hour){
      const data = this.activitypcontents.find(apc=>apc.activity_day_id === day.id && apc.activity_hour_id === hour.id);
      return data && data.steachers ? data.steachers : "";
    },
  }
};
</script>
