<template>
  <flex column="col-md-12 col-sm-12 col-lg-12">
    <Loading v-if="loading"></Loading>
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <h3 class="mb-0">{{sporClub.scName+ ' '}} Öğrencileri</h3>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6 text-right">
            <v-button
              class="btn btn-sm btn-primary btn-round btn-icon"
              @onClick="exportExcel"
              :btnName="$t('exportExcel')"
            />
            <v-button
              class="btn btn-sm btn-primary btn-round btn-icon"
              @onClick="exportallData"
              :btnName="$t('allexportexcel')"
            />
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <small class="text ml-3">{{$t('searchStudentName')}}</small>
        <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
        <vuetable
          ref="vuetable"
          :append-params="moreParams"
          :fields="personHeader"
          :http-fetch="onFetchApi"
          pagination-path
          :per-page="5"
          :noDataTemplate="$t('noData')"
          @vuetable:load-success="onSuccess"
          @vuetable:load-error="onError"
          @vuetable:pagination-data="onPaginationData"
          @vuetable:loading="onLoading"
          @vuetable:loaded="onLoaded"
        >
          <template slot="actions" scope="props">
            <div class="custom-actions">
              <v-tooltip-button
                :icon="'fas fa-trash'"
                :title="'Sil'"
                :btnColor="'red'"
                @onClick="onDelete(props.rowData, props.rowIndex)"
              ></v-tooltip-button>
            </div>
          </template>
          <template slot="image" scope="props">
            <img
              :src="defaultPreview"
              height="50"
              v-if="props.rowData.file ==undefined || props.rowData.file.path==''"
            />
            <img
              v-else
              height="50"
              :src="props.rowData.file !=undefined && props.rowData.file.path"
              class="rounded-circle"
            />
          </template>
          <template slot="gender" scope="props">{{props.rowData.s_gender=='0'?'Kadın':'Erkek'}}</template>
          <template slot="details" scope="props">
            <router-link
              tag="a"
              style="cursor:pointer !important;"
              class="font-weight-bold pl-5"
              :to="'/students/'+props.rowData.id"
            >Detaylar</router-link>
          </template>
        </vuetable>
        <vuetable-pagination-info ref="paginationInfo"></vuetable-pagination-info>
        <div class="dataTables_paginate paging_simple_numbers float-right">
          <vuetable-pagination-bootstrap
            class="float-right"
            ref="pagination"
            @vuetable-pagination:change-page="onChangePage"
          ></vuetable-pagination-bootstrap>
        </div>
      </div>
    </div>
  </flex>
</template>

<script>
import {
  SearchBox,
  Loading,
  VSelect,
  AlertBox,
  FlexCard,
  Swal,
  Flex,
  VButton,
  VTabs,
  appPlugin,
  VTabContent,
  Multiselect,
  VTooltipButton,
  Vuetable,
  VuetablePaginationBootstrap,
  VuetablePaginationInfo
} from "@/Providers/defaultImports";
import defaultImage from "@/assets/img/default-pp.png";

export default {
  name: "sporclubstudentslist",
  data() {
    return {
      defaultPreview: defaultImage,
      currentData: [],
      moreParams: {},
      txt: "",
      loading: false,
      personHeader: [
        {
          name: "__sequence",
          title: "#",
          titleClass: "center aligned",
          dataClass: "right aligned"
        },
        {
          name: "__slot:image",
          title: '<i class="fas fa-image"></i> '
        },
        {
          name: "s_name",
          title: '<i class="fas fa-lightbulb"></i>Ad '
        },
        {
          name: "s_surname",
          title: '<i class="fas fa-graduation-cap"></i>Soyad'
        },
        {
          name: "s_tc",
          title: '<i class="fas fa-building"></i>Tc No'
        },
        {
          name: "__slot:gender",
          title: '<i class="fas fa-building"></i>Cinsiyet '
        },
        {
          name: "__slot:details",
          title: '<i class="fas fa-info"></i>Detaylar'
        },
        {
          name: "__slot:actions",
          title: '<i class="fas fa-pen-fancy"></i>İşlemler'
        }
      ]
    };
  },
  methods: {
    onRefreshTableContent() {
      this.$refs.vuetable.reload();
    },
    onFetchApi(apiUrl, httpOptions) {
      var data;
      if (this.txt.trim() != "") {
        data = this.$store.dispatch("fetchSporClubStudents", {
          httpOpt: httpOptions,
          id: this.$route.params.id,
          fullname: this.txt
        });
        data.then(res => {
          res.data.data.forEach(item => {
            if (item.s_gender == "0") {
              item.s_gender = "Kadın";
            } else {
              item.s_gender = "Erkek";
            }
          });

          this.currentData = res;
        });
        return data;
      } else {
        data = this.$store.dispatch("fetchSporClubStudents", {
          httpOpt: httpOptions,
          id: this.$route.params.id
        });
        data.then(res => {
          res.data.data.forEach(item => {
            if (item.s_gender == "0") {
              item.s_gender = "Kadın";
            } else {
              item.s_gender = "Erkek";
            }
          });

          this.currentData = res;
        });
        return data;
      }
    },
    exportallData() {
      this.loading = true;
      this.$store
        .dispatch("fetclAllStudentsExport", { id: this.$route.params.id })
        .then(res => {
          this.loading = false;
          if (res.status == 200 && res.data.length > 0) {
            res.data.forEach(item => {
              if (item.s_gender == "0") {
                item.s_gender = "Kadın";
              } else {
                item.s_gender = "Erkek";
              }
            });
            let data = res.data;
            let keys = ["s_name", "s_surname", "s_tc", "s_gender"];
            const header = ["Öğrenci Adı", "Öğrenci SoyAdı", "TC", "Cinsiyet"];
            appPlugin.exportExcelTable(
              data,
              this.sporClub.scName + " " + "Öğrenci Bilgisi",
              14,
              keys,
              header
            );
          } else {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('excelExportWarning'),
              'info',
              this.$t('ok')
            )
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    onSuccess() {},
    onError(err) {
      this.loading = false;
      appPlugin.showalert(this.$t('fetchError'), '', 'error', this.$t('ok'))
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
      this.$refs.paginationInfo.setPaginationData(paginationData);
    },
    onLoading() {
      this.loading = true;
    },
    onLoaded() {
      this.loading = false;
    },
    onSearchHandler(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    },
    onDelete(item, i) {
      console.log("aa", item);
      Swal.fire({
        title:
          "Öğrenci Adı  : " +
          " " +
          item.s_name +
          "\n" +
          "Öğrenci Soy Adı :" +
          " " +
          item.s_surname +
          "\n" +
          "Spor Kulübü Adı :" +
          " " +
          this.sporClub.scName +
          " " +
          "\n" +
          "Kaydını Silmek İstediğinize Emin Misiniz ?",
        confirmButtonText: "Evet",
        confirmButtonColor: "red",
        icon: "info",
        cancelButtonText: "Vazgeç",
        showCancelButton: true
      }).then(res => {
        if (res.value) {
          this.loading = true;
          this.$store
            .dispatch("deleteSporClubStudents", {
              urlparse: appPlugin.urlParse(
                "spor_club_id=" + this.sporClub.id + "& student_id=" + item.id
              )
            })
            .then(res => {
              if (res.status) {
                if (res.status === 200) {
                  appPlugin.showalert(
                    "Kayıt Başarıyla Silindi",
                    "",
                    "success",
                    "Tamam"
                  );
                }
              } else {
                appPlugin.showalert(
                  "Kayıt Silinirken Hata Gerçekleşti",
                  "",
                  "error",
                  "Tamam"
                );
              }
              this.onRefreshTableContent();
              this.loading = false;
            });
        }
      });
    },
    exportExcel() {
      if (this.currentData.data.data.length > 0) {
        let data = this.currentData.data.data;
        let keys = ["s_name", "s_surname", "s_tc", "s_gender"];
        const header = ["Öğrenci Adı", "Öğrenci SoyAdı", "TC", "Cinsiyet"];
        appPlugin.exportExcelTable(
          data,
          this.sporClub.scName + " " + "Öğrenci Bilgisi",
          14,
          keys,
          header
        );
      } else {
        appPlugin.showalert(
          this.$t('warning'),
          this.$t('excelExportWarning'),
          'info',
          this.$t('ok')
        )
      }
    }
  },
  watch: {
    onreset: function(val) {
      if (val == true) {
        this.onRefreshTableContent();
        this.$emit("onRefresh", true);
      }
    }
  },
  props: {
    onreset: {},
    sporClub: {}
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

<style scoped>
</style>
