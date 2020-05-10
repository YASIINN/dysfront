<template>
  <ACard>
        {{getTitle}}
    <div class="row">
      <div class="col">
        <AInput v-model="$v.hourData.name.$model" label="Ders Adı" placeholder="1. Ders" />
        <div class="error" v-if="!$v.hourData.name.required">Ders adı alanı zorunldur.</div>
      </div>
      <div class="col">
        <label>Ders Başlama Saati</label>
        <d-time :type="'begin'" :config="{...config, defaultDate: hourData.begin}" @picker="getPicker"></d-time>
      </div>
      <div class="col">
        <label>Ders Bitiş Saati</label>
        <d-time :type="'end'" :config="{...config, defaultDate: hourData.end}" @picker="getPicker"></d-time>
      </div>
      <div class="col">
        <br />
        <button class="btn btn-primary float-right" @click="save">Ekle</button>
      </div>
    </div>
      <a-relation-table
       @action="getAction"
      :items="activityphours"
      :fields="[{
            text: 'Ders',
            value: 'ahname'
          },
          {
            text: 'Başlama Saati',
            value: 'begin'
          },
          {
            text: 'Bitiş Saati',
            value: 'end'
          },
          {
            text: 'İşlemler',
            value: 'action'
          }
          ]"
    ></a-relation-table>
  </ACard>
</template>

<script>
import { required, minLength } from "vuelidate/lib/validators";
import DTime from "@/components/atime/DTime";
import appPlugin from "@/Providers/appPlugins";
import { mapGetters } from 'vuex';
export default {
   computed: {
         ...mapGetters({
      activityphours: "activityphours",
      errmessage: "errmessage",
      smessage: "successmessage"
    }),
    getTitle(){
      return this.activityphours.length > 0 ? this.activityphours[0].title + ' Programı' : '';
    }
    },
  components: {
    DTime
  },
  validations: {
    hourData: {
      name: {
        required,
        minLength: minLength(5)
      }
    }
  },
      async created(){
        const atp_id = this.$route.params.id;
         if (atp_id && atp_id > 0) {
            let result = await this.$store.dispatch("fetchActivityPHours", {where: "activity_p_type_id", id: atp_id});
            if(!result){
              this.$router.go(-1);
            }
            this.atp_id = atp_id;
         } else {
            this.$router.go(-1);
         }
    },
  data() {
    return {
        atp_id: 0,
      hourData: {
        name: "",
        begin: '08:00',
        end: '08:45'
      },
      config: {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true
      }
    };
  },
  methods: {
      getAction(item, action){
             appPlugin
        .showConfirm(
          "Veriyi sileceksiniz. Onaylıyor musunuz ?"
        )
        .then(res => {
          if (res.value) {
            this.$store.dispatch("deleteActivityPHours", item);
          }
        });
      },
    async save() {
      if (this.$v) {
        if (this.$v.$invalid) {
          appPlugin.showalert(
            "Uyarı",
            "Zorunlu alanlara geçerli değerler girmelisiniz.",
            "warning",
            "Tamam"
          );
        } else {
            let payload = {
                ...this.hourData,
                a_p_type_id: this.atp_id
            }
          const result = await this.$store.dispatch("createActivityPHours", payload)
          if (result) {
            await this.$store.dispatch("fetchActivityPHours", {where: "activity_p_type_id", id: this.atp_id});
            appPlugin.showalert(this.smessage, "", "success", "Tamam");
          } else {
            console.log(this.errmessage);
            appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
          }
        }
      } else {
        appPlugin.showalert(
          "Uyarı",
          "Bütün alanlar zorunludur.",
          "warning",
          "Tamam"
        );
      }
    },
    getPicker(item, type) {
      if (type === "begin") {
        this.hourData.begin = item;
      } else if (type === "end") {
        this.hourData.end = item;
      }
    }
  }
};
</script>
