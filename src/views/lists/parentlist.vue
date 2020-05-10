<template>
  <div>
   <Loading v-if="loading"></Loading>
    <div class="table-responsive">
      <vuetable
        ref="vuetable"
        :append-params="moreParams"
        :fields="fields"
        :http-fetch="onFetchApi"
        pagination-path
        :per-page="5"
        @vuetable:load-success="onSuccess"
        @vuetable:pagination-data="onPaginationData"
        @vuetable:loading="onLoading"
        @vuetable:loaded="onLoaded"
       >
          <template slot="pimage" scope="props">
                      <img
                        v-if="props.rowData.file.path==''"
                        :src="imgdefault"
                        width="100"
                        height="100"
                      />
                      <img v-else :src="props.rowData.file.path" width="100" height="100"/>
                    </template>
                        <template slot="uGender" scope="props">
                        <span
                          class="badge badge-pill badge-success"
                          :class="props.rowData.uGender  ? 'badge-success':'badge-danger'"
                        >{{props.rowData.uGender ? 'ERKEK':'KADIN'}}</span>
                    </template>
                    <template slot="isActive" scope="props">
                        <span
                          class="badge badge-pill badge-success"
                          :class="props.rowData.uİsActive  ? 'badge-success':'badge-danger'"
                        >{{props.rowData.uİsActive ? 'Aktif':'Pasif'}}</span>
                    </template>
                    <template slot="actions" scope="props">
                       <div v-if="assign" class="custom-actions">
                      <button class="btn btn-success btn-sm" @click="onAssign(props.rowData, props.rowIndex)">Atama Yap</button>
                       </div>
                      <div v-if="!assign" class="custom-actions">
                        <div
                          v-if="props.rowData.students.length > 0"
                          v-for="(item, i) in props.rowData.students"
                          :key="item.id"
                        >
                          <router-link
                            tag="a"
                            style="cursor:pointer !important;"
                            class="font-weight-bold pl-5"
                            :to="{
                           name: 'detailstudent',
                          params: { id: item.id }
                          }"
                          >{{ item.s_fullname }}
                          </router-link>
                        </div>
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
</template>
<script>
import SearchBox from "@/components/searchBox";
import Loading from "@/components/loading";
import Swal from "sweetalert2";
import appPlugin from "@/Providers/appPlugins";
import VTooltipButton from "@/components/tooltipButton";
import { required } from "vuelidate/lib/validators";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "@/components/datatable/VuetablePaginationBootstrap";
import VuetablePaginationInfo from "@/components/datatable/VuetablePaginationInfo";
import { mapGetters } from "vuex";
import axios from "axios";
import imgdefault from "@/assets/img/default-pp.png";
import _ from "lodash";
export default {
  computed: {
    ...mapGetters({ studentmodel: "studentmodel", getLang: "getLang" }),
    getLang: {
      get: function() {
        return this.$store.getters.getTitleHeader;
      }
    }
  },
  name: "index",
  props: ["search", "assign"],
  components: {
    SearchBox,
    VTooltipButton,
    Loading,
    Vuetable,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo
  },
  watch: {
    "search.query"() {
      this.query = this.search;
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    }
  },
  data() {
    return {
      imgdefault,
      fields: [
          {
            name: '__sequence',
            title: '#',
            titleClass: 'center aligned',
            dataClass: 'right aligned'
          },
          {
            name: '__slot:pimage',
            title: '<i class="fas fa-image"></i>'
          },
          {
            name: 'uName',
            title: '<i class="fas fa-lightbulb"></i>Ad '
          },
          {
            name: 'uSurname',
            title: '<i class="fas fa-graduation-cap"></i>Soyad'
          },
          {
            name: 'uPhone',
            title: '<i class="fas fa-building"></i>Telefon Numarası'
          },
          {
            name: 'uEmail',
            title: '<i class="fas fa-building"></i>Mail Adresi'
          },
          {
            name: '__slot:uGender',
            title: '<i class="fas fa-building"></i>Cinsiyet '
          },
          {
            name: '__slot:isActive',
            title: '<i class="fas fa-building"></i>Aktiflik Durumu '
          },
          {
            name: 'uJob',
            title: '<i class="fas fa-building"></i>Meslek'
          },
          {
            name: '__slot:actions',
            title: '<i class="fas fa-graduation-cap"></i>Öğrenciler'
          }
        ],
      currentData: [],
      moreParams: {},
      txt: "",
      query: {},
      loading: false,
      dataselected: false,
      titleData: {
        name: "",
        code: ""
      },
      selectedData: {}
    };
  },
  created() {},
  methods: {
       async onAssign(data, index){
         let payload = {
           student_id: this.studentmodel.id,
           user_id: data.id
         };
         let result = await this.$store.dispatch("assignStudentUser", payload);
         if(result){
            await this.$store.dispatch("getStudentsOrUsers", {
            type: "users",
            id: this.studentmodel.id
          });
            appPlugin.showalert("Öğrenci velisi olarak eklendi.", "", "success", "Tamam");
         } else {
          appPlugin.showalert(
          "Uyarı",
          "Atama sırasında hata meydana geldi.",
          "warning",
          "Tamam"
        );
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
    onSearchHandler(txt) {
      this.txt = txt;
      this.$nextTick(function() {
        this.$refs.vuetable.refresh();
      });
    },
    onDelete(item, i) {},
    exportExcel() {},
    onResetData() {},
    onError() {
      this.loading = false;
    },
    onSuccess() {
      /* succesFetchDataApi */
    },
    onCancel() {
      this.dataselected = !this.dataselected;
      this.onResetData();
    },
    onSelectData(data) {
      this.$router.push({
        name: "detailperson",
        params: { id: data.id }
      });
    },
    onAction(action, data, index) {
      console.log("slot) action: " + action, data, index);
    },
    onRefreshTableContent() {
      this.$refs.vuetable.reload();
    },
    async onFetchApi(apiUrl, httpOptions) {
         var data;
         data = this.$store.dispatch("fetchParentList", {
          httpOpt: httpOptions,
          ...this.query
        });
        data.then(res => {});
        return data;
        data.then(res => {});
        return data;
    }
  }
};
</script>

<style scoped></style>
