<template>
  <div>
    <div class>
      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body py-3 mb-1">
              <div class="row">
                <div class="col-md-12">
                  <ACheckBox :acbId="'illness'" v-model="sdetailmodel.illness.status">Hastalığı Var mı?</ACheckBox>
                  <div class="col-md-12">
                    <AInput :disabled="!sdetailmodel.illness.status" v-model="sdetailmodel.illness.desc" label="Hastalık" placeholder="Açıklama" />
                  </div>
                </div>
                <div class="col-md-12">
                  <ACheckBox
                    :acbId="'medicines'"
                    v-model="sdetailmodel.medicines.status"
                  >Kullandığı İlaç Var mı?</ACheckBox>
                  <div class="col-md-12">
                    <AInput v-model="sdetailmodel.medicines.desc" :disabled="!sdetailmodel.medicines.status" label="İlaçlar" placeholder="Açıklama" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body py-3 mb-1">
              <div class="row">
                   <div class="col-md-12">
                  <ACheckBox :acbId="'allergy'" v-model="sdetailmodel.allergy.status">Alerjisi Var mı?</ACheckBox>
                  <div class="col-md-12">
                    <AInput :disabled="!sdetailmodel.allergy.status" v-model="sdetailmodel.allergy.desc" label="Alerji" placeholder="Açıklama" />
                  </div>
                </div>
                <div class="col-md-12">
                  <ACheckBox
                    :acbId="'chronic_disease'"
                    v-model="sdetailmodel.chronic_disease.status"
                  >Kronik Hastalığı Var mı?</ACheckBox>
                  <div class="col-md-12">
                    <AInput v-model="sdetailmodel.chronic_disease.desc" :disabled="!sdetailmodel.chronic_disease.status" label="Kronik" placeholder="Açıklama" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body py-3 mb-1">
              <div class="row">
                    <div class="col-md-12">
                  <ACheckBox
                    :acbId="'scholarship'"
                    v-model="sdetailmodel.scholarship.status"
                  >Bursluluk Durumu?</ACheckBox>
                  <div class="col-md-12">
                    <AInput v-model="sdetailmodel.scholarship.desc" :disabled="!sdetailmodel.scholarship.status" label="Bursluluk" placeholder="Açıklama" />
                  </div>
                </div>
                <div class="col-md-12">
                  <ACheckBox
                    :acbId="'photo_perm'"
                    v-model="sdetailmodel.photo_perm"
                  >Foto Paylaşım İzni Var mı?</ACheckBox>
                </div>
                <br />
                <div class="col-md-12">
                  <ACheckBox :acbId="'healt_report'" v-model="sdetailmodel.health_report">Sağlık Raporu Var mı?</ACheckBox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body py-3 mb-1">
          <div class="row">
            <div class="col-md-4">
              <div class="col-md-12">
                <Label>Kan Grubu</Label>
                <bts-select
                :options="bloodGroups"
                :type="'blood'"
                :defaultOpt="bloodGroups[2]"
                @selected="getSelected"
              ></bts-select>
              </div>
            </div>
            <div class="col-md-4">
              <div class="col-md-12">
<!--
                       <AInput v-model="$v.smodel.email.$model" label="E-Posta" placeholder="Email" :class="status($v.smodel.email)"/>
          <div class="error" v-if="!$v.smodel.email.email">Geçerli bir email girilmelidir.</div> -->
                <AInput v-model="$v.sdetailmodel.s_height.$model" label="Boy" placeholder="Boy" />
                <div class="error" v-if="!$v.sdetailmodel.s_height.required">Boy alanı zorunludur.</div>
                 <div class="error" v-if="!$v.sdetailmodel.s_height.maxLength">Boy alanına geçerli değer girmelisiniz.</div>
           <div class="error" v-if="!$v.sdetailmodel.s_height.minLength">Boy alanına geçerli değer girmelisiniz.</div>
                                     <div class="error" v-if="!$v.sdetailmodel.s_height.numeric">Boy alanına geçerli değer girmelisiniz.</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="col-md-12">
                <AInput v-model="$v.sdetailmodel.s_weight.$model" label="Kilo" placeholder="Kilo" />
                  <div class="error" v-if="!$v.sdetailmodel.s_weight.required">Kilo alanı zorunludur.</div>
                <div class="error" v-if="!$v.sdetailmodel.s_weight.maxLength">Kilo alanına geçerli değer girmelisiniz.</div>
             <div class="error" v-if="!$v.sdetailmodel.s_weight.minLength">Kilo alanına geçerli değer girmelisiniz.</div>
                          <div class="error" v-if="!$v.sdetailmodel.s_weight.numeric">Kilo alanına geçerli değer girmelisiniz.</div>
              </div>
            </div>
          </div>
                <br>
          <button class="btn btn-primary float-right" @click="save">Kaydet</button>
      </div>
    </div>
  </div>
</template>
<script>
import { required,  maxLength, numeric, minLength } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import appPlugin from "@/Providers/appPlugins";
export default {
  computed: {
    ...mapGetters({studentmodel: "studentmodel",    errmessage: "errmessage",
      smessage: "successmessage",sdetail: "studentdetail", sdetailmodel: "studentdetailmodel" }),

  },
  validations: {
    sdetailmodel: {
      s_height: {
        required,
        numeric,
        maxLength: maxLength(4),
        minLength: minLength(2),
      },
      s_weight: {
        required,
        numeric,
        maxLength: maxLength(4),
        minLength: minLength(2),
      },
      blood_group: {
        required
      }
    }
  },
  async mounted() {
    //  await this.$store.dispatch("getStudentDetail");
    //  console.log(this.sdetail);
  },
  watch: {
    "photo_perm"(perm){
      this.sdetailmodel.photo_perm = perm;
    },
    "healt_report"(report){
      this.sdetailmodel.health_report = report;
    },
  },
  methods: {
     getSelected(item){
       this.sdetailmodel.blood_group = item.name;
     },
      async save(){
        console.log(this.$v);

      if (this.$v) {
        if (this.$v.$invalid) {
          appPlugin.showalert(
            "Uyarı",
            "Zorunlu alanlara geçerli değerler girmelisiniz.",
            "warning",
            "Tamam"
          );
        } else {
          this.sdetailmodel.student_id = this.studentmodel.id;
          console.log(this.sdetailmodel);
          let result = await this.$store.dispatch("createStudentDetail", this.sdetailmodel);
          if (result) {
            appPlugin.showalert(this.smessage, "", "success", "Tamam");
          } else {
            console.log(this.errmessage);
            appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
          }
        }
      } else {
        appPlugin.showalert(
          "Uyarı",
          "Öğrencinin; kan grubu, boy ve kilo alanlarının doldurulması zorunludur.",
          "warning",
          "Tamam"
        );
      }
      }
  },
  data() {
    return {
      photo_perm: false,
      healt_report: false,
      bloodGroups: [
        {name:"AB Rh+"},
         {name:"AB Rh-"},
        {name: "A Rh+"},
        {name: "A Rh-"},
        {name: "B Rh+"},
        {name: "B Rh-"},
        {name: "O Rh+"},
        {name: "O Rh-"},
      ]
    };
  }
};
</script>
