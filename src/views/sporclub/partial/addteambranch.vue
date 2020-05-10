<template>
  <flex-card column="col-md-12 col-sm-12 col-lg-12" headerTitle="Takım Ekle">
    <div class="card-body">
      <div>
        <div class="row">
          <div class="col-md-4 col-sm-4 col-lg-4">
            <div class="form-group">
              <div class="input-group input-group-merge" :class="{ 'has-danger': isInvalid }">
                <multiselect
                  v-model="selectedClass"
                  track-by="stName"
                  :hide-selected="false"
                  @close="onTouch"
                  :allow-empty="false"
                  label="stName"
                  :selectedLabel="$t('selected')"
                  :selectLabel="$t('select')"
                  deselectLabel
                  :options="$store.getters.getTeams"
                  :searchable="true"
                  :close-on-select="true"
                  :show-labels="true"
                  :placeholder="'Takım Seçiniz'"
                ></multiselect>
                <small v-if="isInvalid" style="color: red">{{$t('pleaseselectclass')}}</small>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-sm-4 col-lg-4">
            <div class="form-group">
              <div class="input-group input-group-merge" :class="{ 'has-danger': isInvalid }">
                <multiselect
                  v-model="selectedBranches"
                  track-by="sbName"
                  :hide-selected="false"
                  :multiple="true"
                  @close="onTouch"
                  :allow-empty="false"
                  label="sbName"
                  :selectedLabel="$t('selected')"
                  :selectLabel="$t('select')"
                  deselectLabel
                  :options="$store.getters.getSCBranches"
                  :searchable="true"
                  :close-on-select="false"
                  :show-labels="true"
                  :placeholder="'Şube Seçiniz'"
                ></multiselect>
                <small v-if="isInvalid" style="color: red">{{$t('selectlesson')}}</small>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-sm-4 col-lg-4">
            <v-button
              :btnIcon="'fa-plus-circle'"
              :className="'btn-primary'"
              :btnName="'Ekle'"
              :disabled="isInvalid"
              @onClick="addSporClubBranch($event)"
            ></v-button>
          </div>
        </div>
      </div>
      <alert-box
        class="alert-secondary"
        iconName="fa fa-check-circle"
        v-if="showAlert"
        @onClose="onCloseAlert($event)"
      >
        Spor Kulübüne Takım Ekleyebilmek İçin Sisteme Takım Kayıt Edilmelidir. Eklemek İçin
        <router-link tag="a" target="_blank" :to="'/teams'">Buraya Tıklayın.</router-link>
      </alert-box>
      <alert-box
        class="alert-secondary"
        iconName="fa fa-check-circle"
        v-if="showbranchAlert"
        @onClose="onCloseBranchAlert($event)"
      >
        Spor Kulübüne Şube Ekleyebilmek İçin Sisteme Şube Kayıt Edilmelidir. Eklemek İçin
        <router-link tag="a" target="_blank" :to="'/scBranches'">Buraya Tıklayın.</router-link>
      </alert-box>
    </div>
  </flex-card>
</template>
<script>
import {
  appPlugin,
  SearchBox,
  Loading,
  VSelect,
  AlertBox,
  FlexCard,
  Flex,
  VButton,
  VTabs,
  VTabContent,
  Multiselect,
  VTooltipButton,
  Vuetable,
  VuetablePaginationBootstrap,
  VuetablePaginationInfo
} from "@/Providers/defaultImports";

export default {
  name: "addteambranch",
  created() {
    this.fetchTeamData();
    this.fetchSporClubBranchData();
  },
  props: {
    sporClub: {}
  },
  methods: {
    onCloseAlert(event) {
      this.showAlert = false;
    },
    onCloseBranchAlert(event) {
      this.showbranchAlert = false;
    },
    onTouch() {
      this.isTouched = true;
    },
    resetData() {
      (this.selectedBranches = []), (this.selectedClass = []);
    },
    addSporClubBranch() {
      let data = [];
      if (isNaN(+this.$route.params.id) == false) {
        if (this.isInvalid) {
          appPlugin.showalert(
            "Uyarı",
            "Lütfen Takım ve Şube Seçimi Yapınız",
            "error",
            this.$t('ok')
          );
        } else {
          this.selectedBranches.forEach(item => {
            data.push({
              clubid: this.$route.params.id,
              teamid: this.selectedClass.id,
              branchid: item.id
            });
          });
          this.$store
            .dispatch("createSCTeamBranch", { dataList: data })
            .then(res => {
              if (res.status) {
                if (res.status == 200) {
                  appPlugin.showalert("Kayıt Eklendi", "", "success", this.$t('ok'));
                  this.$emit("onSuccesAdd", true);
                  this.resetData();
                }
              } else {
                this.$emit("onSuccesAdd", false);
                appPlugin.showalert(
                  "Kayıt Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                  "",
                  "error",
                  this.$t('ok')
                );
              }
            })
            .catch(err => {
              this.$emit("onSuccesAdd", false);
              appPlugin.showalert(
                "Kayıt Eklenirken Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
                "",
                "error",
                this.$t('ok')
              );
            });
        }
      } else {
        appPlugin.showalert(
          this.$t("invalidparam"),
          "",
          "error",
          this.$t("ok")
        );
        this.$router.replace("/sporclub");
      }
    },
    fetchTeamData() {
      this.loading = true;
      this.$store
        .dispatch("fetchAllTeams")
        .then(res => {
          if (res.length < 1) {
            this.showAlert = true;
          } else {
            this.showAlert = false;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    fetchSporClubBranchData() {
      this.loading = true;
      this.$store
        .dispatch("fetchAllSCBBranches")
        .then(res => {
          console.log("şube datası", res);
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  computed: {
    isInvalid() {
      return (
        (this.isTouched && this.selectedClass.length === 0) ||
        this.selectedBranches.length === 0
      );
    }
  },
  data() {
    return {
      showAlert: false,
      showbranchAlert: false,
      selectedBranches: [],
      selectedClass: [],
      loading: false,
      isTouched: false
    };
  },
  components: {
    AlertBox,
    Multiselect,
    VSelect,
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
    VuetablePaginationInfo
  }
};
</script>
