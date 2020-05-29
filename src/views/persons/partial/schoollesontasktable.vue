<template>
  <v-tab-content title="title" :tabKey="tabKey" :icon="icon">
    <Loading v-if="loading"></Loading>
    <div class="row">
      <div class="col-md-12 col-sm-12 col-lg-12">
        <a
          href="#"
          class="btn btn-sm btn-primary btn-round btn-icon float-right mb-2"
          data-toggle="tooltip"
          data-original-title="Edit product"
          @click="exportExcel"
        >
          <span class="btn-inner&#45;&#45;icon">
            <i class="fas fa-file-excel"></i>
          </span>
          <span class="btn-inner&#45;&#45;text">{{ $t('exportExcel') }}</span>
        </a>
        <a
          href="#"
          class="btn btn-sm btn-primary btn-round btn-icon float-right mb-2"
          data-toggle="tooltip"
          data-original-title="Edit product"
        >
          <span class="btn-inner&#45;&#45;icon">
            <i class="fas fa-file-excel"></i>
          </span>
          <span class="btn-inner&#45;&#45;text">{{
            $t('allexportexcel')
          }}</span>
        </a>
        <div class="table-responsive">
          <SearchBox
            @search="onUserLessonSearch($event)"
            :placeHolderTxt="$t('search')"
          ></SearchBox>
          <vuetable
            ref="vuetablelesson"
            :append-params="ulmoreParams"
            :fields="$store.getters.getUserLessonsHeader"
            :http-fetch="onFetchUserLesson"
            noDataTemplate="Kayıt Bulunamadı"
            pagination-path
            :per-page="5"
            @vuetable:load-success="onUserLessonSuccess"
            @vuetable:load-error="onUserLessonError"
            @vuetable:pagination-data="onUserLessonPaginationData"
            @vuetable:loading="onUserLessonLoading"
            @vuetable:loaded="onUserLessonLoaded"
          >
            <template slot="actions" scope="props">
              <div class="custom-actions">
                <v-tooltip-button
                  :icon="'fas fa-trash'"
                  :title="'Sil'"
                  :btnColor="'red'"
                  v-if="showDelete"
                  @onClick="onDeleteUserLesson(props.rowData, props.rowIndex)"
                ></v-tooltip-button>
              </div>
            </template>
          </vuetable>
          <vuetable-pagination-info
            ref="paginationInfo2"
          ></vuetable-pagination-info>
          <div class="dataTables_paginate paging_simple_numbers float-right">
            <vuetable-pagination-bootstrap
              class="float-right"
              ref="pagination2"
              @vuetable-pagination:change-page="onUserLessonChangePage"
            ></vuetable-pagination-bootstrap>
          </div>
        </div>
      </div>
    </div>
  </v-tab-content>
</template>

<script>
  import SearchBox from '@/components/searchBox'
  import Loading from '@/components/loading'
  import VTooltipButton from '@/components/tooltipButton'
  import VTabContent from '@/components/tabbarcontent'
  import appPlugin from '@/Providers/appPlugins'
  import Vuetable from 'vuetable-2/src/components/Vuetable'
  import VuetablePaginationBootstrap from '@/components/datatable/VuetablePaginationBootstrap'
  import VuetablePaginationInfo from '@/components/datatable/VuetablePaginationInfo'
  import Flex from '@/components/layout'
  import tooltip from '@/components/tooltip'
  import FlexCard from '@/components/flexwithcard'
  import Swal from 'sweetalert2'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    components: {
      Flex,
      FlexCard,
      tooltip,
      VTabContent,
      SearchBox,
      Loading,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    },
    props: {
      showDelete: {},
      user: {},
      tabKey: {},
      icon: {},
      title: {},
      loadSchoolTask: {},
      onreset: {}
    },
    watch: {
      onreset: function (val) {
        if (val == true) {
          this.onRefresh()
        }
      }
    },
    methods: {
      exportExcel () {
        let data = this.currentData.data.data
        if (data.length < 1) {
          appPlugin.showalert(
            'Uyarı',
            'Excele Veri Aktarmak İçin Tabloda Verileriniz Olması Gerekmektedir',
            'info',
            'Tamam'
          )
        } else {
          let keys = ['sCode', 'sName', 'lCode', 'lName']
          const header = ['Okul Kodu', 'Okul Adı', 'Ders Kodu', 'Ders Adı']
          appPlugin.exportExcelTable(
            data,
            this.user[0].uName.toUpperCase() +
            ' ' +
            this.user[0].uSurname.toUpperCase() +
            ' ' +
            ' Görevli Olduğu Dersler',
            14,
            keys,
            header
          )
        }
      },
      allExportExcel () {
        //TODO
      },
      onRefresh () {
        this.$refs.vuetablelesson.reload()
      },
      onUserLessonSuccess () {
      },
      onUserLessonError (err) {
        this.onCloseIndıcator()
        appPlugin.showalert(this.$t('getRecordErro'), '', 'error', this.$t('ok'))
      },
      onDeleteUserLesson (item, i) {
        Swal.fire({
          title:
            this.$t('personname') +
            this.user[0].uName.toUpperCase() +
            ' ' +
            this.user[0].uSurname.toUpperCase() +
            '\n' +
            this.$t('lessonname') +
            item.lName +
            '\n' +
            this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('cancel'),
          icon: 'warning',
          showCancelButton: true
        }).then(res => {
          if (res.value) {

            this.onOpenIndıcator()
            this.$store
              .dispatch('deleteUserSchoolLesson', {
                deleted: item,
                index: i
              })
              .then(res => {
                if (res.status) {
                  if (res.status === 200) {
                    appPlugin.showalert(
                      this.$t('deleteRecordMsg'),
                      '',
                      'success',
                      this.$t('ok')
                    )
                  }
                } else {
                  appPlugin.showalert(
                    this.$t('deleteRecordErrMsg'),
                    '',
                    'error',
                    this.$t('ok')
                  )
                }
                this.$refs.vuetablelesson.reload()
                this.onCloseIndıcator()
              })
          }
        })
      },
      onUserLessonLoading () {
        this.onOpenIndıcator()
      },
      onUserLessonLoaded () {
        this.onCloseIndıcator()
      },
      onUserLessonPaginationData (paginationData) {
        this.$refs.pagination2.setPaginationData(paginationData)
        this.$refs.paginationInfo2.setPaginationData(paginationData)
      },
      onUserLessonChangePage (page) {
        this.$refs.vuetablelesson.changePage(page)
      },
      onFetchUserLesson (apiUrl, httpOptions) {
        if (this.onreset) {
          var data
          if (this.txt.trim() != '') {
            if (isNaN(+this.$route.params.id) == false) {
              data = this.$store.dispatch('getUserLessonU', {
                httpOpt: httpOptions,
                query: appPlugin.urlParse(
                  'lName%' + this.txt + '& user_id=' + this.$route.params.id
                )
              })
              data.then(res => {
                console.log('lalal', res)
                this.currentData = res
              })
              return data
            }
          } else {
            if (isNaN(+this.$route.params.id) == false) {
              data = this.$store.dispatch('getUserLessonU', {
                httpOpt: httpOptions,
                query: appPlugin.urlParse('user_id=' + this.$route.params.id)
              })
              data.then(res => {
                this.currentData = res
              })
              return data
            }
          }
        }
      },
      onUserLessonSearch (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetablelesson.refresh()
        })
      }
    },
    data () {
      return {
        ulmoreParams: {},
        txt: '',
        currentData: [],
      }
    },
    name: 'schoollesontasktable'
  }
</script>

<style scoped></style>
