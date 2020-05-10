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
            <div v-for="(teacher, i) in getTeachers(day, hour)" :key="i">
                   {{ teacher.name}}
            </div>
            <br>
            <div v-if="getTeachers(day, hour).length > 0" class="actions">
                <button class="btn btn-success btn-sm" @click="handleUpdate(day, hour)"><i :class="'fa fa-edit'"></i></button>
                <button class="btn btn-danger btn-sm" @click="handleDelete(day, hour)"> <i :class="'fa fa-trash'"></i></button>
                    <button class="btn btn-primary btn-sm" @click="handleCopy(day, hour)"> <i :class="'fa fa-copy'"></i></button>
                            <button class="btn btn-success btn-sm" @click="handlePaste(day, hour)"> <i :class="'far fa-copy'"></i></button>

            </div>

              <div v-if="getTeachers(day, hour).length == 0" class="actions">
                <button class="btn btn-success btn-sm" @click="handleHour(day, hour)"><i :class="'fa fa-plus'"></i></button>
                                    <button class="btn btn-success btn-sm" @click="handlePaste(day, hour)"> <i :class="'far fa-copy'"></i></button>
            </div>
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
    handleCopy(day, hour){
       this.data = this.activitypcontents.find(apc=>apc.activity_day_id === day.id && apc.activity_hour_id === hour.id);
        this.$toast.success('Kopyalandı', {
                position: 'top'
        })
    },
    async handlePaste(day, hour){
        let data = this.activitypcontents.find(apc=>apc.activity_day_id === day.id && apc.activity_hour_id === hour.id);
         if(data && data.id){
             this.data = {
                 ...this.data,
                 type: 1
             }
         } else {
               this.data = {
                 ...this.data,
                 type: 0
             }
         }
         this.$emit("handlePaste", this.data, day, hour);
    },
    handleUpdate(day, hour){
          const data = this.activitypcontents.find(apc=>apc.activity_day_id === day.id && apc.activity_hour_id === hour.id);
          console.log(data);
         this.$emit("handleUpdate", data);
    },
    async handleDelete(day, hour){
         appPlugin
        .showConfirm(
          "Silme işlemini onaylıyor musunuz ?"
        )
        .then(async res => {
          if (res.value) {
                const data = await this.activitypcontents.find(apc=>apc.activity_day_id === day.id && apc.activity_hour_id === hour.id);
                await this.$store.dispatch("deleteActivityPContents", data);
          }
        });
    },
    handleHour(day, hour) {
      this.$emit("handleHour", day, hour);
    }
  }
};
</script>
