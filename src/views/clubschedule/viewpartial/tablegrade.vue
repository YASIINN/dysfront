<template>
  <div class="example table-responsive" style="margin: 0">
    {{getTitle}}
    <table class="table table-bordered" style="margin: 0">
      <thead>
        <tr class="active">
          <th class="min-width"></th>
          <th v-for="(day,index) in clubpdays" :key="index">
              {{day.adname}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(hour,index) in clubphours">
          <td class="active">
              {{hour.ahname}}<br>
              {{hour.begin + '-' + hour.end}}
          </td>
          <td v-for="(day,index) in clubpdays">
              <div style="font-size: large">
                {{ getLesson(day, hour)}}
              </div>
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
      clubpdays: "clubpdays",
      clubphours: "clubphours",
      clubpcontents: "clubpcontents",
    }),
    getTitle(){
      return this.clubpdays.length > 0 ? this.clubpdays[0].title + ' Programı' : '';
    }
  },
  methods: {
  getLesson(day, hour) {
      const data = this.clubpcontents.find(apc=>apc.club_day_id === day.id && apc.club_hour_id === hour.id);
      return data && data.description ? data.description: "";
    },
    getTeachers(day, hour){
      const data = this.clubpcontents.find(apc=>apc.club_day_id === day.id && apc.club_hour_id === hour.id);
      return data && data.steachers ? data.steachers : "";
    },
  }
};
</script>
