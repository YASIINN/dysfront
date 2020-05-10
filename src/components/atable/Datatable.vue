<template>
  <div class="container">
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
        <template slot="image" scope="props">
          <img
            :src="props.rowData.file ? props.rowData.file.path : imgdefault"
            alt="Photo de profil"
            height="100px"
            width="100px"
            class="rounded-circle"
          />
        </template>
        <template slot="schools" scope="props">
          <div 
             v-if="query.type === 1 && props.rowData.schools.length > 0"
            v-for="(item, i) in props.rowData.schools"
            :key="item.tc"
          >{{ item.sName + '-' + props.rowData.clases[i].cName + '-' +props.rowData.branches[i].bName }}
          </div>
            <div 
            v-if="query.type === 2 && props.rowData.activities.length > 0"
            v-for="(item, i) in props.rowData.activities"
            :key="item.tc"
          >{{ item.aName + '-' + props.rowData.periods[i].pName + '-' +props.rowData.grades[i].gName }}
          </div>

           <div 
            v-if="query.type === 3 && props.rowData.clubs.length > 0"
            v-for="(item, i) in props.rowData.clubs"
            :key="item.tc"
          >{{ item.scName + '-' + props.rowData.teams[i].stName + '-' +props.rowData.sbranches[i].sbName }}
          </div>

        </template>
 
        <template slot="actions" scope="props">
          <div class="custom-actions">
            <button class="btn btn-primary btn-sm" @click="onSelectData(props.rowData)">Detay</button>
            <v-tooltip-button
              :icon="'fa-user-edit'"
              :title="'Düzenle'"
              :btnColor="'orange'"
              @onClick="onSelectData(props.rowData)"
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
  props: ["search"],
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
          name: "__sequence",
          title: "#",
          titleClass: "center aligned",
          dataClass: "right aligned"
        },
        {
          name: "__slot:image",
          title: "Resim"
        },
        {
          name: "s_tc",
          title: '<i class="fas fa-lightbulb"></i>TC'
        },
        {
          name: "s_fullname",
          title: '<i class="far fa-file-alt"></i> Ad Soyad'
        },
        {
          name: "__slot:schools",
          title: "Okul"
        },
          {
          name: "__slot:adem",
          title: "Okul"
        },
        {
          name: "__slot:actions",
          title: '<i class="fas fa-pen-fancy"></i>İşlemler'
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
      console.log(data);
      console.log(this.studentmodel);
      let model = {
        id: data.id,
        name: data.s_name,
        email: data.s_email,
        surname: data.s_surname,
        fullname: data.s_fullname,
        birthday: data.s_birthday,
        schoolNo: data.school_no,
        h_phone: data.s_phone,
        gsm: data.s_gsm,
        tc: data.s_tc,
        address: data.s_address,
        isActive: data.is_active ? true : false,
        file: null,
        file_id: 0,
        file_path: "",
        gender: 0,
        family: 1,
        school_id: 0,
        class_id: 0,
        lesson_id: 0,
        branch_id: 0,
        activity_id: 0,
        period_id: 0,
        grade_id: 0,
        club_id: 0,
        team_id: 0,
        actiontype: 0
      };
      this.$store.commit("setStudentModel", model);
      this.$router.push({
        name: "detailstudent",
        params: { id: data.id, data: data }
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
         data = this.$store.dispatch("fetchStudents", {
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