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
        <alert-box
          class="alert-secondary"
          iconName="fa fa-check-circle"
          v-if="showAlert"
          @onClose="showAlert=false"
        >
          {{this.$store.getters.getSchools.sName}} Ait Öğrenci Bulunamadı.Eklemek İçin
          <router-link tag="a" target="_blank" :to="'/createstudent'">Buraya Tıklayın.</router-link>
        </alert-box>
      </div>
    </flex>
  </div>
</template>

<script>
  import {
    AlertBox,
    appPlugin
  } from '@/Providers/defaultImports'
  import loadingMixins from '@/mixins/loading'
  import vuetableMixins from '@/mixins/vuetable'
  import defaulcomponentsMixins from '@/mixins/defaultcomponents'

  export default {
    mixins: [loadingMixins, vuetableMixins, defaulcomponentsMixins],
    created () {
      this.showSchool()
    },
    data () {
      return {
        showAlert: false,
      }
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
        this.onOpenIndıcator()
        this.$store.dispatch('fetchAllStudentsSchool', {
          query: appPlugin.urlParse('school_id=' + this.$route.params.schoolid)
        }).then((res) => {

          if (res.length > 0) {
            let keys = ['s_tc', 's_name', 's_surname', 'school_no', 'cName', 'bName']
            const header = ['Öğrenci TC', 'Öğrenci Adı', 'Öğrenci SoyAdı', 'Okul No', 'Sınıf Adı', 'Şube Adı']
            appPlugin.exportExcelTable(res, res[0].sName + ' ' + 'Okuluna Ait Öğrenciler', 14, keys, header)
            this.onCloseIndıcator()
          } else {
            this.onCloseIndıcator()
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('excelExportWarning'),
              'info',
              this.$t('ok')
            )
          }
        }).catch((err) => {
          this.onCloseIndıcator()
        })
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
              this.showAlert = res.data.data.length < 1 ? true : false
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
    },
    name: 'students'
  }
</script>

<style scoped>

</style>
