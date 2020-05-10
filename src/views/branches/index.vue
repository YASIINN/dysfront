<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12  col-sm-12 col-lg-12" :headerTitle="$t('addbranch')">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-2  col-sm-2 col-lg-2">
              <div class="form-group" :class="{ 'has-danger': $v.branchData.code.$error }">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.branchData.code.$touch"
                    v-model.trim="$v.branchData.code.$model"
                    :className="{ 'is-invalid': $v.branchData.code.$error }"
                    :placeHolder="$t('enterbranchcode')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.branchData.code.required">{{$t('pleaseenterbranchcode')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-8  col-sm-8 col-lg-8">
              <div class="form-group" :class="{ 'has-danger': $v.branchData.name.$error }">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.branchData.name.$touch"
                    v-model.trim="$v.branchData.name.$model"
                    :className="{ 'is-invalid': $v.branchData.name.$error }"
                    :placeHolder="$t('enterbranchname')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.branchData.name.required">{{$t('pleaseenterbranchname')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2  col-sm-2 col-lg-2">
              <v-button
                :btnIcon="'fa-edit '"
                :className="'btn-info btn-sm mt-2 '"
                v-if="dataselected"
                :btnName="$t('update')"
                :disabled="$v.branchData.$invalid"
                @onClick="onUpdate($event)"
              ></v-button>
              <v-button
                :btnIcon="'fa-times'"
                :className="'btn-danger btn-sm mt-2'"
                v-if="dataselected"
                :btnName="$t('cancel')"
                @onClick="onCancel($event)"
              ></v-button>
              <v-button
                :disabled="$v.branchData.$invalid"
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                v-if="!dataselected"
                :btnName="$t('add')"
                @onClick="onCreateHandler($event)"
              ></v-button>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
    <flex column="col-md-12  col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <h3 class="mb-0">{{$t('branchlist')}}</h3>

          <div class="row">
            <div class="col-md-6  col-sm-6 col-lg-6 text-right">
              <v-button
                @onClick="exportExcel"
                :btnName="$t('exportExcel')"
                class="btn-primary btn-sm"
                btnIcon="fas fa-file-excel"
              ></v-button>
              <v-button
                @onClick="exportallData"
                :btnName="$t('allexportexcel')"
                class="btn-primary btn-sm"
                btnIcon="fas fa-file-excel"
              ></v-button>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <small class="text ml-3">{{$t('searchBranch')}}</small>
          <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
          <vuetable
            ref="vuetable"
            noDataTemplate="Kayıt Bulunamadı"
            :append-params="moreParams"
            :fields="$store.getters.getBranchesHeader"
            :http-fetch="onFetchApi"
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
    components: {
      SearchBox,
      VInput,
      Loading,
      Flex,
      FlexCard,
      VButton,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    },
    validations: {
      branchData: {
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
        branchData: {
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
        this.$store
          .dispatch('fetchAllBranches')
          .then(res => {
            this.loading = false
            if (res.data.length > 0) {
              let data = res.data
              let keys = ['bCode', 'bName']
              const header = ['Şube Kodu', 'Şube Adı']
              appPlugin.exportExcelTable(data, 'Şubeler', 14, keys, header)
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
          title: 'Şube Adı :' + ' ' + item.bName + '\n ' + this.$t('sureDelete'),
          icon: 'info',
          confirmButtonText: this.$t('yes'),
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true
            this.$store
              .dispatch('deleteBranches', {
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
          let keys = ['bCode', 'bName']
          const header = ['Şube Kodu', 'Şube Adı']
          appPlugin.exportExcelTable(data, 'Şubeler', 14, keys, header)
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
        this.branchData = {
          name: '',
          code: ''
        }
      },
      onError (err) {
        this.loading = false
        appPlugin.showalert(this.$t('fetchError'), '', 'error', this.$t('ok'))
      },
      onUpdate () {
        if (this.$v.branchData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterbranchcode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.branchData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterbranchname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          this.$store.dispatch('updateBranches', this.branchData).then(res => {
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
                  this.$t('branchaddedwarning'),
                  '',
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
        this.branchData = {
          name: data.bName,
          code: data.bCode,
          id: data.id
        }
      },
      onAction (action, data, index) {
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      onFetchApi (apiUrl, httpOptions) {
        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch('fetchBranches', {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('bName%' + this.txt)
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        } else {
          data = this.$store.dispatch('fetchBranches', {
            httpOpt: httpOptions
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        }
      },
      onCreateHandler () {
        if (this.$v.branchData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterbranchcode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.branchData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterbranchname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          let data = {
            created: this.branchData,
            urlparse: appPlugin.urlParse(
              'bName=' + this.branchData.name + '& bCode=' + this.branchData.code
            )
          }
          this.$store.dispatch('createBranches', data).then(res => {
            if (res.status === 200) {
              appPlugin.showalert(
                this.$t('succescreatemessage'),
                '',
                'success',
                this.$t('ok')
              )
              this.onResetData()
            } else if (res.status === 204) {
              appPlugin.showalert(
                this.$t('branchaddedwarning'),
                '',
                'warning',
                this.$t('ok')
              )
            } else if (res.status === 500) {
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
