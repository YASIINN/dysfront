<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-lg-12 col-md-12 col-sm-12" :headerTitle="$t('addunits')">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-2  col-sm-2 col-lg-2">
              <div class="form-group" :class="{ 'has-danger': $v.unitData.code.$error }">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.unitData.code.$touch"
                    v-model.trim="$v.unitData.code.$model"
                    :className="{ 'is-invalid': $v.unitData.code.$error }"
                    :placeHolder="$t('enterunitscode')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.unitData.code.required">{{$t('pleaseenterunitscode')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-8 col-sm-8 col-lg-8">
              <div class="form-group" :class="{ 'has-danger': $v.unitData.name.$error }">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.unitData.name.$touch"
                    v-model.trim="$v.unitData.name.$model"
                    :className="{ 'is-invalid': $v.unitData.name.$error }"
                    :placeHolder="$t('enterunitsname')"
                    :inputType="'text'"
                  ></v-input>

                  <div class="invalid-feedback">
                    <small v-if="!$v.unitData.name.required">{{$t('pleaseenterunitsname')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2 col-sm-2 col-lg-2">
              <v-button
                :btnIcon="'fa-edit'"
                :className="'btn-info btn-sm mt-2'"
                v-if="dataselected"
                :btnName="$t('update')"
                :disabled="$v.unitData.$invalid"
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
                :disabled="$v.unitData.$invalid"
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
    <flex column="col-lg-12 col-md-12 col-sm-12">
      <div class="card">
        <div class="card-header border-0">
          <h3 class="mb-0">{{$t('units')}}</h3>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12 text-right">
              <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
              <v-button :btnName="$t('allexportexcel')" className="btn btn-primary btn-sm" @onClick="exportallData"/>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <small class="text ml-3">Birim Adına Göre Arama Yapar</small>
          <SearchBox @search="onSearchHandler($event)"></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="$store.getters.getUnitsHeader"
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
  import {
    FETCH_UNITS,
    CREATE_UNITS,
    DELETE_UNITS,
    UPDATE_UNITS,
    FETCH_ALL_UNITS
  } from '@/store/modules/units/moduleNames'

  export default {
    name: 'index',
    components: {
      FlexCard,
      Flex,
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
      unitData: {
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
        unitData: {
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
        this.$store.dispatch(FETCH_ALL_UNITS).then((res) => {
          this.loading = false
          if (res.data.length > 0) {
            let data = res.data
            let keys = ['uCode', 'uName']
            const header = ['Birim Kodu', 'Birim Adı']
            appPlugin.exportExcelTable(data, 'Birimler', 14, keys, header)
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
          title: 'Birim Adı :' + '  ' + item.uName + '\n' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          icon: 'info',
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true
            this.$store
              .dispatch(DELETE_UNITS, {
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
          let keys = ['uCode', 'uName']
          const header = ['Birim Kodu', 'Birim Adı']
          appPlugin.exportExcelTable(data, 'Birimler', 14, keys, header)
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
        this.unitData = {
          name: '',
          code: ''
        }
      },
      onError () {
        this.loading = false
        appPlugin.showalert(
          this.$t('getRecordErro'),
          '',
          'error',
          this.$t('ok')
        )
      },
      onUpdate () {
        if (this.$v.unitData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterunitscode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.unitData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterunitsname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          this.$store.dispatch(UPDATE_UNITS, this.unitData).then(res => {
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
                  this.$t('unitscodewarning'),
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
        this.unitData = {
          name: data.uName,
          code: data.uCode,
          id: data.id
        }
      },
      onAction (action, data, index) {
        console.log('slot) action: ' + action, data, index)
      },
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      onFetchApi (apiUrl, httpOptions) {
        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch(FETCH_UNITS, {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('uName%' + this.txt)
          })
          data.then(res => {
            console.log('lalal', res)
            this.currentData = res
          })
          return data
        } else {
          data = this.$store.dispatch(FETCH_UNITS, {
            httpOpt: httpOptions
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        }
      },
      onCreateHandler () {
        if (this.$v.unitData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterunitscode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.unitData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterunitsname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          let data = {
            created: this.unitData,
            urlparse: appPlugin.urlParse(
              'uName=' + this.unitData.name + '& uCode=' + this.unitData.code
            ),
            orqparse: appPlugin.urlParse('uCode=' + this.unitData.code)
          }
          this.$store.dispatch(CREATE_UNITS, data).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(this.$t('succescreatemessage'), '', 'success', this.$t('ok'))
                this.onResetData()
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('unitscodewarning'),
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
