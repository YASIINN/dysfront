<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12  col-sm-12 col-lg-12" :headerTitle="$t('createclass')">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-2  col-sm-2 col-lg-2">
              <div class="form-group" :class="{'has-danger':$v.clasesData.code.$error}">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.clasesData.code.$touch"
                    v-model.trim="$v.clasesData.code.$model"
                    :className="{'is-invalid':$v.clasesData.code.$error}"
                    :placeHolder="$t('enterclascode')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.clasesData.code.required">{{$t('pleaseenterclascode')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-8  col-sm-8 col-lg-8">
              <div class="form-group" :class="{'has-danger':$v.clasesData.name.$error}">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.clasesData.name.$touch"
                    v-model.trim="$v.clasesData.name.$model"
                    :className="{'is-invalid':$v.clasesData.name.$error}"
                    :placeHolder="$t('enterclassname')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.clasesData.name.required">{{$t('pleaseenterclassname')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2  col-sm-2 col-lg-2">
              <v-button
                :btnIcon="'fa-edit'"

                :className="'btn-info btn-sm'"
                v-if="dataselected"
                :disabled="$v.clasesData.$invalid"
                :btnName="$t('update')"
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
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                v-if="!dataselected"
                :btnName="$t('add')"
                :disabled="$v.clasesData.$invalid"
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
          <h3 class="mb-0">{{$t('classlist')}}</h3>

          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 text-right">
              <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
              <v-button :btnName="$t('allexportexcel')" className="btn btn-primary btn-sm" @onClick="exportallData"/>
            </div>
          </div>
        </div>
        <!-- Light table -->
        <div class="table-responsive">
          <div class="table-responsive">
            <small class="text ml-3">{{$t('searchClass')}}</small>
            <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
            <vuetable
              ref="vuetable"
              noDataTemplate="Kayıt Bulunamadı"
              :append-params="moreParams"
              :fields="$store.getters.getClasesHeader"
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
      FlexCard,
      Flex,
      Loading,
      VInput,
      VButton,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo
    },
    data () {
      return {
        currentData: [],
        moreParams: {},
        txt: '',
        loading: false,
        dataselected: false,
        clasesData: {
          name: '',
          code: ''
        },
        selectedData: {}
      }
    },
    created () {
    },
    validations: {
      clasesData: {
        name: {
          required
        },
        code: {
          required
        }
      }
    },
    methods: {
      exportallData () {
        this.loading = true
        this.$store.dispatch('fetchAllClases').then((res) => {
          if (res.data.length > 0) {
            let data = res.data
            let keys = ['cName', 'cCode']
            const header = ['Sınıf Kodu', 'Sınıf Adı']
            appPlugin.exportExcelTable(data, 'Sınıflar', 14, keys, header)
          } else {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('excelExportWarning'),
              'info',
              this.$t('ok')
             )

          }
          this.loading = false
        }).catch((err) => {
          this.loading = false
        })
      },
      onFetchApi (apiUrl, httpOptions) {

        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch('fetchClases', {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('cName%' + this.txt)
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        } else {
          data = this.$store.dispatch('fetchClases', {
            httpOpt: httpOptions
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        }
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
      onSuccess () {
        /* succesFetchDataApi */
      },
      onError () {
        this.loading = false
        appPlugin.showalert(
          this.$t('fetchError'),
          '',
          'error',
          this.$t('ok')
        )
      },
      onUpdate () {
        if (this.$v.clasesData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterclascode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.clasesData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterclassname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          this.$store.dispatch('updateClases', this.clasesData).then(res => {
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
                  this.$t('claseswarningerror'),
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
            this.onResetData()
            this.loading = false
          })
        }
      },
      onResetData () {
        this.dataselected = false
        this.selectedData = {}
        this.clasesData = {
          name: '',
          code: ''
        }
      },
      onSelectData (data) {
        this.dataselected = true

        this.clasesData = {
          name: data.cName,
          code: data.cCode,
          id: data.id
        }
      },
      onDelete (item, i) {
        Swal.fire({
          title: 'Sınıf Adı :' + ' ' + item.cName + ' \n' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          icon: 'info',
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.loading = true
            this.$store
              .dispatch('deleteClases', {
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
      onRefreshTableContent () {
        this.$refs.vuetable.reload()
      },
      onCancel () {
        this.dataselected = !this.dataselected
        this.onResetData()
      },
      onCreateHandler () {
        if (this.$v.clasesData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterclascode'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.clasesData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseenterclassname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.loading = true
          let data = {
            created: this.clasesData,
            urlparse: appPlugin.urlParse(
              'cName=' + this.clasesData.name + '& cCode=' + this.clasesData.code
            ),
            orqparse: appPlugin.urlParse('cCode=' + this.clasesData.code)
          }
          this.$store.dispatch('createClases', data).then(res => {

            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(this.$t('succescreatemessage'), '', 'success', this.$t('ok'))
                this.onResetData()
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('claseswarningerror'),
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
      },
      exportExcel () {
        if (this.currentData.data.data.length > 0) {
          let data = this.currentData.data.data
          let keys = ['cName', 'cCode']
          const header = ['Sınıf Kodu', 'Sınıf Adı']
          appPlugin.exportExcelTable(data, 'Sınıflar', 14, keys, header)
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }

      },
      onSearchHandler (txt) {
        this.txt = txt
        this.$nextTick(function () {
          this.$refs.vuetable.refresh()
        })
      }
    }
  }
</script>

<style scoped>
</style>
