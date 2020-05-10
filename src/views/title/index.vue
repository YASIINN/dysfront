<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12 col-md-12 col-sm-12" :headerTitle="$t('addTitles')">
      <div class="card-body">
        <flex column="col-md-2 col-sm-2 col-lg-2"></flex>
        <div class="row">
          <div class="col-md-2 col-sm-2 col-lg-2">
            <div class="form-group" :class="{ 'has-danger': $v.titleData.code.$error }">
              <div class="input-group input-group-merge">
                <v-input
                  @onBlurInput="$v.titleData.code.$touch"
                  v-model.trim="$v.titleData.code.$model"
                  :className="{ 'is-invalid': $v.titleData.code.$error }"
                  :placeHolder="$t('titleCodePlcHolderMsg')"
                  :inputType="'text'"
                ></v-input>
                <div class="invalid-feedback">
                  <small v-if="!$v.titleData.code.required">{{$t('titleCodeRequiredrMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8 col-sm-8 col-lg-8">
            <div class="form-group" :class="{ 'has-danger': $v.titleData.name.$error }">
              <div class="input-group input-group-merge">
                <v-input
                  @onBlurInput="$v.titleData.name.$touch"
                  v-model.trim="$v.titleData.name.$model"
                  :className="{ 'is-invalid': $v.titleData.name.$error }"
                  :placeHolder="$t('titleNamePlcHolderMsg')"
                  :inputType="'text'"
                ></v-input>

                <div class="invalid-feedback">
                  <small v-if="!$v.titleData.name.required">{{$t('titleNameRequiredrMsg')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-2 col-sm-2 col-lg-2">
            <v-button
              :btnIcon="'fa-edit'"
              :className="'btn-info btn-sm'"
              v-if="dataselected"
              :btnName="$t('update')"
              :disabled="$v.titleData.$invalid"
              @onClick="onUpdate($event)"
            ></v-button>
            <v-button
              :btnIcon="'fa-times'"
              :className="'btn-danger btn-sm'"
              v-if="dataselected"
              :btnName="$t('cancel')"
              @onClick="onCancel($event)"
            ></v-button>
            <v-button
              :disabled="$v.titleData.$invalid"
              :btnIcon="'fa-plus-circle'"
              :className="'btn-primary'"
              v-if="!dataselected"
              :btnName="$t('add')"
              @onClick="onCreateHandler($event)"
            ></v-button>
          </div>
        </div>
      </div>
    </flex-card>

    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <h3 class="mb-0">{{ $t('titles') }}</h3>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12 text-right">
              <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
              <v-button :btnName="$t('allexportexcel')" className="btn btn-primary btn-sm" @onClick="exportallData"/>
            </div>
          </div>
        </div>
        <!-- Light table -->
        <div class="table-responsive">
          <small class="text ml-3">{{$t('searchTitleName')}}</small>
          <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="getLang"
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
                  :icon="'fa-user-edit'"
                  :title="'Düzenle'"
                  :btnColor="'orange'"
                  @onClick="onSelectData(props.rowData)"
                ></v-tooltip-button>
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
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {
    FETCH_TITLES,
    CREATE_TITLES,
    UPDATE_TITLE,
    DELETE_TITLE,
    FETCH_ALL_TITLES
  } from '@/store/modules/titles/moduleNames'
  import {
    SearchBox,
    Loading,
    FlexCard,
    Flex,
    VButton,
    required,
    VInput,
    VTooltipButton,
    Vuetable,
    Swal,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'
  export default {
    name: 'index',
    computed: {
      ...mapGetters(['getLang']),
      getLang: {
        get: function () {
          return this.$store.getters.getTitleHeader
        }
      }
    },
    components: {
      Flex,
      FlexCard,
      SearchBox,
      Loading,
      VInput,
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
        },
        code: {
          required
        }
      }
    },
    data () {
      return {
        currentData: [],
        moreParams: {},
        txt: '',
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
      exportallData () {
        this.loading = true
        this.$store.dispatch(FETCH_ALL_TITLES).then((res) => {
          this.loading = false
          if (res.length > 0) {
            let data = res
            let keys = ['tCode', 'tName']
            const header = ['Ünvan Kodu', 'Ünvan Adı']
            appPlugin.exportExcelTable(data, 'Ünvanlar', 14, keys, header)
          } else {
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
        Swal.fire({
          title: item.tName + ' ' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          icon: 'info',
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true
            this.$store
              .dispatch(DELETE_TITLE, {
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

                this.onRefreshTableContent()
                this.loading = false
              })
          }
        })
      },
      exportExcel () {
        if (this.currentData.data.data.length > 0) {
          let data = this.currentData.data.data
          let keys = ['tCode', 'tName']
          const header = ['Ünvan Kodu', 'Ünvan Adı']
          appPlugin.exportExcelTable(data, 'Ünvanlar', 14, keys, header)
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }
      },
      onResetData () {
        this.dataselected = false
        this.selectedData = {}
        this.titleData = {
          name: '',
          code: ''
        }
      },
      onError (err) {

        this.loading = false

        appPlugin.showalert(
          this.$t('getRecordErro'),
          '',
          'error',
          this.$t('ok')
        )
      },
      onUpdate () {
        if (this.$v.titleData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('titleCodeRequiredrMsg'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.titleData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('titleNameRequiredrMsg'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          this.$store.dispatch(UPDATE_TITLE, this.titleData).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(
                  this.$t('updateSuccesMsg'),
                  '',
                  'success',
                  this.$t('ok')
                )
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('titlewarning'),
                  'warning',
                  this.$t('ok')
                )
              }
            } else {
              appPlugin.showalert(
                this.$t('updateErrorMsg'),
                '',
                'error',
                this.$t('ok')
              )
            }

            this.onRefreshTableContent()
            this.loading = false
            this.onResetData()
          })
        }
      },
      onSuccess () {
        /* succesFetchDataApi */
      },
      onCancel () {
        this.dataselected = !this.dataselected
        this.onResetData()
      },
      onSelectData (data) {
        this.dataselected = true
        this.titleData = {
          name: data.tName,
          code: data.tCode,
          id: data.id
        }
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      onFetchApi (apiUrl, httpOptions) {

        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch(FETCH_TITLES, {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('tName%' + this.txt)
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        } else {

          data = this.$store.dispatch(FETCH_TITLES, {
            httpOpt: httpOptions
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        }
      },
      onCreateHandler () {
        if (this.$v.titleData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('titleCodeRequiredrMsg'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.titleData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),

            this.$t('titleNameRequiredrMsg'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          let data = {
            created: this.titleData,
            urlparse: appPlugin.urlParse(
              'tName=' + this.titleData.name + '& tCode=' + this.titleData.code
            ),
            orqparse: appPlugin.urlParse('tCode=' + this.titleData.code)
          }
          this.$store.dispatch(CREATE_TITLES, data).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(this.$t('succescreatemessage'), '', 'success', this.$t('ok'))
                this.onResetData()
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('titlewarning'),
                  'warning',
                  this.$t('ok')
                )
              }
            } else {
              appPlugin.showalert(
                this.$t('errorcreatemessage'),
                '',
                'error',
                this.$t('ok')
              )
            }
            this.onRefreshTableContent()
            this.loading = false
          })
        }
      }
    }
  }
</script>

<style scoped></style>
