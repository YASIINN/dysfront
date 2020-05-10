<template>
  <flex column="col-md-12 col-sm-12 col-lg-12">
    <Loading v-if="loading" />
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <h3 class="mb-0">{{$t('lessons')}}</h3>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6 text-right">
            <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
            <v-button :btnName="$t('allexportexcel')" className="btn btn-primary btn-sm" @onClick="exportallData"/>
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <div class="col-md-12">
          <div class="form-group">
            <small>{{$t('showlesson')}}</small>
            <div class="input-group input-group-merge">
              <v-select
                :className="'form-control'"
                v-model.trim="selectedLessonFilter"
                :propName="'name'"
                @changeOption="onFilterChange"
                :bindData="'id'"
                :optionData="filterData"
              ></v-select>
            </div>
          </div>
        </div>
        <small class="text ml-3">{{$t('searchLesson')}}</small>
        <SearchBox @search="onSearchHandler($event)"></SearchBox>
        <vuetable
          ref="vuetable"
          :append-params="moreParams"
          :fields="$store.getters.getLessonsHeader"
          :http-fetch="onFetchApi"
          noDataTemplate="Kayıt Bulunamadı"
          pagination-path
          :per-page="5"
          @vuetable:load-success="onSuccess"
          @vuetable:load-error="onError"
          @vuetable:pagination-data="onPaginationData"
          @vuetable:loading="onLoading"
          @vuetable:loaded="onLoaded"
        >
          <template slot="actions" scope="props">
            <div class="custom-actions">
              <v-tooltip-button
                :icon="'fa-user-edit'"
                :title="'Düzenle'"
                :btnColor="'orange'"
                @onClick="onSelectData(props.rowData)"
              ></v-tooltip-button>
              <v-tooltip-button
                :icon="'fas fa-trash'"
                :title="$t('delete')"
                :btnColor="'red'"
                @onClick="onDelete(props.rowData, props.rowIndex)"
              ></v-tooltip-button>
            </div>
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
  FlexCard,
  Flex,
  VSelect,
  VInputContainer,
  VButton,
  VInput,
  VTooltipButton,
  Vuetable,
  Swal,
  VuetablePaginationBootstrap,
  VuetablePaginationInfo,
  appPlugin
} from "@/Providers/defaultImports";

export default {
  name: "lessonlisttable",
  watch: {
    onreset: function(val) {
      if (val == true) {
        this.onRefreshTableContent();
        this.$emit("onRefresh", true);
      }
    }
  },
  props: {
    onreset: {}
  },
  data() {
    return {
      moreParams: {},
      filterData: [
        {
          name: "Tümü",
          id: 2
        },
        {
          name: "Normal",
          id: 0
        },
        {
          name: "Seçmeli",
          id: 1
        }
      ],
      currentData: [],
      txt: "",
      loading: false,
      selectedLessonFilter: 2
    };
  },
  methods: {
    onSelectData(data) {
      this.$emit("onSelectData", data);
    },

    onFilterChange() {
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    },
    exportallData() {
      this.loading = true;
      this.$store
        .dispatch("fetchAllLessons")
        .then(res => {
          if (res.data.length > 0) {
            res.data.forEach(item => {
              if (item.type == 0) {
                item.type = "Normal";
              } else {
                item.type = "Seçmeli";
              }
            });
            const data = res.data;
            const keys = ["lName", "lCode", "type"];
            const header = ["Ders Kodu", "Ders Adı", "Ders Türü"];
            appPlugin.exportExcelTable(data, "Dersler", 14, keys, header);
          } else {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('excelExportWarning'),
              'info',
              this.$t('ok')
            )

          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    onDelete(item, i) {
      Swal.fire({
        title: "Ders Adı :" + " " + item.lName + "\n" + this.$t("sureDelete"),
        confirmButtonText: this.$t("yes"),
        icon: "info",
        confirmButtonColor: "red",
        cancelButtonText: this.$t("no"),
        showCancelButton: true
      }).then(res => {
        if (res.value) {
          this.loading = true;
          this.$store
            .dispatch("deleteLessons", {
              deleted: item,
              index: i
            })
            .then(res => {
              if (res.status) {
                if (res.status === 200) {
                  appPlugin.showalert(
                    this.$t("deleteRecordMsg"),
                    "",
                    "success",
                    this.$t("ok")
                  );
                }
              } else {
                appPlugin.showalert(
                  this.$t("deleteRecordErrMsg"),
                  "",
                  "error",
                  this.$t("ok")
                );
              }
              this.onRefreshTableContent();
              this.loading = false;
            });
        }
      });
    },
    onFetchApi(apiUrl, httpOptions) {
      var data;
      let query;
      if (this.txt.trim() != "") {
        if (this.selectedLessonFilter == 2) {
          query = appPlugin.urlParse("lName%" + this.txt + "& parent_id=0");
        } else {
          query = appPlugin.urlParse(
            "lName%" +
              this.txt +
              "& type=" +
              this.selectedLessonFilter +
              "& parent_id=0"
          );
        }
        data = this.$store.dispatch("fetchLessons", {
          httpOpt: httpOptions,
          query: query
          //appPlugin.urlParse('lName%' + this.txt + '& type=' + this.selectedLessonFilter + '& parent_id=0')
        });
        data.then(res => {
          this.currentData = res;
        });
        return data;
      } else {
        if (this.selectedLessonFilter == 2) {
          query = appPlugin.urlParse("parent_id=0");
        } else {
          query = appPlugin.urlParse(
            "type=" + this.selectedLessonFilter + "& parent_id=0"
          );
        }
        data = this.$store.dispatch("fetchLessons", {
          httpOpt: httpOptions,
          query: query
          //appPlugin.urlParse('type=' + this.selectedLessonFilter + '& parent_id=0')
        });
        data.then(res => {
          this.currentData = res;
        });
        return data;
      }
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
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
    onSuccess() {},
    onError() {
      this.loading = false;
      appPlugin.showalert(this.$t("getRecordErro"), "", "error", this.$t("ok"));
    },
    onRefreshTableContent() {
      this.$refs.vuetable.reload();
    },
    onSearchHandler(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    },
    exportExcel() {
      if (this.currentData.data.data.length > 0) {
        const data = this.currentData.data.data;
        const keys = ["lName", "lCode", "type"];
        const header = ["Ders Kodu", "Ders Adı", "Ders Türü"];
        appPlugin.exportExcelTable(data, "Dersler", 14, keys, header);
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
  components: {
    VInputContainer,
    VSelect,
    SearchBox,
    Loading,
    VButton,
    VInput,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    Flex,
    FlexCard
  }
};
</script>

<style scoped>
</style>
