<template>
        <div>
            <br><br><br>
         <basic-table></basic-table>
              <!-- Card header -->
          <div class="card-header border-0">
            <div class="row">
              <div class="col-6">
                <h3 class="mb-0">Faaliyet Listesi</h3>
              </div>
              <div class="col-6 text-right">
                <a
                  href="#"
                  class="btn btn-sm btn-primary btn-round btn-icon"
                  data-toggle="tooltip"
                  data-original-title="Edit product"
                >
                  <span class="btn-inner--icon">
                    <i class="fas fa-user-edit"></i>
                  </span>
                  <span class="btn-inner--text" @click="exportExcel"
                    >Export</span
                  >
                </a>
              </div>
            </div>
          </div>
          <div class="card">
                 <div class="table-responsive">
            <SearchBox @search="onSearchHandler($event)"></SearchBox>
            <vuetable
              ref="vuetable"
              :append-params="moreParams"
              :fields="$store.getters.getTitleHeader"
              :http-fetch="myFetch"
              pagination-path=""
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
                  >
                  </v-tooltip-button>
                  <v-tooltip-button
                    :icon="'fas fa-trash'"
                    :title="'Sil'"
                    :btnColor="'red'"
                    @onClick="onDelete(props.rowData, props.rowIndex)"
                  >
                  </v-tooltip-button>
                </div>
              </template>
            </vuetable>
            <vuetable-pagination-info
              ref="paginationInfo"
            ></vuetable-pagination-info>
            <div class="dataTables_paginate paging_simple_numbers float-right">
              <vuetable-pagination-bootstrap
                class="float-right"
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
              ></vuetable-pagination-bootstrap>
            </div>
          </div>
          </div>
          <!-- Light table -->
       
        </div>

</template>

<script>
import MainLayout from "@/layouts/main";
import SearchBox from "@/components/searchBox";
import Loading from "@/components/loading";
import VButton from "@/components/button";
import VTooltipButton from "@/components/tooltipButton";
import Swal from "sweetalert2";
import appPlugin from "@/Providers/appPlugins";
import { required } from "vuelidate/lib/validators";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "@/components/datatable/VuetablePaginationBootstrap";
import VuetablePaginationInfo from "@/components/datatable/VuetablePaginationInfo";
import axios from "axios";
import BasicTable from "@/components/atable/BasicTable";
export default {
  name: "index",
  components: {
    BasicTable,
    MainLayout,
    SearchBox,
    Loading,
    VButton,
    VTooltipButton,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo
  },
  validations: {
    titleData: {
      name: {
        required
      }
    }
  },
  data() {
    return {
      currentData: [],
      moreParams: {},
      txt: "",
      loading: false,
      dataselected: false,
      titleData: {
        name: "",
        code: ""
      },
      selectedData: {}
    };
  },
  methods: {
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
    onSearchHandler(txt) {
      this.txt = txt;
      this.moreParams = data;
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    },
    onDelete(item, i) {
      Swal.fire({
        title: item.tName + " " + "Kaydını Silmek İstediğinize Emin Misiniz ?",
        confirmButtonText: "Evet",
        confirmButtonColor: "red",
        cancelButtonText: "Vazgeç",
        showCancelButton: true
      }).then(res => {
        if (res.value) {
          this.loading = true;
          this.$store
            .dispatch("deleteTitle", {
              deleted: item,
              index: i
            })
            .then(res => {
              if (res.status === 200) {
                appPlugin.showalert(
                  "Kayıt Başarıyla Silindi",
                  "",
                  "success",
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
      // exportExcel(testdata);
      let data = this.currentData.data.data;
      appPlugin.exportExcelTable(data, "yasin", 14);
    },
    onResetData() {
      this.dataselected = false;
      this.selectedData = {};
      this.titleData = {
        name: "",
        code: ""
      };
    },
    onError() {
      this.loading = false;
      appPlugin.showalert(
        "Kayıtlar Getirilirken Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin",
        "",
        "error",
        "Tamam"
      );
    },
    onUpdate() {
      this.loading = true;
      this.$store.dispatch("updateTitle", this.titleData).then(res => {
     
        if (res.status === 200) {
          appPlugin.showalert(
            "Güncelleme İşlemi Başarıyla Gerçekleşti",
            "",
            "success",
            "Tamam"
          );
        }
        this.onRefreshTableContent();
        this.loading = false;
        this.onResetData();
      });
    },
    onSuccess() {
      /* succesFetchDataApi */
    },
    onCancel() {
      this.dataselected = !this.dataselected;
      this.onResetData();
    },
    onSelectData(data) {
      this.dataselected = true;
      this.titleData = {
        name: data.tName,
        code: data.tCode,
        id: data.id
      };
    },
    onAction(action, data, index) {
      console.log("slot) action: " + action, data, index);
    },
    onRefreshTableContent() {
      this.$refs.vuetable.reload();
    },
    myFetch(apiUrl, httpOptions) {
        console.log(httpOptions);
      let data;
      if (httpOptions.params.tname && httpOptions.params.tname != "") {
        data = axios.post(
          "/",
          { urlparse: appPlugin.urlParse("tName%" + this.txt) },
          httpOptions
        );
        data.then(res => {
          this.currentData = res;
        });

        return data;
      } else {
        data = axios.get("/titles")
        data.then(res => {
          this.currentData = res;
        });
        return data;
      }
    },
    onCreateHandler() {
      if (this.$v.$invalid) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen  Ünvan Adı Giriniz",
          "warning",
          "Tamam"
        );
      } else {
        this.loading = true;
        this.$store.dispatch("createTitles", this.titleData).then(res => {
          if (res.status === 200) {
            appPlugin.showalert("Kayıt Eklendi", "", "success", "Tamam");
            this.onResetData();
          }
          this.onRefreshTableContent();
          this.loading = false;
        });
      }
    }
  }
};
</script>

<style scoped></style>
