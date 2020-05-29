<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="$t('createcompany')">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-8 col-sm-8 col-lg-8">
              <div class="form-group" :class="{ 'has-danger': $v.companyData.name.$error }">
                <div class="input-group input-group-merge">
                  <v-input
                    @onBlurInput="$v.companyData.name.$touch"
                    v-model.trim="$v.companyData.name.$model"
                    :className="{ 'is-invalid': $v.companyData.name.$error }"
                    :placeHolder="$t('entercompanyname')"
                    :inputType="'text'"
                  ></v-input>

                  <div class="invalid-feedback">
                    <small v-if="!$v.companyData.name.required">{{$t('pleaseentercompanyname')}}</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-2 col-sm-2 col-lg-2">
              <v-button
                :btnIcon="'fa-edit'"
                :className="'btn-info'"
                v-if="dataselected"
                :btnName="$t('update')"
                :disabled="$v.companyData.$invalid"
                @onClick="onUpdate($event)"
              ></v-button>
              <v-button
                :btnIcon="'fa-times'"
                :className="'btn-danger'"
                v-if="dataselected"
                :btnName="$t('cancel')"
                @onClick="onCancel($event)"
              ></v-button>
              <v-button
                :disabled="$v.companyData.$invalid"
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
    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <div class="row">
            <div class="col-md-6 col-sm-6 col-lg-6">
              <h3 class="mb-0">{{$t('company')}}</h3>
            </div>
            <div class="col-md-6 col-sm-6 col-lg-6 text-right">
              <v-button :btnName="$t('exportExcel')" className="btn btn-primary btn-sm" @onClick="exportExcel"/>
            </div>
          </div>
        </div>
        <!-- Light table -->
        <div class="table-responsive">
          <small class="text ml-3">{{$t('searchCompany')}}</small>
          <SearchBox @search="onSearchHandler($event)" :placeHolderTxt="$t('search') "></SearchBox>
          <vuetable
            ref="vuetable"
            :append-params="moreParams"
            :fields="$store.getters.getCompaniesHeader"
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
    name: 'index',
    validations: {
      companyData: {
        name: {
          required
        }
      }
    },
    mixins: [loadingMixins, vuetableMixins, defaulcomponentsMixins],
    data () {
      return {
        companyData: {
          name: ''
        },
      }
    },
    methods: {
      onDelete (item, i) {
        Swal.fire({
          title: 'Firma Adı :' + ' ' + item.cName + '\n ' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          confirmButtonColor: 'red',
          icon: 'info',
          cancelButtonText: this.$t('no'),
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.onOpenIndıcator()
            this.$store
              .dispatch('deleteCompanies', {
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
      exportExcel () {
        if (this.currentData.data.data.length > 0) {
          let data = this.currentData.data.data
          let keys = ['cName']
          const header = ['Şirket Adı']
          appPlugin.exportExcelTable(data, 'Şirketler', 14, keys, header)
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
        this.companyData = {
          name: ''
        }
      },
      onUpdate () {
        if (this.$v.companyData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseentercompanyname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.onOpenIndıcator()
          this.$store.dispatch('updateCompanies', this.companyData).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(
                  this.$t('updateSuccesMsg'),
                  '',
                  'success',
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
            this.onCloseIndıcator()
            this.onResetData()
          })
        }
      },
      onSelectData (data) {
        this.dataselected = true
        this.companyData = {
          name: data.cName,
          id: data.id
        }
      },
      onFetchApi (apiUrl, httpOptions) {
        var data
        if (this.txt.trim() != '') {
          data = this.$store.dispatch('fetchCompanies', {
            httpOpt: httpOptions,
            query: appPlugin.urlParse('cName%' + this.txt)
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        } else {
          data = this.$store.dispatch('fetchCompanies', {
            httpOpt: httpOptions
          })
          data.then(res => {
            this.currentData = res
          })
          return data
        }
      },
      onCreateHandler () {
        if (this.$v.companyData.name.$invalid) {
          appPlugin.showalert(
            this.$t('warning'),
            this.$t('pleaseentercompanyname'),
            'warning',
            this.$t('ok')
          )
        } else {
          this.onOpenIndıcator()
          let data = {
            created: this.companyData,
            urlparse: appPlugin.urlParse('cName=' + this.companyData.name)
          }
          this.$store.dispatch('createCompanies', data).then(res => {
            if (res.status) {
              if (res.status === 200) {
                appPlugin.showalert(this.$t('succescreatemessage'), '', 'success', this.$t('ok'))
                this.onResetData()
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('companywarningerror'),
                  '',
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
      }
    }
  }
</script>

<style scoped></style>
