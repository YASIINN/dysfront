<template>
  <flex column="col-md-12 col-sm-12 col-lg-12">
    <Loading v-if="loading"></Loading>
    <div class="card">
      <div class="card-header border-0">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <h3 class="mb-0">{{sporClub.scName+ ' '}}Takım ve Şubeleri</h3>
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
        <small class="text ml-3">{{$t('searchTeamName')}}</small>
        <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
        <vuetable
          ref="vuetable"
          :append-params="moreParams"
          :fields="$store.getters.getSCTeamBranchHeader"
          :http-fetch="onFetchApi"
          :noDataTemplate="$t('noData')"
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
                :icon="'fas fa-trash'"
                :title="'Sil'"
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
  } from '@/Providers/defaultImports'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    name: 'teambranchlist',
    data () {
      return {
        currentData: [],
        moreParams: {},
        txt: '',
      }
    },
    props: {
      onreset: {},
      sporClub: {}
    },
    created () {
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
    watch: {
      onreset: function (val) {
        if (val == true) {
          this.onRefreshTableContent()
          this.$emit('onRefresh', true)
        }
      }
    },
    methods: {
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      onFetchApi (apiUrl, httpOptions) {
        if (isNaN(+this.$route.params.id) == false) {
          var data
          if (this.txt.trim() != '') {
            data = this.$store.dispatch('fetchSCTeamBranch', {
              httpOpt: httpOptions,
              query: appPlugin.urlParse(
                'spor_club.id=' + this.$route.params.id + '& stName%' + this.txt
              )
            })
            data.then(res => {
              console.log('lalal', res)
              this.currentData = res
            })
            return data
          } else {
            data = this.$store.dispatch('fetchSCTeamBranch', {
              httpOpt: httpOptions,
              query: appPlugin.urlParse('spor_club.id=' + this.$route.params.id)
            })
            data.then(res => {
              this.currentData = res
            })
            return data
          }
        } else {
          appPlugin.showalert(
            this.$t('invalidparam'),
            '',
            'error',
            this.$t('ok')
          )
          this.$router.replace('/sporclub')
        }
      },
      exportallData () {
        this.onOpenIndıcator()

        this.$store
          .dispatch('fetchAllExportExcel', { id: this.$route.params.id })
          .then(res => {
            this.onCloseIndıcator()
            if (res.length > 0) {
              let data = res
              let keys = [
                'scCode',
                'scName',
                'stCode',
                'stName',
                'sbCode',
                'sbName'
              ]
              const header = [
                'Kulüp Kodu',
                'Kulüp Adı',
                'Takım Kodu',
                'Takım Adı',
                'Şube Kodu',
                'Şube Adı'
              ]
              appPlugin.exportExcelTable(
                data,
                this.sporClub.scName + ' ' + 'Takım Bilgisi',
                14,
                keys,
                header
              )
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
            this.onCloseIndıcator()
          })
      },
      onChangePage (page) {
        this.$refs.vuetable.changePage(page)
      },
      onSuccess () {
      },
      onError (err) {
        this.onCloseIndıcator()
        appPlugin.showalert(this.$t('fetchError'), '', 'error', this.$t('ok'))
      },
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
        this.$refs.paginationInfo.setPaginationData(paginationData)
      },
      onLoading () {
        this.onOpenIndıcator()
      },
      onLoaded () {
        this.onCloseIndıcator()
      },
      onSearchHandler (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      },
      onDelete (item, i) {
        Swal.fire({
          title:
            'Spor Kulübü Adı : ' +
            ' ' +
            item.scName +
            '\n' +
            'Takım Adı :' +
            ' ' +
            item.stName +
            '\n' +
            'Şube Adı :' +
            ' ' +
            item.sbName +
            ' ' +
            '\n' +
            'Kaydını Silmek İstediğinize Emin Misiniz ?',
          confirmButtonText: 'Evet',
          confirmButtonColor: 'red',
          icon: 'info',
          cancelButtonText: 'Vazgeç',
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.onOpenIndıcator()
            this.$store
              .dispatch('deleteSCTeamBranch', {
                deleted: item,
                index: i
              })
              .then(res => {
                if (res.status) {
                  if (res.status === 200) {
                    appPlugin.showalert(
                      'Kayıt Başarıyla Silindi',
                      '',
                      'success',
                      'Tamam'
                    )
                  }
                } else {
                  appPlugin.showalert(
                    'Kayıt Silinirken Hata Gerçekleşti',
                    '',
                    'error',
                    'Tamam'
                  )
                }
                this.onRefreshTableContent()
                this.onCloseIndıcator()
              })
          }
        })
      },
      exportExcel () {
        if (this.currentData.data.data.length > 0) {
          let data = this.currentData.data.data
          let keys = ['scCode', 'scName', 'stCode', 'stName', 'sbCode', 'sbName']
          const header = [
            'Kulüp Kodu',
            'Kulüp Adı',
            'Takım Kodu',
            'Takım Adı',
            'Şube Kodu',
            'Şube Adı'
          ]
          appPlugin.exportExcelTable(
            data,
            this.sporClub.scName + ' ' + 'Takım Bilgisi',
            14,
            keys,
            header
          )
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }
      }
    }
  }
</script>

<style scoped>
</style>
