<template>
     <div class="card-body">
              <div>
                    <div class="row">
                  <div class="col-md-2">
                    <div class="form-group" :class="{ 'has-danger': $v.periodData.code.$error }">
                      <div class="input-group input-group-merge">
                        <input
                          class="form-control"
                          v-model="periodData.code"
                          placeholder="Period Kodu Giriniz."
                          type="text"
                        />
                      </div>
                        <div class="invalid-feedback">
                          <small v-if="!$v.periodData.code.required"
                            >Lütfen Period Kodu Giriniz</small>
                        </div>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div
                      class="form-group"
                      :class="{ 'has-danger': $v.periodData.name.$error }"
                    >
                      <div class="input-group input-group-merge">
                        <input
                          class="form-control"
                          v-model.trim="$v.periodData.name.$model"
                          :class="{ 'is-invalid': $v.periodData.name.$error }"
                          placeholder="Period Adı Giriniz."
                          type="text"
                        />
                      </div>
                          <div class="invalid-feedback">
                          <small v-if="!$v.periodData.name.required"
                            >Lütfen Period Adı Giriniz</small>
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
                      @onClick="onCreateHandler('updatePeriod')"
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
        ...mapGetters({periods: "periods", errmessage: "errmessage"}),

    },
    components: {
        VButton
    },
    validations: {
    periodData: {
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
      this.periodData = this.selectedData;
      this.dataselected = true;
    }
  },
    data(){
        return {
              dataselected: false,
              periodData: {
        name: "",
        code: ""
      },
            period: false,
        }
    }, 
    methods: {
    onResetData() {
      this.dataselected = false;
      this.periodData = {
        name: "",
        code: ""
      };
    },
      async onCreateHandler(action="createPeriod") {
      if (this.$v.$invalid) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen Period Adı ve Kodu alanlarını Giriniz",
          "warning",
          "Tamam"
        );
      } else {
        let result = await this.$store.dispatch(`${action}`, this.periodData);
        let message = action == "createPeriod" ? "Period başarıyla oluşturuldu.":"Period başarıyla güncellendi.";
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