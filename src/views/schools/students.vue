<template>
  <div>
    <Loading v-if="loading"></Loading>

    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <div class="row">
            <div class="col-md-6 col-sm-6 col-lg-6">
              <h3 class="mb-0"> {{this.$store.getters.getSchools.sName }} Öğrenciler</h3>
            </div>
            <div class="col-md-6 col-sm-6 col-lg-6 text-right">
              <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
              <v-button :btnName="$t('allexportexcel')" className="btn btn-primary btn-sm" @onClick="exportallData"/>

            </div>
          </div>
        </div>
        <div class="table-responsive">
          <small class="text ml-4">{{$t('searchStudentNameSurname')}}</small>
          <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="$store.getters.getSchoolStudentsHeader"
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

              <router-link tag="a" class="font-weight-bold" :to="'/students/'+props.rowData.id">Detay</router-link>


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
  </div>
</template>

<script>
  import AlertBox from '@/components/alert'
  import Flex from '@/components/layout'
  import FlexCard from '@/components/flexwithcard'
  import Multiselect from 'vue-multiselect'
  import SearchBox from '@/components/searchBox'
  import Loading from '@/components/loading'
  import VSelect from '@/components/select'
  import VButton from '@/components/button'
  import VTabs from '@/components/tabbars'
  import VTabContent from '@/components/tabbarcontent'
  import VTooltipButton from '@/components/tooltipButton'
  import appPlugin from '@/Providers/appPlugins'
  import Vuetable from 'vuetable-2/src/components/Vuetable'
  import VuetablePaginationBootstrap from '@/components/datatable/VuetablePaginationBootstrap'
  import VuetablePaginationInfo from '@/components/datatable/VuetablePaginationInfo'

  export default {
    data () {
      return {
        moreParams: {},
        txt: '',
        loading: false,
      }
    },
    created () {
      this.showSchool()
    },
    methods: {
      showSchool () {
        this.$store.dispatch('showSchool', { id: this.$route.params.schoolid }).then((res) => {
          if (res.id == undefined) {
            this.$router.replace('/schools')
          }
        }).catch((err) => {

        })
      },
      exportExcel () {
        let data = this.currentData.data.data
        if (data.length > 0) {
          let keys = ['s_tc', 's_name', 's_surname', 'school_no', 'cName', 'bName']
          const header = ['Öğrenci TC', 'Öğrenci Adı', 'Öğrenci SoyAdı', 'Okul No', 'Sınıf Adı', 'Şube Adı']
          appPlugin.exportExcelTable(data, data[0].sName + ' ' + 'Okuluna Ait Öğrenciler', 14, keys, header)
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }

      },
      exportallData () {
        this.loading = true
        this.$store.dispatch('fetchAllStudentsSchool', {
          query: appPlugin.urlParse('school_id=' + this.$route.params.schoolid)
        }).then((res) => {

          if (res.length > 0) {
            let keys = ['s_tc', 's_name', 's_surname', 'school_no', 'cName', 'bName']
            const header = ['Öğrenci TC', 'Öğrenci Adı', 'Öğrenci SoyAdı', 'Okul No', 'Sınıf Adı', 'Şube Adı']
            appPlugin.exportExcelTable(res, res[0].sName + ' ' + 'Okuluna Ait Öğrenciler', 14, keys, header)
            this.loading = false
          } else {
            this.loading = false
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('excelExportWarning'),
              'info',
              this.$t('ok')
            )
          }
        }).catch((err) => {
          this.loading = false
        })
      },
      onError () {
        this.loading = false
        appPlugin.showalert(
          'Kayıtlar Getirilirken Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin',
          '',
          'error',
          'Tamam'
        )
      },
      onSearchHandler (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })

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
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      onSuccess () {
      },
      onFetchApi (apiUrl, httpOptions) {
        if (isNaN(+this.$route.params.schoolid) == false) {
          var data
          if (this.txt.trim() != '') {
            data = this.$store.dispatch('fetchSchoolStudents', {
              httpOpt: httpOptions,
              query: appPlugin.urlParse('s_fullname%' + this.txt + '& school_id=' + this.$route.params.schoolid)
            })
            data.then(res => {
              console.log('lalal', res)
              this.currentData = res
            })
            return data
          } else {
            data = this.$store.dispatch('fetchSchoolStudents', {
              httpOpt: httpOptions,
              query: appPlugin.urlParse('school_id=' + this.$route.params.schoolid)
            })
            data.then(res => {
              this.currentData = res
            })
            return data
          }
        } else {
          appPlugin.showalert(this.$t('invalidparam'), '', 'error', this.$t('ok'))
          this.$router.replace('/schools')
        }
      }
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
    },
    name: 'students'
  }
</script>

<style scoped>

</style>
