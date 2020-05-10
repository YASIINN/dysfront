<template>
  <div class="example table-responsive" style="margin: 0">
    {{title}}
    <table class="table table-bordered" style="margin: 0">
      <thead>
      <tr class="active">
        <th class="min-width"></th>
        <th v-for="(day,index) in schoolpdays" :key="index">
          {{day.sdName}}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(hour,index) in schoolphours">
        <td class="active">
          {{hour.shName}}<br>
          {{hour.beginDate + '-' + hour.endDate}}
        </td>
        <td v-for="(day,index) in schoolpdays">
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
  import {
    GET_SCHOOL_DAYS_LIST
  } from '@/store/modules/schooldays/moduleNames';
  import {
    GET_SCHOOL_HOUR_LLIST
  } from '@/store/modules/schoolhours/moduleNames';
  export default {
    props: ["title"],
    data() {
      return {
        data: {},
      };
    },
    computed: {
      ...mapGetters({
        schoolpdays: GET_SCHOOL_DAYS_LIST,
        schoolphours:  GET_SCHOOL_HOUR_LLIST,
        schoolpcontents: "schoolpcontents",
      }),
    },
    methods: {
      getLesson(day, hour) {
        const data = this.schoolpcontents.find(apc=>apc.school_day_id === day.id && apc.school_hour_id === hour.id);
        return data && data.slesson ? data.slesson.name: "";
      },
      getTeachers(day, hour){
        const data = this.schoolpcontents.find(apc=>apc.school_day_id === day.id && apc.school_hour_id === hour.id);
        return data && data.steachers ? data.steachers : "";
      },
    }
  };
</script>
