<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-lg-12" :headerTitle="header">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <div class="input-group input-group-merge">
                  <v-input v-model.trim="shName" placeholder="Ders Adı Giriniz" :inputType="'text'"></v-input>
                </div>
                <small v-if="isInvalid" style="color: red">Lütfen Ders Adı Giriniz</small>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <div class="input-group input-group-merge">
                  <vue-timepicker
                    @change="changeHandler"
                    hour-label="Saat"
                    minute-label="Dakika"
                    placeholder="Başlangıç Saati"
                    v-model="begdt"
                    format="HH:mm"
                    :minute-interval="5"
                  ></vue-timepicker>
                  <small v-if="isInvalid" style="color: red">Lütfen Saat Seçiniz</small>
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <div class="form-group">
                <div class="input-group input-group-merge">
                  <vue-timepicker
                    hour-label="Saat"
                    minute-label="Dakika"
                    placeholder="Bitiş Saati"
                    v-model="enddt"
                    :minute-interval="5"
                  ></vue-timepicker>
                  <small v-if="isInvalid" style="color: red">Lütfen Saat Seçiniz</small>
                </div>
              </div>
            </div>
            <div class="col-md-2">
              <v-button
                :disabled="isInvalid"
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                :btnName="$t('add')"
                v-if="!updatedMode"
                @onClick="onValidate('add')"
              ></v-button>
              <v-button
                :btnIcon="'fa-edit'"
                :className="'btn-info btn-sm mt-2'"
                v-if="updatedMode"
                :btnName="$t('update')"
                @onClick="onValidate('update')"
              ></v-button>
              <v-button
                :btnIcon="'fa-times'"
                :className="'btn-danger btn-sm mt-2'"
                v-if="updatedMode"
                :btnName="$t('cancel')"
                @onClick="onCancel($event)"
              ></v-button>

              <!-- -->
            </div>
          </div>
        </div>
      </div>
    </flex-card>
  </div>
</template>

<script>
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
import {
  Swal,
  SearchBox,
  Loading,
  VSelect,
  AlertBox,
  FlexCard,
  Flex,
  VInput,
  VButton,
  VTabs,
  VTabContent,
  Multiselect,
  VTooltipButton,
  Vuetable,
  VuetablePaginationBootstrap,
  VuetablePaginationInfo,
  appPlugin
} from "@/Providers/defaultImports";

export default {
  props: {
    header: {},
    selectedData: {}
  },
  computed: {
    isInvalid() {
      return;
      this.shName.trim().length < 1 ||
        this.begdt == "" ||
        this.begdt.split(":")[0] == "HH" ||
        this.begdt.split(":")[0] == "mm" ||
        this.enddt == "" ||
        this.enddt.split(":")[0] == "HH" ||
        this.enddt.split(":")[0] == "mm";
    }
  },
  watch: {
    selectedData(val) {
      this.onSelectData(val);
    }
  },
  methods: {
    onCancel() {
      this.updatedMode = !this.updatedMode;
      this.resetData();
    },
    changeHandler(data) {},
    resetData() {
      this.shName = "";
      this.begdt = "";
      this.enddt = "";
    },
    onSelectData(data) {
      if (this.selectedData.item != undefined) {
        this.updatedMode = true;
        this.shName = this.selectedData.item.shName;
        this.begdt = this.selectedData.item.beginDate;
        this.enddt = this.selectedData.item.endDate;
      } else {
        this.updatedMode = false;
      }
    },
    onValidate(data) {
      if (this.shName.trim().length < 1) {
        appPlugin.showalert(
          "Uyarı",
          "Ders Adı Giriniz (örn 1.Ders,2.Ders)",
          "info",
          "Tamam"
        );
      } else if (this.begdt == "") {
        appPlugin.showalert(
          "Uyarı",
          "Ders Başlangıç Saati Giriniz",
          "info",
          "Tamam"
        );
      } else if (
        this.begdt.split(":")[0] == "HH" ||
        this.begdt.split(":")[1] == "mm"
      ) {
        appPlugin.showalert(
          "Uyarı",
          "Ders Başlangıç Saati ve Dakikasını Giriniz",
          "info",
          "Tamam"
        );
      } else if (this.enddt == "") {
        appPlugin.showalert(
          "Uyarı",
          "Ders Bitiş Saati Giriniz",
          "info",
          "Tamam"
        );
      } else if (
        this.enddt.split(":")[0] == "HH" ||
        this.enddt.split(":")[1] == "mm"
      ) {
        appPlugin.showalert(
          "Uyarı",
          "Ders Bitiş Saati ve Dakikasını Giriniz",
          "info",
          "Tamam"
        );
      } else {
        if (data == "add") {
          this.onCreateHandler();
        } else {
          this.onUpdateHandler();
        }
      }
    },
    onUpdateHandler() {
      this.loading = true;
      this.$store
        .dispatch("updateSchoolHour", {
          index: this.selectedData.i,
          id: this.selectedData.item.id,
          shName: this.shName,
          begdt: this.begdt,
          enddt: this.enddt,
          ptypeid: this.$route.params.id
        })
        .then(res => {
          if (res.status == 200) {
            appPlugin.showalert(
              this.$t("updateSuccesMsg"),
              "",
              "success",
              this.$t("ok")
            );
            // this.$store.dispatch("fetchSchoolHours", {
            //   urlparse: appPlugin.urlParse(
            //     "school_p_type_id=" + this.$route.params.id
            //   )
            // });
            // this.$emit("onReset", true);
            this.resetData();
          } else if (res.status == 204) {
            appPlugin.showalert(
              "Bu Kayıt Daha Önce Sisteme Eklendi",
              "",
              "warning",
              this.$t("ok")
            );
          }
        })
        .catch(err => {
          appPlugin.showalert(
            this.$t("updateErrorMsg"),
            "",
            "error",
            this.$t("ok")
          );
        });

      this.loading = false;
    },
    onCreateHandler() {
      this.loading = true;
      this.$store
        .dispatch("createSchoolHour", {
          shName: this.shName,
          begdt: this.begdt,
          enddt: this.enddt,
          ptypeid: this.$route.params.id
        })
        .then(res => {
          this.loading = false;
          if (res.status) {
            if (res.status == 200) {
              appPlugin.showalert(
                this.$t("succescreatemessage"),
                "",
                "success",
                this.$t("ok")
              );
              // this.$store.dispatch('fetchSchoolHours', {
              //   urlparse: appPlugin.urlParse(
              //     'school_p_type_id=' + this.$route.params.id
              //   )
              // })
              this.resetData();
              // this.$emit("onReset", true);
            } else if (res.status == 204) {
              appPlugin.showalert(
                "Uyarı",
                "Bu Kayıt Daha Önce Sisteme Eklendi",
                "warning",
                "Tamam"
              );
            }
          } else {
            appPlugin.showalert(
              this.$t("errorcreatemessage"),
              "",
              "error",
              this.$t("ok")
            );
          }
        })
        .catch(err => {
          this.loading = false;
          appPlugin.showalert(
            this.$t("errorcreatemessage"),
            "",
            "error",
            this.$t("ok")
          );
        });
    }
  },
  data() {
    return {
      updatedMode: false,
      shName: "",
      begdt: "",
      enddt: "",
      loading: false
    };
  },
  name: "createhour",
  components: {
    AlertBox,
    Multiselect,
    VSelect,
    VInput,
    VTabs,
    FlexCard,
    Flex,
    VTabContent,
    SearchBox,
    Loading,
    VButton,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    VueTimepicker
  }
};
</script>

<style scoped></style>
