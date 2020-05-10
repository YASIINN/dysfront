<template>
     <div class="card-body">
              <div>
                    <div class="row">
                  <div class="col-md-2">
                    <div class="form-group" :class="{ 'has-danger': $v.gradeData.code.$error }">
                      <div class="input-group input-group-merge">
                        <input
                          class="form-control"
                          v-model="gradeData.code"
                          placeholder="Grup Kodu Giriniz."
                          type="text"
                        />
                      </div>
                        <div class="invalid-feedback">
                          <small v-if="!$v.gradeData.code.required"
                            >Lütfen Grup Kodu Giriniz</small>
                        </div>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div
                      class="form-group"
                      :class="{ 'has-danger': $v.gradeData.name.$error }"
                    >
                      <div class="input-group input-group-merge">
                        <input
                          class="form-control"
                          v-model.trim="$v.gradeData.name.$model"
                          :class="{ 'is-invalid': $v.gradeData.name.$error }"
                          placeholder="Grup Adı Giriniz."
                          type="text"
                        />
                      </div>
                          <div class="invalid-feedback">
                          <small v-if="!$v.gradeData.name.required"
                            >Lütfen Grup Adı Giriniz</small>
                        </div>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="row">
                       <div class="col-md-3">
                           <v-button
                      :btnIcon="'fa-edit'"
                      :className="'btn-info btn-sm'"
                      v-if="dataselected"
                      :btnName="'Güncelle'"
                      @onClick="onCreateHandler('updateGrade')"
                    ></v-button>
                       </div>
                    <v-button
                      :btnIcon="'fa-times'"
                      :className="'btn-danger btn-sm'"
                      v-if="dataselected"
                      :btnName="'Vazgeç'"
                      @onClick="onResetData"
                    ></v-button>
                    </div>
                    <v-button
                      :btnIcon="'fa-plus-circle'"
                      :className="'btn-primary'"
                      v-if="!dataselected"
                      :btnName="'Ekle'"
                      @onClick="onCreateHandler($event)"
                    ></v-button>
                  </div>
                </div>
              </div>
            </div>
</template>
<script>
import VButton from "@/components/button";
import Swal from "sweetalert2";
import appPlugin from "@/Providers/appPlugins";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from 'vuex'
export default {
    props: ["selectedData"],
    computed: {
        ...mapGetters({grades: "grades", errmessage: "errmessage"}),

    },
    components: {
        VButton
    },
    validations: {
    gradeData: {
      name: {
        required
      },
      code: {
          required
      }
    }
  },
  watch: {
    selectedData(){
      this.gradeData = this.selectedData;
      this.dataselected = true;
    }
  },
    data(){
        return {
              dataselected: false,
              gradeData: {
        name: "",
        code: ""
      },
            grade: false,
        }
    }, 
    methods: {
    onResetData() {
      this.dataselected = false;
      this.gradeData = {
        name: "",
        code: ""
      };
    },
      async onCreateHandler(action="createGrade") {
      if (this.$v.$invalid) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen Grup Adı ve Kodu alanlarını Giriniz",
          "warning",
          "Tamam"
        );
      } else {
        let result = await this.$store.dispatch(`${action}`, this.gradeData);
        let message = action == "createGrade" ? "Grup başarıyla oluşturuldu.":"Grup başarıyla güncellendi.";
        if (result) {
            appPlugin.showalert(message, "", "success", "Tamam");
            this.onResetData();
        } else {
          appPlugin.showalert(
          "Uyarı",
          this.errmessage,
          "warning",
          "Tamam"
        );
        }
      }
    }
    }
}
</script>