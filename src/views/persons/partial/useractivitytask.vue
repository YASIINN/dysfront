<template>
  <v-tab-content :title="title" :tabKey="tabKey" icon="fa fa-user">
    <Loading v-if="loading"></Loading>

    <flex column="col-md-12 col-sm-12 col-lg-12">
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
        <span class="btn-inner&#45;&#45;text">{{ $t('allexportexcel') }}</span>
      </a>
      <div class="table-responsive">
        <SearchBox @search="onUserActivitySearch($event)" :placeHolderTxt="$t('search') "></SearchBox>
        <vuetable
          ref="vuetablea"
          :append-params="moreParamsActivity"
          :fields="$store.getters.getUserActivityHeader"
          :http-fetch="onFetchUserActivity"
          noDataTemplate="Kayıt Bulunamadı"
          pagination-path
          :per-page="5"
          @vuetable:load-success="onSuccessUserActivity"
          @vuetable:load-error="onErrorUserActivity"
          @vuetable:pagination-data="onPaginationDataUserActivity"
          @vuetable:loading="onLoadingUserActivity"
          @vuetable:loaded="onLoadedUserActivity"
        >
          <template slot="actions" scope="props">
            <div class="custom-actions">
              <v-tooltip-button
                :icon="'fas fa-trash'"
                :title="'Sil'"
                :btnColor="'red'"
                v-if="showDelete"
                @onClick="onDeleteUserActivity(props.rowData, props.rowIndex)"
              ></v-tooltip-button>
            </div>
          </template>
        </vuetable>
        <vuetable-pagination-info ref="paginationInfoa"></vuetable-pagination-info>
        <div class="dataTables_paginate paging_simple_numbers float-right">
          <vuetable-pagination-bootstrap
            class="float-right"
            ref="paginationa"
            @vuetable-pagination:change-page="onChangePageActivity"
          ></vuetable-pagination-bootstrap>
        </div>
      </div>
    </flex>
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
    name: 'useractivitytask',
    data () {
      return {
        moreParamsActivity: {},
        txt: '',
        currentData: [],
      }
    },
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
      user: {},
      tabKey: {},
      showDelete: {},
      icon: {},
      title: {},
      loadActivityTask: {},
      onreset: {}
    },
    watch: {
      onreset: function (val) {
        if (val == true) {
          this.onRefresh()
        }
      },
      currentData: function (val) {
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
          let keys = ['aCode', 'aName']
          const header = ['Faaliyet Kodu', 'Faaliyet Adı']
          appPlugin.exportExcelTable(
            data,
            this.user[0].uName.toUpperCase() +
            ' ' +
            this.user[0].uSurname.toUpperCase() +
            ' ' +
            ' Görevli Olduğu Faaliyetler',
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
        this.$refs.vuetablea.reload()
      },
      onDeleteUserActivity (item) {
        Swal.fire({
          title:
            this.$t('personname') +
            this.user[0].uName.toUpperCase() +
            ' ' +
            this.user[0].uSurname.toUpperCase() +
            '\n' +
            'Görevli Olduğu Faaliyet  :' +
            item.aName +
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
              .dispatch('deleteUserActivity', {
                userid: this.user[0].id,
                activityid: item.id
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
                this.$refs.vuetablea.reload()
                this.onCloseIndıcator()
              })
          }
        })
      },
      onFetchUserActivity (apiUrl, httpOptions) {
        let data
        if (this.txt.trim() != '') {
          if (isNaN(+this.$route.params.id) == false) {
            data = this.$store.dispatch('fetchUserActivity', {
              id: this.$route.params.id,
              httpOpt: httpOptions,
              query: appPlugin.urlParse('aName%' + this.txt)
            })
            data.then(res => {
              console.log('lalal', res)
              this.currentData = res
            })
            return data
          }
        } else {
          if (isNaN(+this.$route.params.id) == false) {
            data = this.$store.dispatch('fetchUserActivity', {
              httpOpt: httpOptions,
              id: this.$route.params.id
            })
            data.then(res => {
              this.currentData = res
            })
            return data
          }
        }
      },
      onSuccessUserActivity () {
      },
      onErrorUserActivity (err) {
        this.onCloseIndıcator()
        appPlugin.showalert(
          'Kayıtlar Getirilirken Bir Hata Gerçekleşti Lütfen Daha Sonra Tekrar Deneyin',
          '',
          'error',
          'Tamam'
        )
      },
      onPaginationDataUserActivity (paginationData) {
        this.$refs.paginationa.setPaginationData(paginationData)
        this.$refs.paginationInfoa.setPaginationData(paginationData)
      },
      onLoadingUserActivity () {
        this.onOpenIndıcator()
      },
      onLoadedUserActivity () {
        this.onCloseIndıcator()
      },
      onChangePageActivity (page) {
        this.$refs.vuetablea.changePage(page)
      },
      onUserActivitySearch (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetablea.refresh()
        })
      }
    }
  }
</script>

<style scoped>
</style>
