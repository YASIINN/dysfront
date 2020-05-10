<template>
     <div class="card-body">
              <div>
                    <div class="row">
                  <div class="col-md-2">
                    <div class="form-group" :class="{ 'has-danger': $v.activityData.code.$error }">
                      <div class="input-group input-group-merge">
                        <input
                          class="form-control"
                          v-model="activityData.code"
                          placeholder="Faaliyet Kodu Giriniz."
                          type="text"
                        />
                      </div>
                        <div class="invalid-feedback">
                          <small v-if="!$v.activityData.code.required"
                            >Lütfen Faaliyet Kodu Giriniz</small>
                        </div>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div
                      class="form-group"
                      :class="{ 'has-danger': $v.activityData.name.$error }"
                    >
                      <div class="input-group input-group-merge">
                        <input
                          class="form-control"
                          v-model.trim="$v.activityData.name.$model"
                          :class="{ 'is-invalid': $v.activityData.name.$error }"
                          placeholder="Faaliyet Adı Giriniz."
                          type="text"
                        />
                      </div>
                          <div class="invalid-feedback">
                          <small v-if="!$v.activityData.name.required"
                            >Lütfen Faaliyet Adı Giriniz</small>
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
                      @onClick="onCreateHandler('updateActivity')"
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
        ...mapGetters({activities: "activities", errmessage: "errmessage"}),

    },
    components: {
        VButton
    },
    validations: {
    activityData: {
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
      this.activityData = this.selectedData;
      this.dataselected = true;
    }
  },
    data(){
        return {
              dataselected: false,
              activityData: {
        name: "",
        code: ""
      },
            period: false,
        }
    }, 
    methods: {
    onResetData() {
      this.dataselected = false;
      this.activityData = {
        name: "",
        code: ""
      };
    },
      async onCreateHandler(action="createActivity") {
      if (this.$v.$invalid) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen Faaliyet Adı ve Kodu alanlarını Giriniz",
          "warning",
          "Tamam"
        );
      } else {
        let result = await this.$store.dispatch(`${action}`, this.activityData);
        let message = action == "createActivity" ? "Faaliyet başarıyla oluşturuldu.":"Faaliyet başarıyla güncellendi.";
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