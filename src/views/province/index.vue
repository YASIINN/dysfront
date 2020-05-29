<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="$t('addprovince')">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-2 col-sm-2 col-lg-2">
              <div class="form-group" :class="{'has-danger':$v.provinceData.code.$error}">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.provinceData.code.$touch"
                    v-model.trim="$v.provinceData.code.$model"
                    :className="{'is-invalid':$v.provinceData.code.$error}"
                    :placeHolder="$t('enterprovincecode')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.provinceData.code.required">{{$t('pleaseenterprovincecode')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-8 col-sm-8 col-lg-8">
              <div class="form-group" :class="{'has-danger':$v.provinceData.name.$error}">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.provinceData.name.$touch"
                    v-model.trim="$v.provinceData.name.$model"
                    :className="{'is-invalid':$v.provinceData.name.$error}"
                    :placeHolder="$t('enterprovincename')"
                    :inputType="'text'"
                  ></v-input>
                  <div class="invalid-feedback">
                    <small v-if="!$v.provinceData.name.required">{{$t('pleaseenterprovincename')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2 col-sm-2 col-lg-2">
              <v-button
                :btnIcon="'fa-edit'"
                :className="'btn-info btn-sm mt-2'"
                v-if="dataselected"
                :disabled="$v.provinceData.$invalid"
                :btnName="$t('update')"
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
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                v-if="!dataselected"
                :btnName="$t('add')"
                :disabled="$v.provinceData.$invalid"
                @onClick="onCreateHandler($event)"
              ></v-button>
            </div>
          </div>
        </div>
      </div>
    </flex-card>
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <h3 class="mb-0">{{$t('provinces')}}</h3>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12 text-right">
              <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
              <v-button :btnName="$t('allexportexcel')" className="btn btn-primary btn-sm" @onClick="exportallData"/>
            </div>
          </div>
        </div>
        <!-- Light table -->
        <div class="table-responsive">
          <div class="table-responsive">
            <small class="text ml-3">{{$t('searchProvince')}}</small>
            <SearchBox @search="onSearchHandler($event)"></SearchBox>
            <vuetable
              ref="vuetable"
              :append-params="moreParams"
              :fields="$store.getters.getProvinceHeader"
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
    required,
    Swal,
    appPlugin
  } from '@/Providers/defaultImports'
  import loadingMixins from '@/mixins/loading'
  import vuetableMixins from '@/mixins/vuetable'
  import defaulcomponentsMixins from '@/mixins/defaultcomponents'
  export default {
    mixins: [loadingMixins,vuetableMixins,defaulcomponentsMixins],
    name: 'index',
    data () {
      return {
        provinceData: {
          name: '',
          code: ''
        },
      }
    },
    created () {
      this.onOpenIndıcator()
      this.$store.dispatch('fetchProvince')
      this.onCloseIndıcator()
    },
    validations: {
      provinceData: {
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
        this.onOpenIndıcator()
        this.$store.dispatch('fetchAllProvince').then((res) => {
          this.onCloseIndıcator()
          if (res.length > 0) {
            const data = res
            const keys = ['pName', 'pCode']
            const header = ['Branş Kodu', 'Branş Adı']
            appPlugin.exportExcelTable(data, 'Branşlar', 14, keys, header)
          } else {
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
        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch('fetchProvince', {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('pName%' + this.txt)
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        } else {
          data = this.$store.dispatch('fetchProvince', {
            httpOpt: httpOptions,
            query: ''
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        }
      },
      onUpdate () {
        if (this.$v.provinceData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('titleCodeRequiredrMsg'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.provinceData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('titleNameRequiredrMsg'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.onOpenIndıcator()
          this.$store.dispatch('updateProvince', this.provinceData).then(res => {
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
                  this.$t('provincewarning'),
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

            this.onResetData()
            this.onRefreshTableContent()
            this.onCloseIndıcator()
          })
        }
      },
      onResetData () {
        this.dataselected = false
        this.selectedData = {}
        this.provinceData = {
          name: '',
          code: ''
        }
      },
      onSelectData (data) {
        this.dataselected = true

        this.provinceData = {
          name: data.pName,
          code: data.pCode,
          id: data.id
        }
      },
      onDelete (item, i) {

        Swal.fire({
          title: 'Branş Adı :' + ' ' + item.pName + '\n' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          icon: 'info',
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.onOpenIndıcator()
            this.$store
              .dispatch('deleteProvince', {
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
                this.onCloseIndıcator()
              })
          }
        })
      },
      onCreateHandler () {
        if (this.$v.provinceData.code.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('titleCodeRequiredrMsg'),
            'warning',
            this.$t('ok')
          )
        } else if (this.$v.provinceData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('titleNameRequiredrMsg'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.onOpenIndıcator()
          let data = {
            created: this.provinceData,
            urlparse: appPlugin.urlParse(
              'pName=' +
              this.provinceData.name +
              '& pCode=' +
              this.provinceData.code
            ),
            orqparse: appPlugin.urlParse('pCode=' + this.provinceData.code)
          }
          this.$store.dispatch('createProvince', data).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(this.$t('succescreatemessage'), '', 'success', this.$t('ok'))
                this.onResetData()
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('provincewarning'),
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
            this.onCloseIndıcator()
          })
        }
      },
      exportExcel () {
        if (this.currentData.data.data.length > 0) {
          const data = this.currentData.data.data
          const keys = ['pName', 'pCode']
          const header = ['Branş Kodu', 'Branş Adı']
          appPlugin.exportExcelTable(data, 'Branşlar', 14, keys, header)
        } else {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('excelExportWarning'),
            'info',
            this.$t('ok')
          )
        }
      },
    }
  }
</script>

<style scoped>
</style>
