<template>
<div>
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
              <template slot="actions" scope="props">
                <div class="custom-actions">
                  <button class="btn btn-success btn-sm" @click="onAssign(props.rowData, props.rowIndex)">Atama Yap</button>
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
  import SearchBox from '@/components/searchBox'
  import Loading from '@/components/loading'
  import Swal from 'sweetalert2'
  import appPlugin from '@/Providers/appPlugins'
    import VTooltipButton from '@/components/tooltipButton'
  import { required } from 'vuelidate/lib/validators'
  import Vuetable from 'vuetable-2/src/components/Vuetable'
  import VuetablePaginationBootstrap from '@/components/datatable/VuetablePaginationBootstrap'
  import VuetablePaginationInfo from '@/components/datatable/VuetablePaginationInfo'
  import {mapGetters} from "vuex"
  import axios from "axios";
  export default {
      computed: {
          ...mapGetters({studentmodel: "studentmodel", getLang: 'getLang'}),
              getLang:{
      get:function () {
        return this.$store.getters.getTitleHeader
      }
    }
      },
    name: 'index',
    props: ["search"],
    components: {
      SearchBox,
      VTooltipButton,
      Loading,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo,
    },
    watch: {
         search: {
      deep: true,
         handler(){
                   this.query = this.search;
               this.$nextTick(function() {
           this.$refs.vuetable.refresh();
      });
         }
         }
    },
    data () {
      return {
        fields: [
        {
          name: "__sequence",
          title: "#",
          titleClass: "center aligned",
          dataClass: "right aligned"
        },
        {
          name: "uName",
          title: '<i class="fas fa-lightbulb"></i>Ad '
        },
        {
          name: "uSurname",
          title: '<i class="fas fa-graduation-cap"></i>Soyad'
        },
        {
          name: "uPhone",
          title: '<i class="fas fa-building"></i>Telefon Numarası'
        },
        {
          name: "uEmail",
          title: '<i class="fas fa-building"></i>Mail Adresi'
        },
        {
          name: "__slot:actions",
          title: '<i class="fas fa-pen-fancy"></i>İşlemler'
        }
      ],
        currentData: [],
        moreParams: {},
        txt: '',
        query:"",
        loading: false,
        dataselected: false,
        titleData: {
          name: '',
          code: ''
        },
        selectedData: {}
      }
    },

    created () {
    },
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
     getActivityName(value) {
                return value[0] ? value[0].aName : "";
      },
       getSchoolName(value) {
                return value[0] ? value[0].sName : "";
      },
      onChangePage (page) {
      this.$refs.vuetable.changePage(page)
      },
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
        this.$refs.paginationInfo.setPaginationData(paginationData)
      },
      onLoading () {
        this.loading = true
      },
      onLoaded () {
        this.loading = false
      },
      onSearchHandler (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      },
      onDelete (item, i) {
      },
      exportExcel () {
      },
      onResetData () {
      },
      onError () {
        this.loading = false
      },
      onSuccess () {
        /* succesFetchDataApi */
      },
      onCancel () {
        this.dataselected = !this.dataselected
        this.onResetData()
      },
      onSelectData (data) {
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
    actiontype: 0,
            }
            this.$store.commit("setStudentModel", model);
            this.$router.push({
                 name: 'detailstudent', 
                 params: { id: data.id, data: data}
                });
      },
      onAction (action, data, index) {
        console.log('slot) action: ' + action, data, index)
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      async onFetchApi (apiUrl, httpOptions) {
        var data
         
        if(!this.query){
               this.query = {
                 ...this.query,
                 status: 0
               }
          data = this.$store.dispatch('fetchAssigningUsers', this.query);
           data.then(res => {
          })
          
          return data
        } else {
           let payload = {
               query: this.query,
               httpOpt: httpOptions,
           };
             this.query = {
               ...this.query,
               status: 1
             };
           console.log(this.query);
           data = this.$store.dispatch('fetchAssigningUsers', this.query);
           data.then(res => {
          })
          return data;
        }
      },
    }
  }
</script>

<style scoped></style>